import { useEffect, useRef } from 'react';

// Action types for the reducer
export const DrawingActionKind = {
  UNDO: 'UNDO',
  REDO: 'REDO',
  RECORD: 'RECORD'
};

// Reducer function for undo/redo state management
export const reducer = (state, action) => {
  switch (action.type) {
    case DrawingActionKind.UNDO: {
      if (state.past.length === 0) return state;

      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, state.past.length - 1);

      return {
        past: newPast,
        now: previous,
        future: [state.now, ...state.future]
      };
    }

    case DrawingActionKind.REDO: {
      if (state.future.length === 0) return state;

      const next = state.future[0];
      const newFuture = state.future.slice(1);

      return {
        past: [...state.past, state.now],
        now: next,
        future: newFuture
      };
    }

    case DrawingActionKind.RECORD: {
      return {
        past: [...state.past, state.now],
        now: action.payload,
        future: []
      };
    }

    default:
      return state;
  }
};

// Hook to handle drawing manager events
export const useDrawingManagerEvents = (drawingManager, overlaysShouldUpdateRef, dispatch) => {
  useEffect(() => {
    if (!drawingManager) return;

    const handleOverlayComplete = (event) => {
      console.log('Overlay completed:', event.type);
      
      // Create a snapshot of the overlay
      const snapshot = createOverlaySnapshot(event.overlay);
      
      // Record the snapshot
      dispatch({
        type: DrawingActionKind.RECORD,
        payload: [snapshot]
      });
    };

    // Listen for when overlays are completed
    const listener = window.google.maps.event.addListener(
      drawingManager,
      'overlaycomplete',
      handleOverlayComplete
    );

    return () => {
      window.google.maps.event.removeListener(listener);
    };
  }, [drawingManager, dispatch]);
};

// Hook to apply overlay snapshots
export const useOverlaySnapshots = (map, state, overlaysShouldUpdateRef) => {
  const overlaysRef = useRef(new Map());

  useEffect(() => {
    if (!map || !state.now || overlaysShouldUpdateRef.current) return;

    // Clear existing overlays
    overlaysRef.current.forEach(overlay => {
      overlay.setMap(null);
    });
    overlaysRef.current.clear();

    // Add new overlays from snapshot
    state.now.forEach(snapshot => {
      const overlay = createOverlayFromSnapshot(snapshot, map);
      if (overlay) {
        overlaysRef.current.set(snapshot.id, overlay);
        
        // Add event listeners for changes
        addOverlayListeners(overlay, snapshot.type, (newSnapshot) => {
          // This would be where you handle overlay changes for undo/redo
          console.log('Overlay changed:', newSnapshot);
        });
      }
    });
  }, [map, state.now]);
};

// Helper function to create a snapshot of an overlay
const createOverlaySnapshot = (overlay) => {
  const snapshot = {
    id: Date.now() + Math.random(),
    type: overlay.type || getOverlayType(overlay)
  };

  // Extract geometry data based on overlay type
  switch (snapshot.type) {
    case 'marker':
      snapshot.position = {
        lat: overlay.getPosition().lat(),
        lng: overlay.getPosition().lng()
      };
      break;

    case 'circle':
      snapshot.center = {
        lat: overlay.getCenter().lat(),
        lng: overlay.getCenter().lng()
      };
      snapshot.radius = overlay.getRadius();
      break;

    case 'polygon':
      snapshot.paths = overlay.getPaths().getArray().map(path =>
        path.getArray().map(latLng => ({
          lat: latLng.lat(),
          lng: latLng.lng()
        }))
      );
      break;

    case 'polyline':
      snapshot.path = overlay.getPath().getArray().map(latLng => ({
        lat: latLng.lat(),
        lng: latLng.lng()
      }));
      break;

    case 'rectangle':
      const bounds = overlay.getBounds();
      snapshot.bounds = {
        north: bounds.getNorthEast().lat(),
        south: bounds.getSouthWest().lat(),
        east: bounds.getNorthEast().lng(),
        west: bounds.getSouthWest().lng()
      };
      break;
  }

  return snapshot;
};

// Helper function to create an overlay from a snapshot
const createOverlayFromSnapshot = (snapshot, map) => {
  switch (snapshot.type) {
    case 'marker':
      return new window.google.maps.Marker({
        position: snapshot.position,
        map: map,
        draggable: true
      });

    case 'circle':
      return new window.google.maps.Circle({
        center: snapshot.center,
        radius: snapshot.radius,
        map: map,
        editable: true
      });

    case 'polygon':
      return new window.google.maps.Polygon({
        paths: snapshot.paths,
        map: map,
        editable: true,
        draggable: true
      });

    case 'polyline':
      return new window.google.maps.Polyline({
        path: snapshot.path,
        map: map,
        editable: true,
        draggable: true
      });

    case 'rectangle':
      return new window.google.maps.Rectangle({
        bounds: snapshot.bounds,
        map: map,
        editable: true,
        draggable: true
      });

    default:
      return null;
  }
};

// Helper function to determine overlay type
const getOverlayType = (overlay) => {
  if (overlay instanceof window.google.maps.Marker) return 'marker';
  if (overlay instanceof window.google.maps.Circle) return 'circle';
  if (overlay instanceof window.google.maps.Polygon) return 'polygon';
  if (overlay instanceof window.google.maps.Polyline) return 'polyline';
  if (overlay instanceof window.google.maps.Rectangle) return 'rectangle';
  return 'unknown';
};

// Helper function to add event listeners to overlays
const addOverlayListeners = (overlay, type, onChange) => {
  switch (type) {
    case 'marker':
      window.google.maps.event.addListener(overlay, 'dragend', () => {
        const snapshot = createOverlaySnapshot(overlay);
        onChange(snapshot);
      });
      break;

    case 'circle':
      window.google.maps.event.addListener(overlay, 'radius_changed', () => {
        const snapshot = createOverlaySnapshot(overlay);
        onChange(snapshot);
      });
      window.google.maps.event.addListener(overlay, 'center_changed', () => {
        const snapshot = createOverlaySnapshot(overlay);
        onChange(snapshot);
      });
      break;

    case 'polygon':
    case 'polyline':
      window.google.maps.event.addListener(overlay, 'insert_at', () => {
        const snapshot = createOverlaySnapshot(overlay);
        onChange(snapshot);
      });
      window.google.maps.event.addListener(overlay, 'set_at', () => {
        const snapshot = createOverlaySnapshot(overlay);
        onChange(snapshot);
      });
      window.google.maps.event.addListener(overlay, 'remove_at', () => {
        const snapshot = createOverlaySnapshot(overlay);
        onChange(snapshot);
      });
      break;

    case 'rectangle':
      window.google.maps.event.addListener(overlay, 'bounds_changed', () => {
        const snapshot = createOverlaySnapshot(overlay);
        onChange(snapshot);
      });
      break;
  }
};

export default reducer;