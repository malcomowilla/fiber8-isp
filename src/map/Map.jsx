import React from 'react'
import { useState, useEffect, useCallback, lazy, Suspense, useRef } from 'react'
import { useApplicationSettings } from '../settings/ApplicationSettings'
import { APIProvider, Map, AdvancedMarker, Marker, InfoWindow,
   Pin, MapControl, ControlPosition, useMap } from '@vis.gl/react-google-maps'
import { IoPersonSharp } from "react-icons/io5";
import {useDrawingManager} from './UseDrawingManager'
// import {UndoRedoControl} from  './UndoRedoControl'
import MyMapComponent from './MyMapComponent';
import MarkerEditor from './MarkerEditor';
import { MarkerDetailsPanel } from './MarkerDetailsPanel';
  import { ToastContainer, toast } from 'react-toastify';

// Custom styles for an eye-catching map


const Maps = () => {
  const { mapForm, setMapForm } = useApplicationSettings()
  const { api_key } = mapForm
  const mapRef = useRef(null)
const map = useMap()
  // const [map, setMap] = useState(null); // Use state instead of useMap hook

  const [currentLocation, setCurrentLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mapType, setMapType] = useState('hybrid')
  const [is3DEnabled, setIs3DEnabled] = useState(false)
  const [drawingMode, setDrawingMode] = useState(null)
  const [markers, setMarkers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showStreetView, setShowStreetView] = useState(false)
  const [terrainEnabled, setTerrainEnabled] = useState(true)
//   const [drawingManager, setDrawingManager] = useState(null)
  const [infoWindowOpen, setInfoWindowOpen] = useState(false)
  const [selectedSubscriber, setSelectedSubscriber] = useState(null)

  const [showConnectingLines, setShowConnectingLines] = useState(false);
  const [connectingLines, setConnectingLines] = useState([]);
  const [polylines, setPolylines] = useState([]);

  const [subscribers, setSubscribers] = useState([])
  const [userCenter, setUserCenter] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }) // Default center
  const [userInteracting, setUserInteracting] = useState(false);

const [mapLoaded, setMapLoaded] = useState(false);

const handleBoundsChanged = useCallback(() => {
  if (mapRef.current) {
    const newCenter = mapRef.current.getCenter();
    setUserCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
  }
}, []);




  const subdomain = window.location.hostname.split('.')[0]
