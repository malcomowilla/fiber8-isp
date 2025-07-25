import { Box, TextField, Autocomplete, Stack, InputAdornment, Button,
  DialogContentText,Chip
 } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Close, Add } from '@mui/icons-material';
import {useApplicationSettings} from '../settings/ApplicationSettings'
import {  useState, useEffect, useMemo, useRef, useCallback} from 'react'
import { useDebounce } from 'use-debounce';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { MdOutlineMailOutline } from "react-icons/md";
import { MdOutlinePerson } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";
import { FaHouseChimneyUser } from "react-icons/fa6";
import { FaRegBuilding } from "react-icons/fa";
import { 
  Select,
  MenuItem,
  InputLabel,

} from '@mui/material';
import { FcInfo } from "react-icons/fc";
import { CiLocationOn } from "react-icons/ci";
import { TbWorldLatitude } from "react-icons/tb";
import { TbWorldLongitude } from "react-icons/tb";





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


const SubscriberDetails = ({handleClose,   
  packageNamee,

  formData,  createSubscriber, handleChangeForm, setFormData, isloading,
  selectedLocations, setSelectedLocations,
  editingSubscriber, setEditingSubscriber
}) => {


  const {settingsformData, subscriberSettings, setSubscriberSettings,
    locationInput, setLocationInput, allLocations, setAllLocations
  } = useApplicationSettings()
  const {name, ref_no , ppoe_password,  ppoe_username,  phone_number, email, second_phone_number,
     package_name, installation_fee, subscriber_discount, date_registered, router_name,
     latitude, longitude, house_number, building_name,location,node
    }= formData



     const [position, setPosition] = useState(null);
     const [mapReady, setMapReady] = useState(false);
     const [openMapDialog, setOpenMapDialog] = useState(false);
     const mapRef = useRef();



  const [poe_package,] = useDebounce(package_name, 1000)
  const [ routerName] = useDebounce( router_name, 1000)

  const [packageName, setPackageName] = useState([])
  const [routers, setRouters]= useState ([])

  const [initialPackage, setInitialPackage] = useState(null);
  const [mikrotik_router, setRouter] = useState(null)
  const [nodes, setNodes] = useState([])





  useEffect(() => {
    setMapReady(true);
    handleGetLocationPageload();
  }, []);

  const handleGetLocationPageload = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition({ lat: latitude, lng: longitude });
          setFormData({
            ...formData,
            latitude: latitude,
            longitude: longitude
          });
          
        },
        (err) => {
          console.log(`Error getting location: ${err.message}`);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition({ lat: latitude, lng: longitude });
          if (mapRef.current) {
            mapRef.current.flyTo([latitude, longitude], 15);
          }
        },
        (err) => {
          alert(`Error getting location: ${err.message}`);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleOpenMapDialog = () => {
    setOpenMapDialog(true);
  };

  const handleCloseMapDialog = () => {
    setOpenMapDialog(false);
    // Save the position to form data when dialog closes
    if (position) {
      // setFormData({
      //   ...formData,
      //   latitude: position.lat,
      //   longitude: position.lng
      // });
    }
  };











const subdomain = window.location.hostname.split('.')[0];


 const getNodes = useCallback(
    async() => {
     
      
      try {
        const response = await fetch('/api/nodes', {
          headers: { 'X-Subdomain': subdomain },
        });
        const data = await response.json();
        if (response.ok) {
          setNodes(data)
          
        } else {
          

        }
      } catch (error) {
        
      }
    },
    [],
  )
  

  useEffect(() => {
    getNodes()
   
  }, [getNodes]);
















  const fetchSubscriberSettings = useCallback(
    async() => {
      try {
        const response = await fetch('/api/subscriber_settings',{
          headers: {
            'X-Subdomain': subdomain,
          },
        })
  
        const newData = await response.json()
        if (response.ok){
  
  
  const {
  
    prefix,
    minimum_digits,
    use_autogenerated_number_as_ppoe_username,
    notify_user_account_created,
    send_reminder_sms_expiring_subscriptions,
    account_number_starting_value,
    use_autogenerated_number_as_ppoe_password
  } = newData[0]
  
  
  
  setSubscriberSettings(
    {...subscriberSettings, prefix:prefix, minimum_digits:minimum_digits, 
     use_autogenerated_number_as_ppoe_username: use_autogenerated_number_as_ppoe_username,
     notify_user_account_created: notify_user_account_created,
     send_reminder_sms_expiring_subscriptions: send_reminder_sms_expiring_subscriptions,
     account_number_starting_value: account_number_starting_value,
     use_autogenerated_number_as_ppoe_password: use_autogenerated_number_as_ppoe_password
    }
  )
        }else{
  toast.error('failed to fetch subscriber settings', {
    position: "top-center",
    duration: 2000,
  })  
        }
      } catch (error) {
        toast.error('failed to fetch subscriber settings server error', {
          position: "top-center",
          duration: 2000,
        })  
      }
    },
    [],
  )
  
  
  
  useEffect(() => {
    fetchSubscriberSettings()
  }, [fetchSubscriberSettings]);
  


  const handleChangeBuildingNameAndHouseNumber =(e)=> {
    const {value, name} = e.target 
    setFormData({...formData, [name]:  value})

  }


      const handleEmailChange =(e)=> {
        const {value, name} = e.target 
        setFormData({...formData, [name]:  value})
        console.log('my date',email)

      }
      const handleLatitudeLongitudeChange =(e)=> {
        const {value, name} = e.target 
        setFormData({...formData, [name]:  value})
        console.log('latitude, long',value)

      }


      useEffect(() => {
        setInitialPackage(package_name);
        setRouter(router_name)

        console.log('package_name', )
      }, [package_name, router_name ]);
    

      
const capitalizeName = (name)=> {
  if (name.startsWith('')) {
    return name.toUpperCase()

  }

  return name
  }





  const fetchRouters = useMemo(() => async ()=> {
  


    try {
      const response = await fetch('/api/routers',{
        method: 'GET',
        headers: {
          'X-Subdomain': subdomain,
    
      }

    }
    
    
    )
    
      const newData = await response.json()
    if (response.ok) {
      console.log('router',newData)
      setRouters(newData)
  
    } else {
      console.log('failed to fetch routers')
  
    }
    
    } catch (error) {
      
      console.log(error)
    
    }
    
    
    }, [])
    
  
  
  
    useEffect(() => {
      
      fetchRouters()
    }, [ fetchRouters, routerName]);
  
  
  
  







const handleChangeName = (e) => {

  const {value} = e.target
  const capitalLetter = capitalizeName(value)
  setFormData({...formData,  name:  capitalLetter})
}

  const handleChangeDate = (date)=> {
    setFormData({...formData, date_registered: date})
    console.log('my date',date_registered)
  }

// const nineNumbers = ()=> {
//   number.match('[0-9]{10}')
// }

  const convertToKenyanFormat = (number) => {
    if (number.startsWith('0')) {
      return '+254' + number.substring(1)
    }


   
    return number;
  };



  const convertToKenyanFormat2 = (number) => {
    if (number.startsWith('0')) {
      return '+254' + number.substring(1)
    }


   
    return number;
  };


  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    if (value.length <= 13) {

      const formattedValue = convertToKenyanFormat(value);
      setFormData({ ...formData, phone_number: formattedValue })
     
    }
   
  };




  const handlePhoneNumberChange2 = (e) => {
    const value = e.target.value;


    if (value.length <= 13) {
      const formattedValue = convertToKenyanFormat2(value);
      setFormData({ ...formData, second_phone_number: formattedValue });
    }

    }
   

