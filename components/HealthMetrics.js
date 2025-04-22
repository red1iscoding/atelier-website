import { FaFileMedical, FaHeartbeat } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement,   
  LineElement,    
  Title,          
  Tooltip,        
  Legend          
);

// Static, made-up health history data for the last 3 years
export default function HealthMetrics() {
  const healthHistory = [
    { date: '2025-03-15', scanType: 'X-ray', diagnosis: 'No signs of pneumonia', status: 'Normal', confidence: 98 },
    { date: '2024-12-20', scanType: 'X-ray', diagnosis: 'Healthy lungs', status: 'Normal', confidence: 95 },
    { date: '2023-11-10', scanType: 'X-ray', diagnosis: 'Pneumonia detected', status: 'Immediate treatment needed', confidence: 60 },
  ];

  // Data for the progression graph (AI confidence over time)
  const chartData = {
    labels: healthHistory.map(entry => entry.date),
    datasets: [
      {
        label: 'AI Confidence (%)',
        data: healthHistory.map(entry => entry.confidence),
        fill: false,
        borderColor: '#003366',  // Brand color for the line
        tension: 0.1,
        pointBackgroundColor: '#003366',  // Points color
        pointRadius: 5, // Larger points
        borderWidth: 2, // Thicker line
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'AI Confidence (%)',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Scan Date',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          maxRotation: 45,  // Rotate the labels to prevent overlap
          minRotation: 30,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Pneumonia Detection - AI Confidence Over Time',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
          },
        },
      },
    },
    layout: {
      padding: 20,
    },
    elements: {
      point: {
        radius: 6,
        hitRadius: 10,
        hoverRadius: 8,
      },
    },
    // Background color for the chart
    backgroundColor: 'white',
  };

  return (
    <div className="p-6 mt-8 bg-white shadow-lg rounded-lg flex items-center">
      <FaFileMedical className="text-[#003366] text-3xl mr-4" />
      <div>
        <h2 className="text-xl font-semibold mb-4 text-[#003366]">Pneumonia Detection History</h2>
        <p className="text-[#444444]">Your lung scan history and AI detection results over time.</p>

        {/* Line Chart for AI Confidence Over Time */}
        <div className="bg-white p-4 mt-6 rounded-lg">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Shortened Timeline for Health History */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-[#003366]">Scan History Timeline</h3>
          <div className="relative mt-4">
            {healthHistory.map((entry, index) => (
              <div key={index} className="relative flex items-center mb-4"> {/* Reduced margin */}
                {/* Circle for Timeline */}
                <div className="absolute left-0 transform -translate-x-1/2 w-4 h-4 rounded-full bg-[#003366]" />
                <div className="ml-6 pl-4 py-3 border-l-2 border-gray-300"> {/* Reduced padding */}
                  <div className="text-sm text-gray-600">{entry.date}</div>
                  <div className="text-lg font-semibold text-gray-800">{entry.scanType}</div>
                  <p className="text-gray-600">{entry.diagnosis}</p>
                  <div className={`text-sm ${entry.status === 'Normal' ? 'text-green-500' : 'text-yellow-500'}`}>{entry.status}</div>
                  <div className="flex items-center mt-2">
                    <FaHeartbeat className="text-gray-500 mr-2" />
                    <p className="text-sm text-gray-600">Confidence: {entry.confidence}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