//   const drawingManager = useDrawingManager();
const { 
    drawingManager, 
    selectedOverlay, 
    setSelectedOverlay, 
    updateMarkerDetails,
    deleteDrawing 
  } = useDrawingManager();

  const createPolylines = useCallback((map) => {
    if (!map || !window.google || !subscribers.length) return [];

    const validSubscribers = subscribers.filter(sub => 
      sub.latitude && sub.longitude
    );

    if (validSubscribers.length < 2) return [];

    const lines = [];

    // Sequential connection
    for (let i = 0; i < validSubscribers.length - 1; i++) {
      const currentSub = validSubscribers[i];
      const nextSub = validSubscribers[i + 1];
      
      const polyline = new window.google.maps.Polyline({
        path: [
          { lat: parseFloat(currentSub.latitude), lng: parseFloat(currentSub.longitude) },
          { lat: parseFloat(nextSub.latitude), lng: parseFloat(nextSub.longitude) }
        ],
        geodesic: true,
        strokeColor: '#4285F4',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map: map
      });

      lines.push(polyline);
    }

    return lines;
  }, [subscribers]);

  // Toggle connecting lines
  const toggleConnectingLines = useCallback(() => {
    if (showConnectingLines) {
      // Remove all polylines
      polylines.forEach(polyline => {
        polyline.setMap(null);
      });
      setPolylines([]);
    } else {
      // Create new polylines
      if (mapRef.current) {
        const newPolylines = createPolylines(mapRef.current);
        setPolylines(newPolylines);
      }
    }
    setShowConnectingLines(prev => !prev);
  }, [showConnectingLines, polylines, createPolylines]);

  // Cleanup polylines on unmount
  useEffect(() => {
    return () => {
      polylines.forEach(polyline => {
        polyline.setMap(null);
      });
    };
  }, [polylines]);





  const fetchMapSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/google_maps', {
        method: 'GET',
        headers: {
          'X-Subdomain': subdomain,
        },
      })
      const newData = await response.json()
      if (response.ok) {
        setMapForm({
          api_key: newData[0].api_key
        })
      } else {
        if (response.status === 401) {
          setTimeout(() => {
            window.location.href = '/signin'
          }, 1900)
        }
      }
    } catch (error) {
      console.error('Error fetching map settings:', error)
    }
  }, [subdomain, setMapForm])

  // const getCurrentLocation = useCallback(() => {
  //   if (!navigator.geolocation) {
  //     setError('Geolocation is not supported by this browser.')
  //     setLoading(false)
  //     return
  //   }

  //   setLoading(true)
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       const { latitude, longitude } = position.coords
  //       setCurrentLocation({
  //         lat: latitude,
  //         lng: longitude
  //       })

  //       setMapCenter({
  //         lat: latitude,
  //         lng: longitude
  //       })
  //       setLoading(false)
  //       setError('')
  //     },
  //     (error) => {
  //       console.error('Error getting location:', error)
  //       setError('Unable to retrieve your location. Using default location.')
  //       setCurrentLocation({ lat: 40.7128, lng: -74.0060 })
  //       setLoading(false)
  //     },
  //     {
  //       enableHighAccuracy: true,
  //       timeout: 10000,
  //       maximumAge: 60000
  //     }
  //   )
  // }, [])

  // Search for locations


 const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      toast.error('Geolocation not supported')
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const location = {
          lat: latitude,
          lng: longitude
        }
        
        // Update both current location marker and map center
        setCurrentLocation(location)
        setMapCenter(location)
        setZoom(15) // Zoom in when showing current location
        setLoading(false)
        toast.success('Map centered to your location!')
      },
      (error) => {
        console.error('Error getting location:', error)
        setError('Unable to retrieve your location.')
        setLoading(false)
        toast.error('Failed to get your location')
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }, [])




  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim() || !window.google) return

    try {
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ address: searchQuery }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location
          setCurrentLocation({
            lat: location.lat(),
            lng: location.lng()
          })
          
          setMarkers(prev => [...prev, {
            id: Date.now(),
            position: { lat: location.lat(), lng: location.lng() },
            title: searchQuery,
            type: 'search'
          }])
        }
      })
    } catch (error) {
      console.error('Error searching location:', error)
    }
  }, [searchQuery])

  // Add marker on map click (manual marker placement)
  const handleMapClick = useCallback((event) => {
    if (drawingMode === 'marker') {
      const newMarker = {
        id: Date.now(),
        position: {
          lat: event.detail.latLng.lat,
          lng: event.detail.latLng.lng
        },
        title: `Marker ${markers.length + 1}`,
        type: 'user'
      }
      setMarkers(prev => [...prev, newMarker])
    }
  }, [drawingMode, markers.length])

  // Set drawing mode
  const setDrawingModeHandler = useCallback((mode) => {
    if (drawingManager) {
      if (drawingMode === mode) {
        drawingManager.setDrawingMode(null)
        setDrawingMode(null)
      } else {
        drawingManager.setDrawingMode(mode)
        setDrawingMode(mode)
      }
    }
  }, [drawingManager, drawingMode])

  // Clear all drawings
  const clearDrawings = useCallback(() => {
    setMarkers([])
    if (drawingManager) {
      drawingManager.setDrawingMode(null)
      setDrawingMode(null)
    }
  }, [drawingManager])

  // Toggle 3D buildings
  const toggle3D = useCallback(() => {
    setIs3DEnabled(prev => !prev)
  }, [])

  // Toggle Street View
  const toggleStreetView = useCallback(() => {
    setShowStreetView(prev => !prev)
  }, [])



    const handleCenterChanged = useCallback((event) => {
    setMapCenter(event.detail.center)
  }, [])
  const [zoom, setZoom] = useState(20)

  // Handle zoom changes when user zooms
  const handleZoomChanged = useCallback((event) => {
    setZoom(event.detail.zoom)
  }, [])
//  const handleMapLoad = useCallback((mapInstance) => {
//     console.log('🎯 Map loaded:', mapInstance);
    
