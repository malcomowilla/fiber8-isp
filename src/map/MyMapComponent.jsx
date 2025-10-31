// ✅ MyMapComponent.jsx
import { useEffect } from 'react';
import { useDrawingManager } from './UseDrawingManager';

export default function MyMapComponent({toast}) {
  const drawingManager = useDrawingManager();

  useEffect(() => {
    if (drawingManager) {
      // console.log('✅ DrawingManager ready', drawingManager);
    }
  }, [drawingManager]);

  return null; // nothing to render
}
