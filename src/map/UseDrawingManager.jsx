// /* global google */

// import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
// import { useEffect, useState } from 'react';

// export function useDrawingManager() {
//   const map = useMap();
//   const drawing = useMapsLibrary('drawing');
//   const [drawingManager, setDrawingManager] = useState(null);

//   useEffect(() => {
//     // Wait until both the map and the drawing library are available
//     if (!map || !drawing || !window.google) return;

//     console.log('drawing manager', drawingManager)
//     // ✅ Initialize only when google.maps is ready
//     const newDrawingManager = new drawing.DrawingManager({
//       map,
//       drawingMode: window.google.maps.drawing.OverlayType.CIRCLE,
//       drawingControl: true,
//       drawingControlOptions: {
//         position: window.google.maps.ControlPosition.TOP_CENTER,
//         drawingModes: [
//           window.google.maps.drawing.OverlayType.MARKER,
//           window.google.maps.drawing.OverlayType.CIRCLE,
//           window.google.maps.drawing.OverlayType.POLYGON,
//           window.google.maps.drawing.OverlayType.POLYLINE,
//           window.google.maps.drawing.OverlayType.RECTANGLE
//         ]
//       },
//       markerOptions: { draggable: true },
//       circleOptions: { editable: true },
//       polygonOptions: { editable: true, draggable: true },
//       rectangleOptions: { editable: true, draggable: true },
//       polylineOptions: { editable: true, draggable: true }
//     });

//     setDrawingManager(newDrawingManager);

//     return () => {
//       newDrawingManager.setMap(null);
//     };
//   }, [map, drawing]);

//   return drawingManager;
// }




// Updated useDrawingManager.js
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useState, useCallback } from 'react';
  import { ToastContainer, toast } from 'react-toastify';