//   }, []);

 useEffect(() => {
    if (!map) {
      console.log('🚨 Map not loaded yet');
      return;



    }
    
    console.log('🎯 Map loaded:', map);

    // here you can interact with the imperative maps API
  }, [map]);

  // Fetch subscribers data
  const fetchSubscribers = useCallback(async () => {
    try {
      const response = await fetch('/api/subscribers', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
      const newData = await response.json()
      if (response.ok) {
        setSubscribers(newData)
      } else {
        console.log('Failed to fetch subscribers')
      }
    } catch (error) {
      console.log(error)
    }
  }, [subdomain])

  useEffect(() => {
    fetchMapSettings()
  }, [fetchMapSettings])

  useEffect(() => {
    if (api_key) {
      getCurrentLocation()
       fetchMapSettings()

    }
  }, [api_key, getCurrentLocation, fetchMapSettings])

  useEffect(() => {
    fetchSubscribers()
  }, [fetchSubscribers])



useEffect(() => {
  console.log('🔄 Map ref updated:', mapRef.current);
}, []);



 const handleGoToCurrentLocation = () => {
    console.log('=== My Location Clicked ===');
    console.log('currentLocation:', currentLocation);
    console.log('map instance from useMap:', map);
    
    if (currentLocation && map) {
      console.log('Moving map to current location:', currentLocation);
      map.panTo(currentLocation);
      map.setCenter(currentLocation);
      map.setZoom(15);
      toast.success('Map centered to your location!');
    } else {
      console.log('No current location or map available');
      getCurrentLocation();
    }
  };

console.log('currentLocation', currentLocation)
  const handleDragStart = () => {
    setUserInteracting(true);
  };

  const handleDragEnd = () => {
    setUserInteracting(false);
  };

  //  const handleMapLoad = useCallback((map) => {
  //   mapRef.current = map;
  // }, []);

  // Cleanup drawing manager on unmount
//   useEffect(() => {
//     return () => {
//       if (drawingManager) {
//         drawingManager.setMap(null)
//       }
//     }
//   }, [drawingManager])

  // Handle subscriber marker click
  const handleSubscriberClick = useCallback((subscriber) => {
    setSelectedSubscriber(subscriber)
  }, [])

  // Close subscriber info window
  const handleCloseSubscriberInfo = useCallback(() => {
    setSelectedSubscriber(null)
  }, [])

  if (!api_key) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading map configuration...</p>
        </div>
      </div>
    )
  }




  return (
    <APIProvider apiKey={api_key} >
        <ToastContainer />
      <div className="w-full h-full">
        {/* Control Panel */}


      
        <div className="bg-white p-4 shadow-lg rounded-lg mb-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search Box */}
            <div className="flex-1 min-w-[200px]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for places..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Search
                </button>
              </div>
            </div>


              <button
              onClick={getCurrentLocation}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
              disabled={loading}
            >
              📍 My Location
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            </button>

            {/* Map Type Selector */}
            <select
              value={mapType}
              onChange={(e) => setMapType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="roadmap">Roadmap</option>
              <option value="satellite">Satellite</option>
              <option value="hybrid">Hybrid</option>
              <option value="terrain">Terrain</option>
            </select>

            {/* Drawing Tools */}
           

            {/* 3D & Street View Toggles */}
            <div className="flex gap-2">
              <button
                onClick={toggle3D}
                className={`px-3 py-2 rounded-lg ${
                  is3DEnabled 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🏢 {is3DEnabled ? '3D On' : '3D Off'}
              </button>
              <button
                onClick={toggleStreetView}
                className={`px-3 py-2 rounded-lg ${
                  showStreetView 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🌆 {showStreetView ? 'Street View On' : 'Street View Off'}
              </button>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="w-full md:h-[85vh] h-[800px]   rounded-2xl overflow-hidden shadow-2xl">
          <Map
          // ref={mapRef} 
          
          key={currentLocation ? `${currentLocation.lat}-${currentLocation.lng}` : 'default'}
            
            // defaultCenter={currentLocation ? { lat: currentLocation.lat, lng: currentLocation.lng } : { lat: 40.7128, lng: -74.0060 }}
            //  defaultCenter={currentLocation || { lat: 40.7128, lng: -74.0060 }}
             center={mapCenter} 
             zoom={zoom} 
              // Remove heavy features you don't need
  options={{
    maxZoom: 20,
    minZoom: 3,
    restriction: null, // Remove if you have map bounds restrictions
    // Disable features that might slow down rendering
    styles: [
      {
        "featureType": "poi",
        "stylers": [{ "visibility": "off" }] // Hide points of interest
      },
      {
        "featureType": "transit",
        "stylers": [{ "visibility": "off" }] // Hide transit
      }
    ]
  }}
            //  defaultCenter={currentLocation || mapCenter}
            //   center={mapCenter}
              // center={userInteracting ? undefined : mapCenter} // Don't control center while user is dragging
              //  defaultCenter={currentLocation || mapCenter}
            // defaultZoom={15}
                        onCenterChanged={handleCenterChanged}
            onZoomChanged={handleZoomChanged}
            onDragStart={() => console.log('User started dragging map')}
            onDragEnd={() => console.log('User stopped dragging map')}

            gestureHandling={'cooperative"'}
            tilt={is3DEnabled ? 45 : 0}
            disableDefaultUI={false}
          
            // styles={mapStyles}
            mapTypeId={mapType}
             onBoundsChanged={handleBoundsChanged}
            mapId='f17fe22c5fa0e67a8fd277db'
            streetView={showStreetView ? new window.google.maps.StreetViewPanorama() : null}
          >
            {/* Current Location Marker */}
            {currentLocation && (
              <>
                <AdvancedMarker
                icon={<IoPersonSharp className='text-red-600'/>}
                  position={currentLocation}
                  title="Your Current Location"
                  onClick={() => setInfoWindowOpen(true)}
                >
                  {/* <Pin
                    background={'red'}
                    borderColor={'green'}
                    glyphColor={'white'}
                  /> */}

                   <div className="bg-white rounded-full p-1 shadow-md">
        <IoPersonSharp className="text-red-600 text-xl w-7 h-7" />
      </div>
                </AdvancedMarker>
                
                {infoWindowOpen && (
                  <InfoWindow
                    position={currentLocation}
                    onCloseClick={() => setInfoWindowOpen(false)}
                  >
                    <div className="p-2">
                      <h3 className="font-bold text-lg text-blue-600">📍 Your Current Location</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Latitude: {currentLocation.lat.toFixed(6)}<br />
                        Longitude: {currentLocation.lng.toFixed(6)}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        You are here!
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </>
            )}

            {/* Subscriber Markers */}
            {subscribers.map((subscriber) => {
              // Check if subscriber has valid latitude and longitude
              if (!subscriber.latitude || !subscriber.longitude) return null;

              return (
                <AdvancedMarker
                  key={subscriber.id || `${subscriber.latitude}-${subscriber.longitude}`}
                   icon={<IoPersonSharp className='text-red-600'/>}
                  position={{
                    lat: parseFloat(subscriber.latitude),
                    lng: parseFloat(subscriber.longitude)
                  }}
                  title={subscriber.name || 'Subscriber'}
                  onClick={() => handleSubscriberClick(subscriber)}
                >

                     <div className="bg-white rounded-full p-1 shadow-md">
        <IoPersonSharp className="text-red-600 text-xl w-7 h-7" />
      </div>
                  {/* <Pin
                    background={'red'}
                    borderColor={'green'}
                    glyphColor={'white'}
                  /> */}
                </AdvancedMarker>
              );
            })}

            {/* Subscriber Info Window */}
            {selectedSubscriber && (
              <InfoWindow
                position={{
                  lat: parseFloat(selectedSubscriber.latitude),
                  lng: parseFloat(selectedSubscriber.longitude)
                }}
                onCloseClick={handleCloseSubscriberInfo}
              >
                <div className="p-3 min-w-[200px]">
                  <h3 className="font-bold text-lg text-blue-600 mb-2">
                    👤 {selectedSubscriber.name || 'Subscriber'}
                  </h3>
                  <div className="space-y-1 text-sm">
                    {selectedSubscriber.phone_number && (
                      <p className="text-gray-700">
                        <span className="font-medium">Phone:</span> {selectedSubscriber.phone_number}
                      </p>
                    )}
                    {selectedSubscriber.ppoe_username && (
                      <p className="text-gray-700">
                        <span className="font-medium">PPoE Username:</span> {selectedSubscriber.ppoe_username}
                      </p>
                    )}
                    <p className="text-gray-700">
                      <span className="font-medium">Location:</span><br />
                      Lat: {parseFloat(selectedSubscriber.latitude).toFixed(6)}<br />
                      Lng: {parseFloat(selectedSubscriber.longitude).toFixed(6)}
                    </p>
                    {selectedSubscriber.address && (
                      <p className="text-gray-700">
                        <span className="font-medium">Address:</span> {selectedSubscriber.address}
                      </p>
                    )}
                    {selectedSubscriber.status && (
                      <p className="text-gray-700">
                        <span className="font-medium">Status:</span> 
                        <span className={`ml-1 px-2 py-1 rounded text-xs ${
                          selectedSubscriber.status.toLowerCase() === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedSubscriber.status}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </InfoWindow>
            )}



           
          </Map>

<MyMapComponent toast={toast} />

<MarkerDetailsPanel
        selectedOverlay={selectedOverlay}
        onUpdate={updateMarkerDetails}
        onDelete={deleteDrawing}
        onClose={() => setSelectedOverlay(null)}
      />


      {/* <MapControl position={ControlPosition.TOP_CENTER}>
        <UndoRedoControl drawingManager={drawingManager} />
      </MapControl> */}
          
          {error && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-yellow-400">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </APIProvider>
  )
}

export default Maps