"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Sidebar from "../../components/Sidebar";
import { 
  FaFileMedical, 
  FaUser, 
  FaCalendarAlt, 
  FaDiagnoses,
  FaPercentage,
  FaClock,
  FaCloudDownloadAlt,
  FaExclamationTriangle,
  FaSpinner,
  FaHeartbeat,
  FaNotesMedical
} from 'react-icons/fa';

export default function ScanResults() {
  const [scans, setScans] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrls, setImageUrls] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  useEffect(() => {
    const userId = sessionStorage.getItem('user_id') || localStorage.getItem('user_id');
    if (userId) {
      setLoggedInUserId(userId);
      fetchUserData(userId);
    } else {
      setError('Please log in to view your scan results');
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      setUserData(data);
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  useEffect(() => {
    if (!loggedInUserId) return;

    const fetchUserScans = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('scans')
          .select('*')
          .eq('user_id', loggedInUserId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
          setError('No scans found. Book an appointment to get your scans analyzed.');
          return;
        }

        setScans(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch scans');
      } finally {
        setLoading(false);
      }
    };

    fetchUserScans();
  }, [loggedInUserId]);

  useEffect(() => {
    if (!scans.length) return;

    const urlsToRevoke = [];
    const fetchImages = async () => {
      const newImageUrls = {};
      const newImageErrors = {};

      for (const scan of scans) {
        try {
          if (!scan.file_path) {
            newImageErrors[scan.scan_id] = true;
            continue;
          }

          let path = scan.file_path.startsWith('medical-scans/') 
            ? scan.file_path.replace('medical-scans/', '') 
            : scan.file_path;

          const { data, error } = await supabase.storage
            .from('medical-scans')
            .download(path);

          if (error || !data) {
            newImageErrors[scan.scan_id] = true;
            continue;
          }

          const url = URL.createObjectURL(data);
          urlsToRevoke.push(url);
          newImageUrls[scan.scan_id] = url;
          newImageErrors[scan.scan_id] = false;
        } catch (err) {
          newImageErrors[scan.scan_id] = true;
        }
      }

      setImageUrls(newImageUrls);
      setImageErrors(newImageErrors);
    };

    fetchImages();

    return () => {
      urlsToRevoke.forEach(url => URL.revokeObjectURL(url));
    };
  }, [scans]);

  const getDiagnosisColor = (diagnosis) => {
    if (!diagnosis) return 'bg-gray-100 text-gray-800 border-gray-200';
    const normalized = diagnosis.toLowerCase();
    if (normalized.includes('normal')) return 'bg-green-100 text-green-800 border-green-200';
    if (normalized.includes('pneumonia') || normalized.includes('lung cancer')) 
      return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const renderDiagnosisSection = (scan) => {
    if (scan.diagnosis_status !== 'completed') {
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg my-6 animate-pulse">
          <div className="flex items-center">
            {scan.diagnosis_status === 'processing' ? (
              <FaSpinner className="animate-spin text-yellow-500 mr-3" />
            ) : (
              <FaExclamationTriangle className="text-yellow-500 mr-3" />
            )}
            <div>
              <h3 className="font-medium text-yellow-800">
                {scan.diagnosis_status === 'processing' 
                  ? "Analysis in Progress" 
                  : "Analysis Not Completed"}
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                {scan.diagnosis_status === 'processing'
                  ? "Your scan is being analyzed. This usually takes a few minutes."
                  : "Please check back later or contact support if this persists."}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-8 space-y-6">
        <h2 className="text-2xl font-bold text-[#003366] mb-6 flex items-center gap-2">
          <FaDiagnoses className="text-[#005588]" /> 
          <span>Diagnosis Results</span>
        </h2>

        {/* Condition Badge */}
        <div className="flex flex-col gap-2">
          <span className="text-lg font-medium text-gray-700">Condition Detected</span>
          <div className={`px-4 py-3 rounded-full inline-flex items-center ${getDiagnosisColor(scan.diagnosis_type)} border`}>
            {scan.diagnosis_type === 'normal' && <FaHeartbeat className="mr-2" />}
            {(scan.diagnosis_type?.includes('pneumonia') || scan.diagnosis_type?.includes('lung cancer')) && (
              <FaExclamationTriangle className="mr-2" />
            )}
            <span className="font-bold capitalize">
              {scan.diagnosis_type?.replace('_', ' ') || 'Not specified'}
            </span>
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-lg font-medium text-gray-700">Confidence Level</span>
            <span className="font-bold text-gray-700">{scan.confidence_score}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="h-2.5 rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${scan.confidence_score}%`,
                backgroundColor: scan.confidence_score > 80 ? '#10B981' : 
                                scan.confidence_score > 50 ? '#F59E0B' : '#EF4444'
              }}
            ></div>
          </div>
        </div>

        {/* Analysis Timeline */}
        <div className="flex items-center gap-4 pt-2">
          <div className="flex-1">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="h-1 flex-1 mx-2 bg-green-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>
          <span className="text-sm font-medium text-gray-600">Completed</span>
        </div>

        {/* Analysis Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Analysis Date</h3>
            <p className="text-gray-800">{new Date(scan.analysis_date).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Processing Time</h3>
            <p className="text-gray-800">{(scan.processing_time / 1000).toFixed(2)} seconds</p>
          </div>
        </div>

        {/* Additional Notes */}
        {scan.notes && (
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Additional Notes</h3>
            <p className="text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">
              {scan.notes}
            </p>
          </div>
        )}

        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition-all hover:scale-[1.02] flex items-center gap-2"
          >
            <FaCloudDownloadAlt /> 
            <span>Download Full Report</span>
          </button>
        </div>
      </div>
    );
  };

  const renderScanCard = (scan) => {
    return (
      <div key={scan.scan_id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-8 transition-all hover:shadow-lg">
        {/* Scan Header */}
        <div className="p-4 bg-gradient-to-r from-[#003366] to-[#005588] text-white flex items-center rounded-t-xl">
          <FaFileMedical className="mr-2 text-blue-100" />
          <h2 className="font-medium">{scan.file_name || 'Untitled Scan'}</h2>
          <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded-full">
            {new Date(scan.created_at).toLocaleDateString()}
          </span>
        </div>
        
        <div className="p-6">
          {/* Scan Image and Basic Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Scan Image */}
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              {imageErrors[scan.scan_id] ? (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-100 text-gray-400">
                  <FaExclamationTriangle className="text-yellow-500 mb-2 text-2xl" />
                  <p>Image unavailable</p>
                </div>
              ) : !imageUrls[scan.scan_id] ? (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-100">
                  <FaSpinner className="animate-spin text-[#003366] mb-2 text-2xl" />
                  <p className="text-gray-500">Loading image...</p>
                </div>
              ) : (
                <>
                  <div className="h-64 bg-black flex items-center justify-center overflow-hidden rounded-lg group">
                    <img
                      src={imageUrls[scan.scan_id]}
                      alt={`Medical scan ${scan.file_name}`}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {scan.file_type || 'Unknown file type'}
                    </span>
                    <a
                      href={imageUrls[scan.scan_id]}
                      download={scan.file_name || 'scan'}
                      className="inline-flex items-center text-sm text-[#003366] hover:text-[#002244] transition-colors"
                    >
                      <FaCloudDownloadAlt className="mr-1" /> Download
                    </a>
                  </div>
                </>
              )}
            </div>

            {/* User and Scan Details */}
            <div className="space-y-6">
              {/* User Information */}
              {userData && (
                <div>
                  <h3 className="text-xl font-bold text-[#003366] mb-4 flex items-center gap-2">
                    <FaUser className="text-[#005588]" />
                    <span>Patient Information</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 bg-opacity-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmYiLz48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjZWVlIi8+PC9zdmc+')]">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Full Name</p>
                      <p className="font-medium text-gray-800">{userData.full_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Gender</p>
                      <p className="font-medium text-gray-800 capitalize">{userData.gender || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Date of Birth</p>
                      <p className="font-medium text-gray-800">
                        {userData.date_of_birth ? new Date(userData.date_of_birth).toLocaleDateString() : 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Member Since</p>
                      <p className="font-medium text-gray-800">
                        {new Date(userData.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Scan Metadata */}
              <div>
                <h3 className="text-xl font-bold text-[#003366] mb-4 flex items-center gap-2">
                  <FaFileMedical className="text-[#005588]" />
                  <span>Scan Details</span>
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Scan Type</p>
                    <p className="font-medium text-gray-800 capitalize">{scan.scan_type || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Upload Date</p>
                    <p className="font-medium text-gray-800">
                      {new Date(scan.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">File Size</p>
                    <p className="font-medium text-gray-800">
                      {scan.file_size ? `${(scan.file_size / (1024 * 1024)).toFixed(2)} MB` : 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
                    <p className="font-medium text-gray-800 capitalize">
                      {scan.diagnosis_status || 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnosis Results Section */}
          {renderDiagnosisSection(scan)}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold text-[#003366]">Your Medical Scan Results</h1>
              {scans.length > 0 && (
                <span className="text-sm bg-[#003366] text-white px-3 py-1 rounded-full">
                  {scans.length} scan{scans.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <FaSpinner className="animate-spin text-[#003366] text-3xl mx-auto mb-3" />
                  <p className="text-gray-600">Loading your scan results...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded mb-6">
                <div className="flex">
                  <div className="flex-shrink-0 text-red-400">
                    <FaExclamationTriangle className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                    <a
                      href="/consultations/create-appointment"
                      className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                    >
                      Book an Appointment
                    </a>
                  </div>
                </div>
              </div>
            ) : scans.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-[#003366] to-[#005588] flex items-center justify-center mb-4">
                  <FaFileMedical className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-medium text-[#003366] mb-2">No Scans Found</h3>
                <p className="text-gray-600 mb-6">You haven't uploaded any scans yet.</p>
                <a
                  href="/consultations/create-appointment"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#003366] to-[#005588] text-white rounded-md hover:shadow-md transition-all"
                >
                  Book an Appointment
                </a>
              </div>
            ) : (
              <div className="space-y-6">
                {scans.map(scan => renderScanCard(scan))}
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}