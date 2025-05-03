'use client';
import { FaUpload, FaHistory, FaComments, FaBell } from 'react-icons/fa';
import { AiOutlineSchedule } from 'react-icons/ai';
import { MdHealthAndSafety } from 'react-icons/md';
import { RiAiGenerate } from 'react-icons/ri';
import Navbar from '../../components/Navbar';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#003366] mb-4">TrustScan Features</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your complete health companion - from AI-powered scan analysis to seamless doctor consultations
          </p>
        </section>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {/* Feature 1: Scan Upload */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="bg-[#003366]/10 p-4 rounded-full w-max mb-6">
              <FaUpload className="text-[#003366] text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-[#003366] mb-3">Easy Scan Upload</h3>
            <p className="text-gray-600">
              Upload X-rays, CT scans, or MRIs in seconds. We accept JPEG, PNG, and PDF formats.
            </p>
          </div>

          {/* Feature 2: AI Analysis */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="bg-[#003366]/10 p-4 rounded-full w-max mb-6">
              <RiAiGenerate className="text-[#003366] text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-[#003366] mb-3">AI-Powered Analysis</h3>
            <p className="text-gray-600">
              Our deep learning model detects pneumonia with 95% accuracy, giving you instant results with confidence scores.
            </p>
          </div>

          {/* Feature 3: Consultations */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="bg-[#003366]/10 p-4 rounded-full w-max mb-6">
              <AiOutlineSchedule className="text-[#003366] text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-[#003366] mb-3">Doctor Consultations</h3>
            <p className="text-gray-600">
              Schedule video or in-person appointments with specialists who review your AI results.
            </p>
          </div>

          {/* Feature 4: Health History */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="bg-[#003366]/10 p-4 rounded-full w-max mb-6">
              <FaHistory className="text-[#003366] text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-[#003366] mb-3">Health History</h3>
            <p className="text-gray-600">
              Track all your scans and consultations in one secure place with timeline visualization.
            </p>
          </div>

          {/* Feature 5: Messaging */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="bg-[#003366]/10 p-4 rounded-full w-max mb-6">
              <FaComments className="text-[#003366] text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-[#003366] mb-3">Secure Messaging</h3>
            <p className="text-gray-600">
              Message doctors directly about your results or ask follow-up questions.
            </p>
          </div>

          {/* Feature 6: Reminders */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="bg-[#003366]/10 p-4 rounded-full w-max mb-6">
              <FaBell className="text-[#003366] text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-[#003366] mb-3">Smart Reminders</h3>
            <p className="text-gray-600">
              Get alerts for appointments, when results are ready, and important health updates.
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <section className="bg-[#003366]/5 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#003366]">How Our AI Detection Works</h2>
            <div className="w-24 h-1 bg-[#003366] mx-auto mt-4"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-[#003366] mb-4">Deep Learning Technology</h3>
                <p className="text-gray-600 mb-4">
                  Our system uses convolutional neural networks (CNNs) trained on thousands of verified pneumonia cases to identify patterns in your scans.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="bg-[#003366] text-white rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
                    <span className="text-gray-600">Analyzes lung opacity and consolidation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#003366] text-white rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
                    <span className="text-gray-600">Provides confidence scores for each finding</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#003366] text-white rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
                    <span className="text-gray-600">Continuously improves with new data</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex-1">
              <div className="bg-white p-6 rounded-lg shadow-sm h-full">
                <h3 className="text-lg font-semibold text-[#003366] mb-4">For Patients</h3>
                <p className="text-gray-600 mb-6">
                  You'll receive an easy-to-understand report highlighting areas of concern and recommended next steps, all within minutes of uploading your scan.
                </p>
                <div className="bg-[#003366]/10 p-4 rounded-lg border-l-4 border-[#003366]">
                  <p className="text-[#003366] italic">
                    "TrustScan's AI flagged my pneumonia early - my doctor confirmed the diagnosis and treatment was much easier because we caught it quickly."
                  </p>
                  <p className="text-sm text-[#003366] mt-2 font-medium">- Satisfied Patient</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}