const fetchPackages = useMemo(() => async ()=> {
  
  try {
    const response = await fetch('/api/get_package',{
      method: 'GET',
      headers: {
        'X-Subdomain': subdomain,
      },
  
    }
  
  
  )
  
    const newData = await response.json()
  if (response.ok) {
    console.log('package',newData)
    setPackageName(newData)

  } else {
    console.log('failed to fetch routers')

  }
  
  } catch (error) {
    
    console.log(error)
  
  }
  
  
  }, [])
  



  useEffect(() => {
    
    fetchPackages()
  }, [ fetchPackages, poe_package]);




 const [newLocationDialogOpen, setNewLocationDialogOpen] = useState(false);
    const [pendingLocation, setPendingLocation] = useState('');
   

    const handleLocationChange = (event, value) => {
        setSelectedLocations(value);
    };

    const handleLocationInputChange = (event, value) => {
        setLocationInput(value);
    };

    const handleDeleteLocation = (locationToDelete) => () => {
        setSelectedLocations(selectedLocations.filter(location => location !== locationToDelete));
    };

    const handleAddNewLocation = () => {
        if (locationInput && !allLocations.includes(locationInput)) {
            setPendingLocation(locationInput);
            setNewLocationDialogOpen(true);
        }
    };

    const confirmAddNewLocation = () => {
        const newLocation = pendingLocation.trim();
        if (newLocation) {
            // Add to master list
            setAllLocations(prev => [...prev, newLocation]);
            // Add to selected locations
            setSelectedLocations(prev => [...prev, newLocation]);
            // Clear input
            setLocationInput('');
        }
        setNewLocationDialogOpen(false);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && locationInput && !allLocations.includes(locationInput)) {
            event.preventDefault();
            handleAddNewLocation();
        }
    };
  return (


    <>
     <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full md:mx-auto md:max-w-4xl p-4"
      >
        <form onSubmit={createSubscriber}>
          {/* Name and User Group */}
          <div className="mb-3">
            <Box className='flex flex-col md:flex-row gap-4'
              sx={{
                '& .MuiTextField-root': {
                  marginTop: '',
                  '& label.Mui-focused': {
                    color: 'black',
                    fontSize: '18px'
                  },
                  '& .MuiOutlinedInput-root': {
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "black",
                      borderWidth: '3px',
                      fontSize: '17px'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'black',
                    }
                  },
                },
              }}
            >
              <TextField
                className='myTextField'
                id="name"
                onChange={handleChangeName}
                value={name}
                InputProps={{
                  startAdornment: <MdOutlinePerson className='w-8 h-8 mr-2 text-blue-500' />,
                }}
                label="Name"
                variant="outlined"
                fullWidth
              />


              

              {/* <TextField id="ref_no" className='myTextField' fullWidth
                onChange={handleChangeForm} value={ref_no} label="Ref No" variant="outlined" /> */}



