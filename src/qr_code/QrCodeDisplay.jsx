import React, { useState, useEffect, useCallback } from 'react';
// import PropTypes from 'prop-types';

const QrCodeDisplay = ({ 
  title = "Scan to Login", 
  description = "Use your mobile device to scan this QR code",
  size = 392,
  className = "",
  showDownload = true
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);




  const fetchQrCode =  useCallback(
    async() => {
       try {
        const response = await fetch('/api/get_qr_code', {
          headers: {
            'X-Subdomain': window.location.hostname.split('.')[0],
          }
        });

       if (!response.ok) throw new Error('Failed to fetch QR code');
        
        const data = await response.json();
        if (!data.qr_code_base64) throw new Error('Invalid QR code data');
        
        setQrCodeUrl(data.qr_code_base64);
      } catch (err) {
        setError(err.message);
        console.error('QR Code fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  )
  


  useEffect(() => {
    
    fetchQrCode();
  }, [fetchQrCode]);

  // Fetch QR code only once when component mounts
    const handleDownload = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'login-qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  

  return (
    <div className={`flex flex-col items-center p-6 bg-white rounded-lg shadow-md ${className}`}>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      
      {isLoading ? (
        <div className={`w-${size/12} h-${size/12} flex items-center justify-center bg-gray-100 rounded-md mb-4`}>
          <div className="animate-pulse rounded-full bg-gray-200 h-12 w-12"></div>
        </div>
      ) : error ? (
        <div className={`w-${size/12} h-${size/12} flex items-center justify-center bg-red-50 rounded-md mb-4 p-4`}>
          <p className="text-red-600">Failed to load QR code</p>
        </div>
      ) : (
        <>
          <div className="p-2 bg-white border-2 border-gray-200 rounded-md mb-4">
            <img 
              src={qrCodeUrl} 
              alt="Login QR Code" 
              className={`w-${size/12} h-${size/12} object-contain`}
            />
          </div>
          <p className="text-gray-600 text-center max-w-xs mb-4">{description}</p>
          
          {showDownload && qrCodeUrl && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
          )}
        </>
      )}
    </div>
  );
};

// QrCodeDisplay.propTypes = {
//   title: PropTypes.string,
//   description: PropTypes.string,
//   size: PropTypes.number,
//   className: PropTypes.string,
//   showDownload: PropTypes.bool
// };

export default QrCodeDisplay;