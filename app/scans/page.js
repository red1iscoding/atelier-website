'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function PatientScans() {
  const [scans, setScans] = useState([])
  const [selectedScan, setSelectedScan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeoutReached, setTimeoutReached] = useState(false)

  // Set a timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setTimeoutReached(true)
        setError({
          type: 'TIMEOUT_ERROR',
          message: 'Loading is taking longer than expected',
          details: 'Please check your internet connection',
          action: 'retry'
        })
        setLoading(false)
      }
    }, 10000) // 10 second timeout

    return () => clearTimeout(timer)
  }, [loading])

  // Fetch scans with comprehensive error handling
  const fetchScans = async () => {
    setLoading(true)
    setError(null)
    setTimeoutReached(false)
    
    try {
      // 1. Get authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) throw authError

      // 2. Get the integer user_id from users table
      const { data: appUser, error: userError } = await supabase
        .from('users')
        .select('user_id')
        .eq('auth_id', user.id)
        .maybeSingle()

      if (userError || !appUser) {
        throw new Error('User account not properly linked')
      }

      // 3. Fetch scans with proper timeout
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 8000) // 8 second timeout for fetch

      const { data, error: fetchError } = await supabase
        .from('scans')
        .select(`
          scan_id,
          scan_type,
          file_name,
          file_path,
          file_type,
          created_at,
          status
        `)
        .eq('user_id', appUser.user_id)
        .order('created_at', { ascending: false })
        .abortSignal(controller.signal)

      clearTimeout(timeout)

      if (fetchError) throw fetchError
      setScans(data || [])

    } catch (err) {
      console.error('Fetch error:', err)
      setError({
        type: err.name === 'AbortError' ? 'TIMEOUT_ERROR' : 'DATABASE_ERROR',
        message: err.name === 'AbortError' 
          ? 'Request timed out' 
          : 'Failed to load scans',
        details: err.message,
        action: 'retry'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScans()
  }, [])

  if (loading && !timeoutReached) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p>Loading your scans...</p>
        <p className="text-sm text-gray-500 mt-2">This should only take a moment</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded max-w-2xl mx-auto">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{error.message}</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error.details}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={fetchScans}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Medical Scans</h1>
      
      {scans.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No scans found</h3>
          <p className="mt-1 text-sm text-gray-500">You haven't uploaded any scans yet.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scan Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scans.map((scan) => (
                <tr key={scan.scan_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                    {scan.scan_type?.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {scan.file_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(scan.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      scan.status === 'processed' ? 'bg-green-100 text-green-800' :
                      scan.status === 'pending_review' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {scan.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => setSelectedScan(scan)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Preview
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Preview Modal */}
      {selectedScan && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Scan Preview</h2>
                <button
                  onClick={() => setSelectedScan(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Scan Type</p>
                  <p className="font-medium capitalize">{selectedScan.scan_type?.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Upload Date</p>
                  <p className="font-medium">{new Date(selectedScan.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">File Name</p>
                  <p className="font-medium">{selectedScan.file_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`font-medium capitalize ${
                    selectedScan.status === 'processed' ? 'text-green-600' :
                    selectedScan.status === 'pending_review' ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {selectedScan.status?.replace('_', ' ')}
                  </p>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden bg-gray-100">
                {selectedScan.file_type?.includes('pdf') ? (
                  <iframe
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/medical-scans/${selectedScan.file_path}`}
                    className="w-full h-[70vh]"
                    title="PDF Preview"
                  />
                ) : (
                  <img
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/medical-scans/${selectedScan.file_path}`}
                    alt="Medical Scan"
                    className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                    onError={(e) => {
                      console.error("Failed to load image")
                      e.target.src = '/image-error-placeholder.png'
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}