<TextField 
            InputProps={{
              startAdornment: <FaRegBuilding className='w-5 h-5 mr-2 text-yellow-500' />,
            }}
            className='myTextField' fullWidth
                label="Building Name"
                name="building_name"

                value={formData.building_name}
                onChange={handleChangeBuildingNameAndHouseNumber}
                variant="outlined" />

            </Box>
          </div>

          {/* Email and Phone */}
          <div className="">
            <Box className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'
              sx={{
                '& .MuiTextField-root': {
                  marginTop: '',
                  '& label.Mui-focused': {
                    color: 'black',
                    fontSize: '18px'
                  },
                  '& .MuiOutlinedInput-root': {
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "black",
                      borderWidth: '3px'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'black',
                    }
                  },
                },
              }}
            >
              <TextField
               InputProps={{
                startAdornment: <MdOutlineMailOutline className='w-7 h-7 mr-2 text-red-500' />,
              }}
                className='myTextField'
                name="email"
                value={email}
                onChange={handleEmailChange}
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
              />

              <TextField
                className='myTextField'
                id="phone_number"
                value={formData.phone_number}
                onChange={handlePhoneNumberChange}
                label="Phone"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img src="/images/icons8-kenya-48.png" alt="kenyan-flag" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                fullWidth
              />
            </Box>
          </div>

          <div className="">
            <Box className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 myTextField'
              sx={{
                '& .MuiTextField-root': {
                  marginTop: '',
                  '& label.Mui-focused': {
                    color: 'black',
                    fontSize: '18px'
                  },
                  '& .MuiOutlinedInput-root': {
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "black",
                      borderWidth: '3px'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'black',
                    }
                  },
                },
              }}
            >
            
              <DatePicker
                className='myTextField'
                value={date_registered}
                onChange={(date) => handleChangeDate(date)}
                label="Date Registered"
                renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
              />



               <Box sx={{ mt: 2 }}>
                                <Autocomplete
                                    multiple
                                    freeSolo
                                    options={allLocations}
                                    value={selectedLocations}
                                    onChange={handleLocationChange}
                                    inputValue={locationInput}
                                    onInputChange={handleLocationInputChange}
                                    renderInput={(params) => (
                                        <TextField 
                                        className='myTextField'
                                            {...params} 
                                            label="Locations" 
                                            placeholder="Type and press enter to add new locations"
                                            onKeyDown={handleKeyDown}
                                        />
                                    )}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                key={option}
                                                label={option}
                                                {...getTagProps({ index })}
                                                deleteIcon={<Close />}
                                                onDelete={handleDeleteLocation(option)}
                                            />
                                        ))
                                    }
                                />
                                {locationInput && !allLocations.includes(locationInput) && (
                                    <Button
                                        size="small"
                                        startIcon={<Add />}
                                        onClick={handleAddNewLocation}
                                        sx={{ mt: 1 }}
                                    >
                                        Add "{locationInput}" as new location
                                    </Button>
                                )}
                            </Box>

                            {/* {selectedLocations.length > 0 && (
                                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {selectedLocations.map((location) => (
                                        <Chip
                                            key={location}
                                            label={location}
                                            onDelete={handleDeleteLocation(location)}
                                            deleteIcon={<Close />}
                                            variant="outlined"
                                        />
                                    ))}
                                </Box>
                            )} */}
            </Box>
          </div>

          {/* Installation Fee and Discount */}
          <div>
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3"
              sx={{
                '& .MuiTextField-root': {
                  marginTop: '',
                  '& label.Mui-focused': {
                    color: 'black',
                    fontSize: '16px'
                  },
                  '& .MuiOutlinedInput-root': {
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "black",
                      borderWidth: '3px'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'black',
                    }
                  },
                },
              }}
            >
             <TextField
                className='myTextField'
                id="second_phone_number"
                value={formData.second_phone_number}
                onChange={handlePhoneNumberChange}
                label="Second Phone"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img src="/images/icons8-kenya-48.png" alt="kenyan-flag" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                fullWidth
              />

            <TextField 
            onChange={handleChangeBuildingNameAndHouseNumber}
            value={formData.house_number}
            name="house_number"
            InputProps={{
              startAdornment: <FaHouseChimneyUser className='w-5 h-5 mr-2 text-green-500' />,
            }}
            className='myTextField' fullWidth
                label="House Number" variant="outlined" />


            </Box>
          </div>



 <Box className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 myTextField'
            sx={{
              '& .MuiTextField-root': {
                marginTop: '',
                '& label.Mui-focused': {
                  color: 'black',
                  fontSize: '16px'
                },
                '& .MuiOutlinedInput-root': {
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                    borderWidth: '3px'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'black',
                  }
                },
              },
            }}
          >
 <TextField id="ppoe_password" onChange={handleChangeForm}
              InputProps={{
                startAdornment: <TbLockPassword className='w-6 h-6 mr-2 text-blue-500' />,
              }}
              value={ppoe_password}
                label="Ppoe Password" variant="outlined" />


               <TextField
                  InputProps={{
                    startAdornment: <FaRegUser className='w-5 h-5 mr-2 text-blue-500' />,
                  }}
                  
                  id="ppoe_username" onChange={handleChangeForm} value={ppoe_username}
                    label="Ppoe Username" variant="outlined" />

          </Box>


         <div>
          
                    
                    
