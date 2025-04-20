import Navbar from '../components/Navbar'
import Hero from '../components/Hero'  // Import the Hero component
import StepFlow from '../components/StepFlow'  // Import the StepFlow component
import PneumoniaFacts from '../components/PneumoniaFacts'  // Import the new PneumoniaFacts component
import Footer from '../components/Footer'; // Import the Footer component

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero 
        title="X-ray Insights, AI Precision. Early Detection for Better Health."
        subtitle="Hover to discover more about your health."
        imageUrl="/chest-xray.jpg" // Correct path after moving the image to the public folder
      />
      
      {/* StepFlow component for the interactive steps */}
      <div className="py-0">
        <StepFlow />  {/* This renders the interactive flow of steps */}
      </div>

      {/* Pneumonia Facts Section */}
      <PneumoniaFacts />  {/* This renders the pneumonia facts section */}
      <Footer /> {/* Add Footer here */}

    </>
  );
}
