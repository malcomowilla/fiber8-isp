// MarkerDetailsPanel.jsx
import { useState, useEffect } from 'react';

export function MarkerDetailsPanel({ selectedOverlay, onUpdate, onDelete, onClose }) {
  const [details, setDetails] = useState({
    name: '',
    description: '',
    // Add other fields as needed
  });

  // Update form when selectedOverlay changes
  useEffect(() => {
    if (selectedOverlay) {
      const data = selectedOverlay.data;
      setDetails({
        name: data.title || data.custom_details?.name || '',
        description: data.custom_details?.description || '',
        // Initialize other fields
      });
    }
  }, [selectedOverlay]);

  const handleSave = async () => {
    if (selectedOverlay && selectedOverlay.data.id) {
      await onUpdate(selectedOverlay.data.id, details);
      onClose();
    }
  };

  const handleDelete = () => {
    if (selectedOverlay && selectedOverlay.data.id) {
      if (confirm('Are you sure you want to delete this marker?')) {
        onDelete(selectedOverlay.data.id);
        onClose();
      }
    }
  };

  if (!selectedOverlay) return null;

  return (
    <div className="marker-details-panel">
      <div className="panel-header">
        <h3>Marker Details</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="form-group">
        <label>Title:</label>
        <input 
          type="text" 
          value={details.name}
          onChange={(e) => setDetails({...details, name: e.target.value})}
          placeholder="Enter marker title"
        />
      </div>

      <div className="form-group">
        <label>Description:</label>
        <textarea 
          value={details.description}
          onChange={(e) => setDetails({...details, description: e.target.value})}
          placeholder="Enter marker description"
          rows="3"
        />
      </div>

      <div className="button-group">
        <button onClick={handleSave} className="save-btn">Save</button>
        <button onClick={handleDelete} className="delete-btn">Delete Marker</button>
      </div>
    </div>
  );
}