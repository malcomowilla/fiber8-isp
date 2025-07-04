import { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useMapEvents } from 'react-leaflet';
import L from 'leaflet';  // import Leaflet
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position ? (
    <Marker position={position} icon={new L.Icon({ iconUrl, iconSize: [25, 41], iconAnchor: [12, 41] })}>
      <Popup>
        Latitude: {position.lat}, Longitude: {position.lng}
      </Popup>
    </Marker>
  ) : null;
}

export default function Node({ open, handleClose,
  mapReady, setMapReady, name, setName, position, setPosition,
  createNode
 }) {
  const mapRef = useRef();

  useEffect(() => {
    setMapReady(true);
  }, []);

console.log('position', position);

  const handleGetLocationPageload = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition({ lat: latitude, lng: longitude });
        },
        (err) => {
          alert(`Error getting location: ${err.message}`);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };





  useEffect(() => {
    setMapReady(true);
    handleGetLocationPageload(); // 👈 This will trigger the permission request on load
  }, []);
  
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition({ lat: latitude, lng: longitude });
        },
        (err) => {
          alert(`Error getting location: ${err.message}`);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth="md"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
    >
      <form onSubmit={createNode}>
      <DialogTitle sx={{ bgcolor: 'transparent', color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
        <p className='dark:text-white text-black'>Node Location</p>
      </DialogTitle>


      <DialogContent sx={{ pt: 30 }}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            className='myTextField'
            label="Node Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              
              '& label.Mui-focused': {
                color: 'primary.main',
              },
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                  borderWidth: 2,
                },
              },
            }}
          />

          {mapReady && (
            <div id="map" style={{ height: '300px', borderRadius: '8px', overflow: 'hidden' }}>
              <MapContainer
                center={position ? position : { lat: 0, lng: 0 }}
                zoom={position ? 15 : 13}
                id="map" style={{ height: '500px' }}
                whenCreated={(map) => { mapRef.current = map; }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker position={position} setPosition={setPosition} />
              </MapContainer>
            </div>
          )}

          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="contained"
              startIcon={<MyLocationIcon />}
              onClick={handleGetLocation}
              sx={{
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              Get My Location
            </Button>

            <TextField
              label="Latitude"
              className='myTextField'
              value={position?.lat?.toFixed(6) || ''}
              InputProps={{ readOnly: true }}
              sx={{ flex: 1 }}
            />

            <TextField
              className='myTextField'
              label="Longitude"
              value={position?.lng?.toFixed(6) || ''}
              InputProps={{ readOnly: true }}
              sx={{ flex: 1 }}
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': { borderColor: 'primary.dark' },
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!position}
          sx={{
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' },
            '&:disabled': { bgcolor: 'grey.300' },
          }}
        >
          Save Location
        </Button>
      </DialogActions>
      </form>
    </Dialog>
  );
}