<div className='bg-yellow-50 dark:bg-yellow-900 p-4 flex
gap-2 items-center justify-center
rounded-md mt-4 cursor-pointer'>
<FcInfo />
<p className='text-xs'> if you have chosen pppoe username as an 
  autogenerated number in the subscriber account settings then you c
  an leave this field blank(Ppoe Username)</p>

  
  </div>

  <Button
                variant="outlined"
                startIcon={<MyLocationIcon />}
                onClick={handleOpenMapDialog}
                sx={{ mt: 2 }}
              >
                Set Location on Map
              </Button>
          </div>

          {/* Location and Description */}
          <div className="mb-6">
            <Box
              sx={{
                '& .MuiTextField-root': {
                  marginTop: '',
                  '& label.Mui-focused': {
                    color: 'black',
                    fontSize: '16px'
                  },
                  '& .MuiOutlinedInput-root': {
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "black",
                      borderWidth: '3px'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'black',
                    }
                  },
                },
              }}
            >
             

                <InputLabel>Nodes</InputLabel>
               <Autocomplete
  fullWidth
  id="node-autocomplete"
  options={nodes}
  getOptionLabel={(option) => option.name}
  value={nodes.find(n => n.name === formData.node) || null}
  onChange={(event, newValue) => {
    console.log('Selected node:', newValue);
    setFormData(prev => ({ 
      ...prev, 
      node: newValue?.name || '' 
    }));
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Node"
      variant="outlined"
      InputProps={{
        ...params.InputProps,
        className: 'myTextField',
      }}
    />
  )}
  renderOption={(props, option) => (
    <li {...props} key={option.id}>
      <p className='text-black'>{option.name}</p>
    </li>
  )}
  sx={{
    '& .MuiAutocomplete-inputRoot': {
      padding: '8px 14px',
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'black',
        borderWidth: '2px'
      }
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'black',
      fontSize: '18px'
    }
  }}
