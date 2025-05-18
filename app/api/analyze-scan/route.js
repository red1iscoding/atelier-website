// app/api/analyze-scan/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'
import { loadModel, predict } from '@/lib/model/predict'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  const { scan_id } = await request.json()

  try {
    // 1. Get the scan record
    const { data: scan, error } = await supabase
      .from('scans')
      .select('*')
      .eq('scan_id', scan_id)
      .single()

    if (error) throw error
    if (scan.diagnosis_status !== 'pending') {
      return NextResponse.json({ message: 'Scan already processed' })
    }

    // 2. Download the image from Supabase storage
    const { data: imageBlob } = await supabase.storage
      .from('medical-scans')
      .download(scan.file_path)

    // 3. Convert blob to image element
    const imageUrl = URL.createObjectURL(imageBlob)
    const img = new Image()
    img.src = imageUrl
    await new Promise((resolve) => { img.onload = resolve })

    // 4. Load model and predict
    const session = await loadModel()
    const result = await predict(session, img)

    if (!result.isValid) throw new Error('Prediction failed')

    // 5. Determine diagnosis
    const { normal, pneumonia, cancer } = result.probabilities
    let diagnosis = 'Normal'
    let confidence = normal
    
    if (pneumonia > normal && pneumonia > cancer) {
      diagnosis = 'Pneumonia'
      confidence = pneumonia
    } else if (cancer > normal && cancer > pneumonia) {
      diagnosis = 'Lung Cancer'
      confidence = cancer
    }

    // 6. Update scan record
    const { error: updateError } = await supabase
      .from('scans')
      .update({
        diagnosis_status: 'completed',
        diagnosis_type: diagnosis,
        confidence_score: confidence * 100, // convert to percentage
        analysis_date: new Date().toISOString()
      })
      .eq('scan_id', scan_id)

    if (updateError) throw updateError

    return NextResponse.json({ success: true, diagnosis, confidence })

  } catch (error) {
    // Mark as failed if error occurs
    await supabase
      .from('scans')
      .update({ diagnosis_status: 'failed' })
      .eq('scan_id', scan_id)
      
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}