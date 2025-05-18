'use client';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';

export default function EducationalResources() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        {/* Main content area with optimized spacing */}
        <main className="flex-1 p-6 ml-56 mt-20">
          <div className="max-w-3xl mx-auto">
            
            {/* Hero Section */}
            <div className="mb-12">
              <div className="h-1.5 w-20 bg-[#003366] mb-4"></div>
              <h1 className="text-4xl font-light text-[#003366] mb-3 leading-tight">
                Understanding <span className="font-semibold">Pneumonia</span>
              </h1>
              <p className="text-gray-600">
                How our AI technology revolutionizes pneumonia detection and diagnosis.
              </p>
            </div>

            {/* Pneumonia Basics Section */}
            <section className="mb-16">
              <h2 className="text-2xl font-light text-[#003366] mb-6">
                <span className="font-medium">What is</span> Pneumonia?
              </h2>
              
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  Pneumonia is an inflammatory condition of the lungs that primarily affects the air sacs (alveoli). It can be caused by various organisms including bacteria, viruses, and fungi. The condition ranges from mild to life-threatening, particularly in infants, young children, and older adults.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border-l-2 border-[#003366] pl-4 py-2">
                    <h3 className="font-medium text-[#003366] mb-2">Key Facts:</h3>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li>• Accounts for 15% of childhood deaths globally</li>
                      <li>• Early detection reduces complications by 40%</li>
                      <li>• Different types require different treatments</li>
                    </ul>
                  </div>
                  <div className="border-l-2 border-[#003366] pl-4 py-2">
                    <h3 className="font-medium text-[#003366] mb-2">Common Symptoms:</h3>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li>• Cough with phlegm</li>
                      <li>• Fever, chills, and sweating</li>
                      <li>• Shortness of breath</li>
                      <li>• Chest pain when breathing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* AI Detection Section */}
            <section className="mb-16">
              <h2 className="text-2xl font-light text-[#003366] mb-6">
                <span className="font-medium">Our AI</span> Detection Technology
              </h2>
              
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                    <div className="text-[#003366] text-2xl font-light mb-1">01</div>
                    <h3 className="font-medium text-[#003366] mb-2">Scan Upload</h3>
                    <p className="text-gray-600 text-sm">
                      Patients securely upload chest X-rays through our encrypted platform
                    </p>
                  </div>
                  <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                    <div className="text-[#003366] text-2xl font-light mb-1">02</div>
                    <h3 className="font-medium text-[#003366] mb-2">AI Analysis</h3>
                    <p className="text-gray-600 text-sm">
                      Our CNN examines 128+ visual features with 96.3% accuracy
                    </p>
                  </div>
                  <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                    <div className="text-[#003366] text-2xl font-light mb-1">03</div>
                    <h3 className="font-medium text-[#003366] mb-2">Results</h3>
                    <p className="text-gray-600 text-sm">
                      Detailed report generated in under 2 minutes
                    </p>
                  </div>
                </div>
                
                <div className="bg-[#003366] bg-opacity-5 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-[#003366] mb-3">Technical Advantages</h3>
                  <ul className="grid md:grid-cols-2 gap-4 text-gray-700 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-[#003366] mt-0.5">✓</span>
                      <span>Identifies subtle patterns invisible to human eye</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#003366] mt-0.5">✓</span>
                      <span>Consistent performance 24/7 without fatigue</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#003366] mt-0.5">✓</span>
                      <span>Continuously improves with new cases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#003366] mt-0.5">✓</span>
                      <span>Provides instant second opinions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Prevention Section */}
            <section className="mb-16">
              <h2 className="text-2xl font-light text-[#003366] mb-6">
                <span className="font-medium">Prevention</span> & Protection
              </h2>
              
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  While our AI provides rapid diagnosis, prevention remains crucial. These evidence-based strategies can significantly reduce pneumonia risk:
                </p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border-t-2 border-[#003366] pt-3">
                    <h3 className="font-medium text-[#003366] mb-2">Vaccination</h3>
                    <p className="text-gray-600 text-sm">
                      Pneumococcal and influenza vaccines reduce risk by 50-70%
                    </p>
                  </div>
                  <div className="border-t-2 border-[#003366] pt-3">
                    <h3 className="font-medium text-[#003366] mb-2">Hygiene</h3>
                    <p className="text-gray-600 text-sm">
                      Proper handwashing and respiratory etiquette
                    </p>
                  </div>
                  <div className="border-t-2 border-[#003366] pt-3">
                    <h3 className="font-medium text-[#003366] mb-2">Lifestyle</h3>
                    <p className="text-gray-600 text-sm">
                      Smoking cessation and balanced nutrition
                    </p>
                  </div>
                </div>
                
                <div className="bg-[#003366] text-white p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">When to Seek Medical Help</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Difficulty breathing or rapid breathing</li>
                    <li>• Chest pain that worsens when breathing</li>
                    <li>• Fever above 102°F (39°C) lasting more than 3 days</li>
                    <li>• Confusion (especially in elderly)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <div className="text-center py-8 border-t border-gray-200 mt-12">
              <h2 className="text-2xl font-light text-[#003366] mb-3">
                Ready to <span className="font-medium">check your lung health</span>?
              </h2>
              <p className="text-gray-600 mb-6 max-w-lg mx-auto text-sm">
                Our AI-powered analysis provides fast, accurate results to give you peace of mind
              </p>
              <button className="bg-[#003366] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition">
                Upload Your Scan Now
              </button>
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}