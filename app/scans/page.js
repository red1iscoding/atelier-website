'use client';
import { useState } from 'react';
import { loadModel, predict } from '../../lib/model/predict';

export default function TestModel() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const session = await loadModel();
      const imageElement = document.createElement('img');
      imageElement.src = preview;
      await new Promise((resolve) => { imageElement.onload = resolve; });

      const prediction = await predict(session, imageElement);
      
      if (!prediction.isValid) {
        throw new Error(prediction.error || "Invalid prediction results");
      }

      setResult({
        ...prediction,
        diagnosis: getDiagnosis(prediction.probabilities),
        confidence: getConfidence(prediction.probabilities)
      });
      
    } catch (err) {
      console.error("Prediction error:", err);
      setError(err.message || "Failed to analyze image");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions for safe data access
  const getDiagnosis = (probabilities = {}) => {
    if (!probabilities) return "Unknown";
    const { normal = 0, pneumonia = 0, cancer = 0 } = probabilities;
    const max = Math.max(normal, pneumonia, cancer);
    
    if (max === normal) return "Normal";
    if (max === pneumonia) return "Pneumonia";
    return "Lung Cancer";
  };

  const getConfidence = (probabilities = {}) => {
    const { normal = 0, pneumonia = 0, cancer = 0 } = probabilities;
    return Math.max(normal, pneumonia, cancer);
  };

  const getProbability = (condition) => {
    if (!result?.probabilities) return 0;
    return (result.probabilities[condition.toLowerCase()] || 0) * 100;
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'white',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header Section */}
      <header style={{
        textAlign: 'center',
        marginBottom: '2rem',
        borderBottom: '2px solid #003366',
        paddingBottom: '1rem'
      }}>
        <h1 style={{
          color: '#003366',
          fontSize: '2.5rem',
          marginBottom: '0.5rem'
        }}>Medical X-ray Analysis</h1>
        <p style={{
          color: '#666',
          fontSize: '1.1rem'
        }}>Upload a chest X-ray to detect pneumonia or lung abnormalities</p>
      </header>

      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        {/* Upload Card */}
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          padding: '2rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            color: '#003366',
            marginTop: 0,
            marginBottom: '1.5rem',
            fontSize: '1.5rem'
          }}>Upload X-ray Image</h2>
          
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#333'
              }}>
                Select Image (JPEG/PNG)
              </label>
              <div style={{
                border: '2px dashed #003366',
                borderRadius: '8px',
                padding: '2rem',
                textAlign: 'center',
                backgroundColor: 'rgba(0, 51, 102, 0.05)',
                cursor: 'pointer',
                position: 'relative'
              }}>
                <input 
                  type="file" 
                  accept="image/png,image/jpeg" 
                  onChange={handleFileChange}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="#003366">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  <p style={{ margin: 0, color: '#003366' }}>
                    {file ? file.name : 'Click to browse or drag and drop'}
                  </p>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                    Recommended size: 1024x1024 pixels
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !file}
              style={{
                backgroundColor: '#003366',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                cursor: isLoading ? 'wait' : 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.2s',
                opacity: isLoading || !file ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isLoading ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Analyzing...
                </>
              ) : 'Analyze X-ray'}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fff3e0',
            borderLeft: '4px solid #ff9800',
            padding: '1rem',
            borderRadius: '4px'
          }}>
            <p style={{ color: '#d32f2f', margin: 0 }}>
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {/* Results Section */}
        {preview && (
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '10px',
            padding: '2rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              color: '#003366',
              marginTop: 0,
              marginBottom: '1.5rem',
              fontSize: '1.5rem'
            }}>X-ray Preview</h2>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <img 
                src={preview} 
                alt="X-ray preview" 
                style={{ 
                  maxWidth: '100%',
                  maxHeight: '400px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
              
              {result && (
                <div style={{
                  width: '100%',
                  backgroundColor: result.diagnosis === 'Normal' ? '#e8f5e9' : '#ffebee',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  borderLeft: `6px solid ${result.diagnosis === 'Normal' ? '#4CAF50' : '#F44336'}`
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <h3 style={{
                      margin: 0,
                      color: '#003366',
                      fontSize: '1.3rem'
                    }}>Analysis Results</h3>
                    <span style={{
                      backgroundColor: result.diagnosis === 'Normal' ? '#4CAF50' : '#F44336',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      {result.diagnosis}
                    </span>
                  </div>
                  
                  <div style={{
                    marginBottom: '1.5rem'
                  }}>
                    <p style={{
                      margin: '0.5rem 0',
                      fontSize: '1.1rem'
                    }}>
                      Confidence: <strong>{result.confidence.toFixed(1)}%</strong>
                    </p>
                    <div style={{
                      height: '8px',
                      backgroundColor: '#e0e0e0',
                      borderRadius: '4px',
                      margin: '0.5rem 0'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${result.confidence}%`,
                        backgroundColor: result.diagnosis === 'Normal' ? '#4CAF50' : '#F44336',
                        borderRadius: '4px'
                      }}></div>
                    </div>
                  </div>
                  
                  <h4 style={{
                    margin: '1rem 0',
                    color: '#003366',
                    fontSize: '1.1rem'
                  }}>Detailed Probabilities:</h4>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1rem'
                  }}>
                    {['Normal', 'Pneumonia', 'Cancer'].map((condition) => (
                      <div key={condition} style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '1rem',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                      }}>
                        <p style={{
                          margin: '0 0 0.5rem 0',
                          fontWeight: '600',
                          color: '#333'
                        }}>{condition}</p>
                        <p style={{
                          margin: 0,
                          fontSize: '1.2rem',
                          fontWeight: '700',
                          color: condition === 'Normal' ? '#4CAF50' : 
                                condition === 'Pneumonia' ? '#FF9800' : '#F44336'
                        }}>
                          {getProbability(condition).toFixed(1)}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        marginTop: '3rem',
        paddingTop: '1rem',
        borderTop: '1px solid #eee',
        color: '#666',
        fontSize: '0.9rem'
      }}>
        <p>Note: This tool is for preliminary analysis only. Always consult a medical professional.</p>
      </footer>
    </div>
  );
}