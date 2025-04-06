"use client"; // This marks the component as client-side

import { useState, useEffect } from "react";

export default function StepFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isResetting, setIsResetting] = useState(false); // Track if all images should disappear
  const steps = [
    { id: 1, title: "Patient Data Collected", description: "Gathering all relevant patient data, including previous medical history.", imageUrl: "/step1.png" },
    { id: 2, title: "AI Identifies Findings", description: "The AI model identifies potential health issues.", imageUrl: "/step2.png" },
    { id: 3, title: "Review & Assess Risk", description: "Healthcare professionals review and assess the AI findings.", imageUrl: "/step3.png" },
    { id: 4, title: "Acute Findings", description: "Flagging immediate health risks for urgent action.", imageUrl: "/step4.png" },
    { id: 5, title: "Route to Care Teams", description: "Route to appropriate care teams for treatment.", imageUrl: "/step5.png" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isResetting) {
        if (currentStep === steps.length - 1) {
          // After Step 5, trigger all steps to disappear and reset the cycle
          setIsResetting(true);
        } else {
          // Move to the next step
          setCurrentStep((prevStep) => prevStep + 1);
        }
      } else {
        // Hide all steps for 1 second before resetting to Step 1
        setTimeout(() => {
          setIsResetting(false); // Resetting to continue the cycle
          setCurrentStep(0); // Start the cycle again from Step 1
        }, 1000); // Delay before restarting the cycle
      }
    }, 2500); // Delay between each step appearing (2.5 seconds)
    return () => clearInterval(interval); // Clear interval on component unmount
  }, [steps.length, currentStep, isResetting]);

  return (
    <div className="bg-white py-16">
      <div className="text-center mb-10">
        {/* Header with red color and description */}
        <h2 className="text-4xl font-bold text-red-600">How TrustScan Works</h2> {/* Text now red */}
        <p className="text-lg mt-2 text-gray-600">Discover the seamless process of how TrustScan helps detect early health issues through advanced AI technology.</p> {/* New description */}
      </div>

      <div className="flex justify-center space-x-10">
        {/* Map over the steps and display them */}
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="relative group cursor-pointer"
            style={{
              backgroundColor: "white", // White background for each step's card
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0)", // Optional: add a subtle shadow effect
              opacity: isResetting || currentStep !== index ? 0 : 1, // Hide the steps when resetting
              transition: "opacity 1s ease-in-out", // Smooth transition for opacity
            }}
          >
            {/* Step Image */}
            {step.imageUrl && (
              <img
                src={step.imageUrl}
                alt={step.title}
                className="mt-4 max-w-xs h-auto rounded-lg transition-all duration-500"
              />
            )}

            {/* Step Title */}
            <p className="text-center mt-4 font-semibold text-lg" style={{ color: "#DE0B0B" }}>
              {currentStep === index ? step.title : ""}
            </p>

            {/* Step Description */}
            <div
              className={`absolute top-24 left-1/2 transform -translate-x-1/2 opacity-0 transition-opacity duration-500`}
              style={{
                display: currentStep === index ? "block" : "none",
                color: "#DE0B0B", // Set the text color to #DE0B0B for the description
              }}
            >
              <p className="text-sm">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
