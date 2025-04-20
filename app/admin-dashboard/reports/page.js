'use client';

const Reports = () => {
  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-white">
      <div className="flex-1 p-6 mt-20">
        <h2 className="text-2xl font-semibold mb-6">Reports & Analytics</h2>
        {/* Example of a report/analytics chart */}
        <div className="bg-gray-800 dark:bg-gray-900 p-4 rounded shadow-lg">
          <p className="text-white">Charts or reports will go here</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
