// MarkerEditor.jsx
import React, { useState, useEffect } from 'react';

const MarkerEditor = ({ 
  selectedOverlay, 
  onUpdate, 
  onClose, 
  onDelete 
}) => {
  const [details, setDetails] = useState({
    name: '',
    description: '',
    type: '',
    address: '',
    phone: '',
    email: '',
    notes: ''
  });

  useEffect(() => {
    if (selectedOverlay) {
      // Load existing details
      const existingDetails = selectedOverlay.overlay.customDetails || {};
      setDetails({
        name: selectedOverlay.data.title || '',
        description: existingDetails.description || '',
        type: existingDetails.type || '',
        address: existingDetails.address || '',
        phone: existingDetails.phone || '',
        email: existingDetails.email || '',
        notes: existingDetails.notes || ''
      });
    }
  }, [selectedOverlay]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOverlay) {
      onUpdate(selectedOverlay.data.id, details);
      onClose();
    }
  };

  const handleDelete = () => {
    if (selectedOverlay && window.confirm('Are you sure you want to delete this marker?')) {
      onDelete(selectedOverlay.data.id);
      onClose();
    }
  };

  if (!selectedOverlay) return null;

  return (
    <div className="fixed top-4 right-4 bg-white p-6 rounded-lg shadow-xl max-w-sm w-full z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Edit Marker</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marker Name *
          </label>
          <input
            type="text"
            value={details.name}
            onChange={(e) => setDetails(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={details.type}
            onChange={(e) => setDetails(prev => ({ ...prev, type: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select type...</option>
            <option value="customer">Customer</option>
            <option value="landmark">Landmark</option>
            <option value="facility">Facility</option>
            <option value="equipment">Equipment</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            value={details.address}
            onChange={(e) => setDetails(prev => ({ ...prev, address: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={details.phone}
            onChange={(e) => setDetails(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={details.email}
            onChange={(e) => setDetails(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={details.description}
            onChange={(e) => setDetails(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={details.notes}
            onChange={(e) => setDetails(prev => ({ ...prev, notes: e.target.value }))}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default MarkerEditor;