export function useDrawingManager() {
  const map = useMap();
  const drawing = useMapsLibrary('drawing');
  const [drawingManager, setDrawingManager] = useState(null);
  const [overlays, setOverlays] = useState([]);
  const [selectedOverlay, setSelectedOverlay] = useState(null); // Track selected overlay for editing

  const subdomain = window.location.hostname.split('.')[0];

  // API service for drawings
  const drawingAPI = {
    // Save drawing to Rails backend
    async saveDrawing(drawingData) {
      try {
        const response = await fetch('/api/drawings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Subdomain': subdomain,
          },
          body: JSON.stringify({ drawing: drawingData })
        });
        
        if (!response.ok) throw new Error('Failed to save drawing');
        return await response.json();
      } catch (error) {
        console.error('Error saving drawing:', error);
        throw error;
      }
    },

    // Load drawings from Rails backend
    async loadDrawings() {
      try {
        const response = await fetch('/api/drawings', {
          headers: {
            'X-Subdomain': subdomain,
          },
        });
        
        if (!response.ok) throw new Error('Failed to load drawings');
        const data = await response.json();
        return data.drawings || data; // Handle both {drawings: []} and [] formats
      } catch (error) {
        console.error('Error loading drawings:', error);
        return [];
      }
    },

    // Update drawing in Rails backend
    async updateDrawing(id, drawingData) {
      try {
        const response = await fetch(`/api/drawings/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Subdomain': subdomain,
          },
          body: JSON.stringify({ drawing: drawingData })
        });
        
        if (!response.ok) throw new Error('Failed to update drawing');
        return await response.json();
      } catch (error) {
        console.error('Error updating drawing:', error);
        throw error;
      }
    },

    // Delete drawing from Rails backend
    async deleteDrawing(id) {
      try {
        const response = await fetch(`/api/drawings/${id}`, {
          method: 'DELETE',
          headers: {
            'X-Subdomain': subdomain,
          },
        });
        
        if (!response.ok) throw new Error('Failed to delete drawing');

        if (response.ok) {

            
            // setSelectedOverlay(null);
            // setOverlays(prev => [...prev, { overlay: null, data: { id: id } }]);
            <ToastContainer
position="bottom-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/>
        }
      } catch (error) {
        console.error('Error deleting drawing:', error);
        throw error;
      }
    },

    // Clear all drawings
    async clearAllDrawings() {
      try {
        const response = await fetch('/api/drawings/clear_all', {
          method: 'DELETE',
          headers: {
            'X-Subdomain': subdomain,
          },
        });
        
        if (!response.ok) throw new Error('Failed to clear drawings');
      } catch (error) {
        console.error('Error clearing drawings:', error);
        throw error;
      }
    }
  };

  // Load saved drawings from Rails backend
  const loadSavedDrawings = useCallback(async (map) => {
    try {
      const savedDrawings = await drawingAPI.loadDrawings();
      // console.log('Loaded drawings from backend:', savedDrawings);
      
      savedDrawings.forEach(drawingData => {
        createOverlayFromData(drawingData, map);
      });
    } catch (error) {
      console.error('Error loading saved drawings:', error);
    }
  }, []);

  // Create overlay from saved data



  
 const handleOverlayClick = useCallback((overlay, data) => {
    if (data.drawing_type === 'marker') {
      setSelectedOverlay({ overlay, data });
    }
  }, []);



  

// In useDrawingManager.js - fix createOverlayFromData
const createOverlayFromData = useCallback((data, map) => {
  if (!window.google) return null;

  const type = data.drawing_type || data.type;
  let overlay;
  console.log('type', type)

  switch (type) {
     case 'marker':
      if (data.position && data.position.lat && data.position.lng) {
            const labelContent = data.title || 'Marker';
              const markerTitle = data.title || 'Marker';
        overlay = new window.google.maps.Marker({
          position: data.position,
          map: map,
          draggable: true,
          title: data.title || 'Marker',
         label: {
        text: markerTitle.length > 10 ? markerTitle.substring(0, 8) + '...' : markerTitle,
        color: '#FFFFFF',
        fontSize: '11px',
        fontWeight: 'bold',
        className: 'custom-marker-label'
      },
      // icon: {
      //   path: window.google.maps.SymbolPath.CIRCLE,
      //   fillColor: '#4285F4',
      //   fillOpacity: 1,
      //   strokeColor: '#FFFFFF',
      //   strokeWeight: 2,
      //   scale: 15
      // }
        });

        // Store custom details
        if (data.custom_details) {
          overlay.customDetails = data.custom_details;
        }

        // Create InfoWindow content for editing marker info
        const infoWindowContent = document.createElement('div');
        infoWindowContent.innerHTML = `
          <div style="background: white; padding: 15px; border-radius: 5px; box-shadow: 0 2px 6px rgba(0,0,0,0.3); min-width: 250px;">
            <h3 style="margin-top: 0; margin-bottom: 15px;">Edit Marker</h3>
            
            <div style="margin-bottom: 10px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">Title:</label>
              <input type="text" id="title-input-${data.id}" 
                     value="${data.title || ''}" 
                     style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px;"
                     placeholder="Enter marker title">
            </div>
            
            <div style="margin-bottom: 10px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">Description:</label>
              <textarea id="desc-input-${data.id}" 
                        style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px; height: 60px;"
                        placeholder="Enter marker description">${data.description || ''}</textarea>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">Category:</label>
              <select id="category-input-${data.id}" 
                      style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px;">
                <option value="">Select category</option>
                <option value="business" ${data.category === 'business' ? 'selected' : ''}>Business</option>
                <option value="landmark" ${data.category === 'landmark' ? 'selected' : ''}>Landmark</option>
                <option value="personal" ${data.category === 'personal' ? 'selected' : ''}>Personal</option>
                <option value="other" ${data.category === 'other' ? 'selected' : ''}>Other</option>
              </select>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: space-between;">
              <button id="save-btn-${data.id}" 
                      style="background: #4285F4; color: white; border: none; padding: 8px 15px; border-radius: 3px; cursor: pointer; flex: 1;">
                Save Info
              </button>
              <button id="delete-btn-${data.id}" 
                      style="background: #ff4444; color: white; border: none; padding: 8px 15px; border-radius: 3px; cursor: pointer; flex: 1;">
                Delete
              </button>
            </div>
          </div>
        `;

        const infoWindow = new window.google.maps.InfoWindow({
          content: infoWindowContent
        });

        // Click event to open InfoWindow
        window.google.maps.event.addListener(overlay, 'click', (e) => {
          console.log('Marker clicked:', data);
          infoWindow.open(map, overlay);
          
          // Add event listeners after InfoWindow opens
          setTimeout(() => {
            // Save button event
            const saveBtn = document.getElementById(`save-btn-${data.id}`);
            if (saveBtn) {
              saveBtn.addEventListener('click', () => {
                const titleInput = document.getElementById(`title-input-${data.id}`);
                const descInput = document.getElementById(`desc-input-${data.id}`);
                const categoryInput = document.getElementById(`category-input-${data.id}`);
                
                const updatedData = {
                  ...data,
                  title: titleInput.value,
                  description: descInput.value,
                  category: categoryInput.value,
                  custom_details: {
                    ...data.custom_details,
                    lastUpdated: new Date().toISOString()
                  }
                };
                
                // Update marker title
                overlay.setTitle(titleInput.value);
                
                // Call function to save data to your backend or state
                // updateDrawingData(data.id, updatedData);
                drawingAPI.updateDrawing(data.id, updatedData);
                // Show confirmation
                alert('Marker information saved!');
                
                // Close InfoWindow
                infoWindow.close();
              });
            }
            
            // Delete button event
            const deleteBtn = document.getElementById(`delete-btn-${data.id}`);
            if (deleteBtn) {
              deleteBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this marker?')) {
                  infoWindow.close();
                  deleteDrawing(data.id);
                  
                }
              });
            }
          }, 100);
        });

        // Right-click to delete (alternative method)
        window.google.maps.event.addListener(overlay, 'rightclick', (e) => {
          if (confirm('Delete this marker?')) {
            deleteDrawing(data.id);
          }
        });
      }
      break;
      
    case 'polyline':
      if (data.path && Array.isArray(data.path)) {
        overlay = new window.google.maps.Polyline({
          path: data.path,
          map: map,
          strokeColor: data.stroke_color || '#4285F4',
          strokeWeight: data.stroke_weight || 4,
          editable: true
        });
      }
      break;
      
    case 'polygon':
      if (data.paths && Array.isArray(data.paths)) {
        overlay = new window.google.maps.Polygon({
          paths: data.paths,
          map: map,
          fillColor: data.fill_color || '#4285F4',
          strokeColor: data.stroke_color || '#4285F4',
          editable: true
        });
      }
      break;
      
    case 'circle':
      if (data.center && data.center.lat && data.center.lng) {
        overlay = new window.google.maps.Circle({
          center: data.center,
          radius: data.radius || 1000,
          map: map,
          fillColor: data.fill_color || '#4285F4',
          strokeColor: data.stroke_color || '#4285F4',
          editable: true
        });
      }
      break;
      
    case 'rectangle':
      if (data.bounds && data.bounds.north && data.bounds.south && data.bounds.east && data.bounds.west) {
        overlay = new window.google.maps.Rectangle({
          bounds: new window.google.maps.LatLngBounds(
            { lat: data.bounds.south, lng: data.bounds.west },
            { lat: data.bounds.north, lng: data.bounds.east }
          ),
          map: map,
          fillColor: data.fill_color || '#4285F4',
          strokeColor: data.stroke_color || '#4285F4',
          editable: true
        });
      }
      break;
      
    default:
      console.warn('Unknown drawing type:', type);
      return null;
  }

  if (overlay) {
    // Add to overlays state
    setOverlays(prev => [...prev, { overlay, data }]);
    
    // Add listeners for edits
    if (data.id) {
      addOverlayListeners(overlay, type, data.id);
    }
  }

  return overlay;
}, [handleOverlayClick]);






  // Extract overlay data for saving
  const getOverlayData = useCallback((overlay, type) => {
   const data = { drawing_type: type };
    switch (type) {
      case 'marker':
        data.position = overlay.getPosition().toJSON();
        data.title = overlay.getTitle() || 'Marker';
        break;
      case 'polyline':
        data.path = overlay.getPath().getArray().map(latLng => latLng.toJSON());
        data.stroke_color = overlay.getStrokeColor();
        data.stroke_weight = overlay.getStrokeWeight();
        break;
      case 'polygon':
        data.paths = overlay.getPaths().getArray().map(path => 
          path.getArray().map(latLng => latLng.toJSON())
        );
        data.fill_color = overlay.getFillColor();
        data.stroke_color = overlay.getStrokeColor();
        break;
      case 'circle':
        data.center = overlay.getCenter().toJSON();
        data.radius = overlay.getRadius();
        data.fill_color = overlay.getFillColor();
        data.stroke_color = overlay.getStrokeColor();
        break;
      case 'rectangle':
        data.bounds = overlay.getBounds().toJSON();
        data.fill_color = overlay.getFillColor();
        data.stroke_color = overlay.getStrokeColor();
        break;
    }

    return data;
  }, []);



const updateMarkerDetails = useCallback(async (overlayId, details) => {
    try {
      const overlayData = overlays.find(item => item.data.id === overlayId);
      if (!overlayData) return;

      // Update the overlay's custom details
      overlayData.overlay.customDetails = details;
      overlayData.overlay.setTitle(details.name || 'Marker'); // Update title

      // Prepare update data
      const updateData = {
        ...overlayData.data,
        title: details.name || 'Marker',
        custom_details: details
      };

      // Save to backend
      await drawingAPI.updateDrawing(overlayId, updateData);
      // Update local state
      setOverlays(prev => prev.map(item =>
        item.data.id === overlayId
          ? { ...item, data: { ...item.data, ...updateData } }
          : item
      ));

      console.log('Marker details updated:', overlayId, details);
    } catch (error) {
      console.error('Error updating marker details:', error);
    }
  }, [overlays]);



  // Add listeners for overlay edits
  const addOverlayListeners = useCallback((overlay, type, id) => {
    const updateOverlay = async () => {
      try {
        const updatedData = getOverlayData(overlay, type);
        
        // Update in Rails backend
        await drawingAPI.updateDrawing(id, updatedData);
        
        // Update state
        setOverlays(prev => prev.map(item => 
          item.data.id === id ? { overlay, data: { ...updatedData, id } } : item
        ));
        
        console.log('Drawing updated successfully:', id);
      } catch (error) {
        console.error('Error updating drawing:', error);
      }
    };

    switch (type) {
      case 'marker':
        window.google.maps.event.addListener(overlay, 'dragend', updateOverlay);
        break;
      case 'polyline':
        window.google.maps.event.addListener(overlay, 'insert_at', updateOverlay);
        window.google.maps.event.addListener(overlay, 'set_at', updateOverlay);
        window.google.maps.event.addListener(overlay, 'remove_at', updateOverlay);
        break;
      case 'polygon':
        window.google.maps.event.addListener(overlay, 'insert_at', updateOverlay);
        window.google.maps.event.addListener(overlay, 'set_at', updateOverlay);
        window.google.maps.event.addListener(overlay, 'remove_at', updateOverlay);
        break;
      case 'circle':
        window.google.maps.event.addListener(overlay, 'center_changed', updateOverlay);
        window.google.maps.event.addListener(overlay, 'radius_changed', updateOverlay);
        break;
      case 'rectangle':
        window.google.maps.event.addListener(overlay, 'bounds_changed', updateOverlay);
        break;
    }
  }, [getOverlayData]);

  useEffect(() => {
    if (!map || !drawing || !window.google) return;

    // console.log('Initializing DrawingManager...');

    const newDrawingManager = new drawing.DrawingManager({
      map,
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          window.google.maps.drawing.OverlayType.MARKER,
          window.google.maps.drawing.OverlayType.CIRCLE,
          window.google.maps.drawing.OverlayType.POLYGON,
          window.google.maps.drawing.OverlayType.POLYLINE,
          window.google.maps.drawing.OverlayType.RECTANGLE
        ]
      },
      markerOptions: { 
        draggable: true,
        title: 'Custom Marker'
      },
      circleOptions: { 
        editable: true,
        fillColor: '#4285F4',
        fillOpacity: 0.2,
        strokeWeight: 2,
        strokeColor: '#4285F4'
      },
      polygonOptions: { 
        editable: true, 
        draggable: true,
        fillColor: '#4285F4',
        fillOpacity: 0.2,
        strokeWeight: 2,
        strokeColor: '#4285F4'
      },
      rectangleOptions: { 
        editable: true, 
        draggable: true,
        fillColor: '#4285F4',
        fillOpacity: 0.2,
        strokeWeight: 2,
        strokeColor: '#4285F4'
      },
      polylineOptions: { 
        editable: true, 
        draggable: true,
        strokeColor: '#4285F4',
        strokeWeight: 4
      }
    });

    // Handle overlay completion
    const overlayCompleteListener = window.google.maps.event.addListener(
      newDrawingManager,
      'overlaycomplete',
      async (event) => {
        console.log('Overlay completed:', event.type);
        
        const type = event.type.toLowerCase();
        const overlayData = getOverlayData(event.overlay, type);
        
        try {
          // Save to Rails backend
          const savedDrawing = await drawingAPI.saveDrawing(overlayData);
          console.log('Drawing saved to backend:', savedDrawing);
          
          // Add to state with the ID from backend
          const drawingWithId = { 
            overlay: event.overlay, 
            data: { ...overlayData, id: savedDrawing.id || savedDrawing.drawing?.id } 
          };
          
          setOverlays(prev => [...prev, drawingWithId]);

          // Add event listeners for edits
          if (savedDrawing.id || savedDrawing.drawing?.id) {
            const drawingId = savedDrawing.id || savedDrawing.drawing.id;
            addOverlayListeners(event.overlay, type, drawingId);
          }
        } catch (error) {
          console.error('Error saving drawing to backend:', error);
        }
      }
    );

    setDrawingManager(newDrawingManager);

    // Load saved drawings from backend
    loadSavedDrawings(map);

    return () => {
      window.google.maps.event.removeListener(overlayCompleteListener);
      if (newDrawingManager && typeof newDrawingManager.setMap === 'function') {
        newDrawingManager.setMap(null);
      }
    };
  }, [map, drawing, getOverlayData, addOverlayListeners, loadSavedDrawings]);

  // Function to clear all drawings
  const clearAllDrawings = useCallback(async () => {
    try {
      await drawingAPI.clearAllDrawings();
      
      // Remove all overlays from map
      overlays.forEach(({ overlay }) => {
        overlay.setMap(null);
      });
      
      // Clear state
      setOverlays([]);
      
      console.log('All drawings cleared successfully');
    } catch (error) {
      console.error('Error clearing drawings:', error);
    }
  }, [overlays]);



  
  // Function to delete a specific drawing
  const deleteDrawing = useCallback(async (id) => {
  try {
    await drawingAPI.deleteDrawing(id);
    
    // Remove from state and map
    setOverlays(prev => {
      const updated = prev.filter(item => item.data.id !== id);
      const toRemove = prev.find(item => item.data.id === id);
      if (toRemove && toRemove.overlay) {
        toRemove.overlay.setMap(null);
      }
      return updated;
    });
    
    console.log('Drawing deleted successfully:', id);
    toast.success('Marker deleted successfully!');
  } catch (error) {
    console.error('Error deleting drawing:', error);
    toast.error('Failed to delete marker');
  }
}, []);

  return { 
    drawingManager, 
    overlays, 
    setOverlays,
    selectedOverlay,
     setSelectedOverlay,
    clearAllDrawings,
    deleteDrawing,
     updateMarkerDetails, 
  };
}