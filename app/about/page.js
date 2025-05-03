'use client';
import { FaHeartbeat, FaUserMd, FaLightbulb, FaShieldAlt } from 'react-icons/fa';
import { GiHealthNormal } from 'react-icons/gi';
import Navbar from '../../components/Navbar';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="overflow-hidden">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-[#003366] to-[#0066cc] text-white pt-32 pb-20">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Revolutionizing Healthcare Through AI</h1>
              <p className="text-xl opacity-90 mb-4">
                TrustScan bridges the gap between cutting-edge technology and compassionate patient care
              </p>
              <p className="text-lg opacity-80">
                Founded in 2025 by Haddad Redouane and Hanchi Belkis, TrustScan combines medical expertise with artificial intelligence to deliver faster, more accurate diagnostic results.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <img 
                  src="/images/about-img.jpg"
                  alt="Medical team discussing scan results"
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-bold text-[#003366] mb-6">Our Story</h2>
                <p className="text-gray-600 mb-4">
                  TrustScan was born from a shared vision between co-founders Haddad Redouane (AI specialist) and Hanchi Belkis (medical doctor) to transform diagnostic medicine. Their collaboration began at a healthcare innovation summit in early 2025.
                </p>
                <p className="text-gray-600">
                  What started as a research project has grown into a platform serving thousands of patients, with our AI models now analyzing over 50,000 scans monthly. We're proud to have reduced pneumonia diagnosis times by an average of 72% for our users.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#003366] mb-4">Meet Our Founders</h2>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-12">
              {/* Founder 1 */}
              <div className="text-center">
                <img 
                  src="/images/redpic.JPG"
                  alt="Haddad Redouane"
                  className="h-64 w-64 mx-auto mb-4 rounded-full object-cover border-4 border-[#003366]/20"
                />
                <h3 className="text-xl font-bold text-[#003366]">Haddad Redouane</h3>
                <p className="text-gray-500 mb-2">Co-Founder & AI Architect</p>
                <p className="text-gray-600 max-w-xs mx-auto">
                  Former AI researcher at Stanford, specializing in medical imaging algorithms
                </p>
              </div>

              {/* Founder 2 - Belkis with actual image */}
              <div className="text-center">
                <img 
                  src="/images/belkispic.png"
                  alt="Hanchi Belkis"
                  className="h-64 w-64 mx-auto mb-4 rounded-full object-cover border-4 border-[#003366]/20"
                />
                <h3 className="text-xl font-bold text-[#003366]">Hanchi Belkis</h3>
                <p className="text-gray-500 mb-2">Co-Founder & Medical Director</p>
                <p className="text-gray-600 max-w-xs mx-auto">
                  Board-certified radiologist with 10+ years of clinical experience
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#003366] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Experience the Future of Healthcare?</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-[#003366] py-3 px-8 rounded-full font-semibold hover:bg-gray-100 transition">
                Get Started
              </button>
              <button className="bg-transparent border-2 border-white py-3 px-8 rounded-full font-semibold hover:bg-white/10 transition">
                Meet Our Team
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}