// components/LocationNetworkMap.jsx
import React from 'react';
import { MapPin, Wifi, Users, Activity } from 'lucide-react';

export default function LocationNetworkMap() {
  const locations = [
    {
      id: 1,
      name: 'Nairobi CBD',
      ipRange: '192.168.10.0/24',
      users: 250,
      bandwidth: '450 Mbps',
      status: 'normal',
      coordinates: { x: 300, y: 150 }
    },
    {
      id: 2,
      name: 'Kisumu',
      ipRange: '192.168.20.0/24',
      users: 120,
      bandwidth: '85 Mbps',
      status: 'warning',
      coordinates: { x: 100, y: 250 }
    },
    {
      id: 3,
      name: 'Mombasa',
      ipRange: '192.168.30.0/24',
      users: 80,
      bandwidth: '60 Mbps',
      status: 'good',
      coordinates: { x: 450, y: 350 }
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-3">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Network Topology Map</h2>
        
      </div>

      {/* Network Map Visualization */}
      <div className="relative h-96 border border-gray-200 rounded-lg bg-gradient-to-br from-blue-50 to-gray-50">
        {/* Center Hub */}
        

        {/* Location Nodes */}
        {locations.map((location) => (
          <div
            key={location.id}
            className={`absolute p-4 rounded-xl border shadow-lg ${
              location.status === 'normal' ? 'bg-white border-green-200' :
              location.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
              'bg-red-50 border-red-200'
            }`}
            style={{
              left: `${location.coordinates.x}px`,
              top: `${location.coordinates.y}px`
            }}
          >
            <div className="flex items-center space-x-3">
              <MapPin className={`h-5 w-5 ${
                location.status === 'normal' ? 'text-green-500' :
                location.status === 'warning' ? 'text-yellow-500' :
                'text-red-500'
              }`} />
              <div>
                <p className="font-bold">{location.name}</p>
                <p className="text-sm font-mono text-gray-600">{location.ipRange}</p>
              </div>
            </div>
            
            {/* Connection Line (visual) */}
            <div className="absolute w-32 h-0.5 bg-blue-300 -top-4 -left-32 transform rotate-45"></div>
            
            {/* Stats */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1 text-gray-500" />
                <span>{location.users} users</span>
              </div>
              <div className="flex items-center">
                <Activity className="h-3 w-3 mr-1 text-gray-500" />
                <span>{location.bandwidth}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg border shadow">
          <p className="text-sm font-medium mb-2">IP Allocation Strategy</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Nairobi CBD:</span>
              <code className="bg-gray-100 px-1 rounded">192.168.10.x</code>
            </div>
            <div className="flex justify-between">
              <span>Kisumu:</span>
              <code className="bg-gray-100 px-1 rounded">192.168.20.x</code>
            </div>
            <div className="flex justify-between">
              <span>Mombasa:</span>
              <code className="bg-gray-100 px-1 rounded">192.168.30.x</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


