'use client';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { RiStethoscopeLine, RiUploadCloudLine, RiShieldCheckLine } from 'react-icons/ri';
import { FaRegClock, FaRegMoneyBillAlt, FaLock } from 'react-icons/fa';
import { MdHealthAndSafety, MdOutlinePrivacyTip } from 'react-icons/md';

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How accurate is TrustScan's AI at detecting pneumonia?",
      answer: "Our AI model achieves 95% accuracy in detecting pneumonia from chest X-rays, validated against thousands of confirmed cases. However, all results are reviewed by medical professionals before final diagnosis.",
      icon: <RiStethoscopeLine className="text-[#003366] text-2xl" />
    },
    {
      question: "What types of scans can I upload?",
      answer: "We accept chest X-rays (JPEG, PNG), CT scans (DICOM format), and MRI images. Maximum file size is 25MB. For best results, ensure your scans are clear and properly cropped.",
      icon: <RiUploadCloudLine className="text-[#003366] text-2xl" />
    },
    {
      question: "How long does it take to get results?",
      answer: "AI analysis typically completes within 5-10 minutes. For comprehensive reviews by our medical team, allow 24-48 hours. You'll receive notifications when results are ready.",
      icon: <FaRegClock className="text-[#003366] text-2xl" />
    },
    {
      question: "Is my medical data secure?",
      answer: "Absolutely. We use bank-level encryption (AES-256) and HIPAA-compliant storage. Your scans are anonymized and never shared without your consent.",
      icon: <RiShieldCheckLine className="text-[#003366] text-2xl" />
    },
    {
      question: "How much does TrustScan cost?",
      answer: "Basic AI analysis is free. Professional physician reviews start at $29. We offer subscription plans for frequent users and bulk discounts for healthcare providers.",
      icon: <FaRegMoneyBillAlt className="text-[#003366] text-2xl" />
    },
    {
      question: "Can I consult with a doctor through TrustScan?",
      answer: "Yes! After receiving your AI results, you can schedule video consultations with board-certified radiologists starting at $49. Many insurance plans are accepted.",
      icon: <MdHealthAndSafety className="text-[#003366] text-2xl" />
    },
    {
      question: "Who can access my scan results?",
      answer: "Only you and healthcare professionals you authorize. We never sell or share your data. You control all sharing permissions through your dashboard.",
      icon: <FaLock className="text-[#003366] text-2xl" />
    },
    {
      question: "What makes TrustScan different from hospital diagnostics?",
      answer: "We combine AI speed with human expertise. While hospitals take days, we deliver preliminary AI results in minutes, followed by optional physician review - all from home.",
      icon: <MdOutlinePrivacyTip className="text-[#003366] text-2xl" />
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        {/* Hero Section with increased top padding */}
        <section className="text-center mb-16 pt-24 md:pt-28">
          <h1 className="text-4xl md:text-5xl font-bold text-[#003366] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about TrustScan's AI diagnostics
          </p>
        </section>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto mb-20">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="mb-4 border border-gray-200 rounded-xl overflow-hidden transition-all hover:shadow-sm"
            >
              <button
                className={`w-full flex items-center justify-between p-6 text-left transition-colors ${activeIndex === index ? 'bg-[#003366]/10' : 'bg-white hover:bg-gray-50'}`}
                onClick={() => toggleAccordion(index)}
                aria-expanded={activeIndex === index}
                aria-controls={`faq-${index}`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0">
                    {faq.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-[#003366] text-left">
                    {faq.question}
                  </h3>
                </div>
                <svg
                  className={`w-6 h-6 text-[#003366] transform transition-transform flex-shrink-0 ${activeIndex === index ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div
                id={`faq-${index}`}
                className={`px-6 pb-6 pt-2 transition-all ${activeIndex === index ? 'block animate-fadeIn' : 'hidden'}`}
              >
                <div className="pl-10 text-gray-600">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support CTA Section */}
        <section className="bg-[#003366]/5 rounded-2xl p-8 md:p-12 text-center mb-16">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[#003366] mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-600 mb-6">
              Our support team is available 24/7 to help with any questions about our platform or your results.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-[#003366] text-white py-3 px-8 rounded-full font-semibold hover:bg-[#002244] transition shadow-sm">
                Contact Support
              </button>
              <button className="bg-white text-[#003366] border border-[#003366] py-3 px-8 rounded-full font-semibold hover:bg-[#003366]/10 transition shadow-sm">
                Live Chat
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer (Add your footer component here if needed) */}
    </div>
  );
}