/>

              {/* Location Button */}
            

              {/* Display coordinates if available */}
              {position && (
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  
                   <TextField
                  className='myTextField'
                    label="Latitude"
                    name="latitude"
                     InputProps={{
                readOnly: true,
                startAdornment: <TbWorldLatitude className="mr-2" />,
              }}
                    onChange={handleLatitudeLongitudeChange}
                    value={formData.latitude}
                  />





                  <TextField
                  className='myTextField'
                  name="longitude"
                   InputProps={{
                readOnly: true,
                startAdornment: <TbWorldLongitude className="mr-2" />,
              }}
                  onChange={handleLatitudeLongitudeChange}
                  value={formData.longitude}
                    label="Longitude"
                    // InputProps={{ readOnly: true }}
                    sx={{ flex: 1 }}
                  />
                </Box>
              )}
            </Box>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button onClick={(e) => {
              e.preventDefault()
              handleClose()
            }} className='bg-red-600 text-white rounded-3xl px-4 py-2
          transform hover:scale-110 transition duration-500 hover:bg-red-200  
          text-lg ' >
              Cancel
            </button>

            <button className='bg-black text-white rounded-3xl px-4 py-2
          transform hover:scale-110 transition duration-500 hover:bg-green-500
          text-lg' type="submit">
              {editingSubscriber ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </motion.div>

        <Dialog open={newLocationDialogOpen} onClose={() => setNewLocationDialogOpen(false)}>
                <DialogTitle>Add New Location</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to add "{pendingLocation}" as a new location?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNewLocationDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmAddNewLocation} color="primary" autoFocus>
                        Add Location
                    </Button>
                </DialogActions>
            </Dialog>

      {/* Map Dialog */}
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={openMapDialog}
        onClose={handleCloseMapDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
          Node Location
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            {mapReady && (
              <div id="map" style={{ height: '500px', borderRadius: '8px', overflow: 'hidden' }}>
                <MapContainer
                  center={position ? position : { lat: 0, lng: 0 }}
                  zoom={position ? 15 : 15}
                  style={{ height: '100%' }}
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
              className='myTextField'
                label="Latitude"
                 InputProps={{
                readOnly: true,
                startAdornment: <TbWorldLatitude className="mr-2" />,
              }}
                value={position?.lat?.toFixed(6) || ''}
                // InputProps={{ readOnly: true }}
                sx={{ flex: 1 }}
              />

              <TextField
              className='myTextField'
                label="Longitude"
               InputProps={{
                readOnly: true,
                startAdornment: <TbWorldLongitude className="mr-2" />,
              }}
                value={position?.lng?.toFixed(6) || ''}
                sx={{ flex: 1 }}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleCloseMapDialog}
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
            variant="contained"
            onClick={handleCloseMapDialog}
            sx={{
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            Save Location
          </Button>
        </DialogActions>
      </Dialog>
    </>

  )
}

export default SubscriberDetails
