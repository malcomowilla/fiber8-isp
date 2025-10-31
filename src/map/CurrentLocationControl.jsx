// CurrentLocationControl.jsx
import { ControlPosition, MapControl } from '@vis.gl/react-google-maps';
import React from 'react';

const CurrentLocationControl = ({ 
  controlPosition = ControlPosition.RIGHT_BOTTOM,
  onLocationClick,
  loading = false
}) => {
  return (
    <MapControl position={controlPosition}>
      <div
        style={{
          margin: '10px',
          background: 'white',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px'
        }}
        onClick={onLocationClick}
        title="Go to my current location"
      >
        {loading ? (
          <div 
            style={{
              width: '16px',
              height: '16px',
              border: '2px solid #f3f3f3',
              borderTop: '2px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
        ) : (
          <span style={{ fontSize: '20px' }}>📍</span>
        )}
      </div>
      
      {/* Add CSS for spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </MapControl>
  );
};

export default CurrentLocationControl;