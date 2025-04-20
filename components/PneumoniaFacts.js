"use client"; // This marks the component as client-side

import { FaHeartbeat, FaChartLine, FaRobot } from "react-icons/fa"; // Importing icons

export default function PneumoniaFacts() {
  return (
    <div className="bg-[#003366] py-16 px-4"> {/* Set background color to the blue shade */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-white">Pneumonia: Early Diagnosis Saves Lives</h2>
        <p className="text-xl text-white">Understand the importance of early diagnosis for better outcomes.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {/* Fact 1 */}
        <div className="bg-white p-6 rounded-lg shadow-lg h-full flex flex-col justify-between transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
          <div className="flex justify-center items-center">
            <FaHeartbeat className="text-[#003366] text-4xl mb-4" /> {/* Icon updated to blue */}
          </div>
          <h3 className="text-2xl font-semibold text-[#003366]">What is Pneumonia?</h3> {/* Heading updated to blue */}
          <p className="text-lg mt-4 text-gray-600 flex-grow">
            Pneumonia is a lung infection caused by bacteria, viruses, or fungi, leading to difficulty breathing and chest pain.
          </p>
          <p className="text-sm mt-4 text-gray-500">
            Early detection and treatment are essential to prevent severe complications and improve patient outcomes.
          </p>
        </div>

        {/* Fact 2 */}
        <div className="bg-white p-6 rounded-lg shadow-lg h-full flex flex-col justify-between transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
          <div className="flex justify-center items-center">
            <FaChartLine className="text-[#003366] text-4xl mb-4" /> {/* Icon updated to blue */}
          </div>
          <h3 className="text-2xl font-semibold text-[#003366]">Why Early Diagnosis Matters</h3> {/* Heading updated to blue */}
          <p className="text-lg mt-4 text-gray-600 flex-grow">
            Early detection of pneumonia is crucial because it helps doctors administer timely treatment, reducing the risk of severe complications.
          </p>
          <p className="text-sm mt-4 text-gray-500">
            Timely diagnosis ensures that patients receive proper treatment before the condition worsens.
          </p>
        </div>

        {/* Fact 3 */}
        <div className="bg-white p-6 rounded-lg shadow-lg h-full flex flex-col justify-between transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
          <div className="flex justify-center items-center">
            <FaRobot className="text-[#003366] text-4xl mb-4" /> {/* Icon updated to blue */}
          </div>
          <h3 className="text-2xl font-semibold text-[#003366]">AI-Powered Diagnosis</h3> {/* Heading updated to blue */}
          <p className="text-lg mt-4 text-gray-600 flex-grow">
            AI-powered tools can analyze medical scans to detect pneumonia early, offering faster and more accurate diagnosis for better patient outcomes.
          </p>
          <p className="text-sm mt-4 text-gray-500">
            Leveraging AI enables quicker, more accurate diagnosis, helping healthcare professionals act swiftly in critical cases.
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <a
          href="#"
          className="text-white text-xl font-semibold hover:underline"
        >
          Learn more about early detection and our AI-driven platform.
        </a>
      </div>
    </div>
  );
}
