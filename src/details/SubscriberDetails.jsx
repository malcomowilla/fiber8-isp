import { Box, TextField, Autocomplete, Stack, InputAdornment, Button } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import LoadingButton from '@mui/lab/LoadingButton';
import CloseIcon from '@mui/icons-material/Close';

import {useApplicationSettings} from '../settings/ApplicationSettings'
import {  useState, useEffect, useMemo, useRef, useCallback} from 'react'
import { useDebounce } from 'use-debounce';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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

  formData,  createSubscriber, handleChangeForm, setFormData, isloading
}) => {


  const {settingsformData, subscriberSettings, setSubscriberSettings} = useApplicationSettings()
  const {name, ref_no , ppoe_password,  ppoe_username,  phone_number, email, second_phone_number,
     package_name, installation_fee, subscriber_discount, date_registered, router_name,
     latitude, longitude, house_number, building_name
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


  const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: "Schindler's List", year: 1993 },
    
    ]
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

          {/* Package and Date */}
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
              <Autocomplete
                value={packageName.find((pkg) => pkg.name === formData.package_name) || null}
                options={packageName}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField className='myTextField' {...params} label="Select Package" variant="outlined" fullWidth />
                )}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, package_name: newValue ? newValue.name : '' });
                }}
                sx={{ mb: 2 }}
              />
              <DatePicker
                className='myTextField'
                value={date_registered}
                onChange={(date) => handleChangeDate(date)}
                label="Date Registered"
                renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
              />
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
                id="installation_fee"
                value={installation_fee}
                onChange={handleChangeForm}
                label="Installation Fee"
                type="number"
                InputProps={{
                  startAdornment: (
                     <InputAdornment position="start">KES 💴</InputAdornment>
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
            {subscriberSettings.use_autogenerated_number_as_ppoe_username ? (
              <TextField id="ppoe_password" onChange={handleChangeForm}
              InputProps={{
                startAdornment: <TbLockPassword className='w-6 h-6 mr-2 text-blue-500' />,
              }}
              value={ppoe_password}
                label="Ppoe Password" variant="outlined" />
            ) : null}

            {subscriberSettings.use_autogenerated_number_as_ppoe_username === false &&
              subscriberSettings.use_autogenerated_number_as_ppoe_password === false && (
                <>
                  <TextField id="ppoe_password" onChange={handleChangeForm}
                  
                  InputProps={{
                    startAdornment: <TbLockPassword className='w-7 h-7 mr-2 text-blue-500' />,
                  }}
                  value={ppoe_password}
                    label="Ppoe Password" variant="outlined" />

                  <TextField
                  InputProps={{
                    startAdornment: <FaRegUser className='w-5 h-5 mr-2 text-blue-500' />,
                  }}
                  
                  id="ppoe_username" onChange={handleChangeForm} value={ppoe_username}
                    label="Ppoe Username" variant="outlined" />
                </>
              )}

            {subscriberSettings.use_autogenerated_number_as_ppoe_password ? (
              <TextField id="ppoe_username" onChange={handleChangeForm} 
              InputProps={{
                startAdornment: <FaRegUser className='w-5 h-5 mr-2 text-blue-500' />,
              }}
              value={ppoe_username}
                label="Ppoe Username" variant="outlined" />
            ) : null}
          </Box>

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
              <TextField
                className='myTextField'
                id="location"
                label="Description Of Location"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                sx={{ mb: 2 }}
                // value={location}
                onChange={handleChangeForm}
              />

              {/* Location Button */}
              <Button
                variant="outlined"
                startIcon={<MyLocationIcon />}
                onClick={handleOpenMapDialog}
                sx={{ mb: 2 }}
              >
                Set Location on Map
              </Button>

              {/* Display coordinates if available */}
              {position && (
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  {/* <TextField
                  className='myTextField'
                    label="Latitude"
                    id="latitude"
                    onChange={handleChangeForm}
                    // value={name}
                    value={position.lat.toFixed(6)}
                    sx={{ flex: 1 }}
                  /> */}
                   <TextField
                  className='myTextField'
                    label="Latitude"
                    name="latitude"
                    onChange={handleLatitudeLongitudeChange}
                    value={formData.latitude}
                    // value={latitude}
                  />
                  <TextField
                  className='myTextField'
                  name="longitude"
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
              Save
            </button>
          </div>
        </form>
      </motion.div>

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
//     <div className=' relative right-20 w-full'>
//           <form onSubmit={createSubscriber}>

//         <div className='grid grid-cols-1 md:grid-cols-3 gap-4 '>
//         <Box
//       sx={{
//         '& .MuiTextField-root': { m: 1, marginTop: '',  width: {
//             xs: '40%',
//             sm: '80%',
//             md: '50%',
//             lg: '70%',
//             xl: '70%',
//         },
//             '& label.Mui-focused': {
//               color: 'black',
//               fontSize:'18px'
            
//               },
//             '& .MuiOutlinedInput-root': {
//             "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//               borderColor: "black",
//               borderWidth: '3px'
//               },
//             '&.Mui-focused fieldset':  {
//               borderColor: 'black', // Set border color to transparent when focused
            
//             }
//             },
//         },
//       }}
//       noValidate
//       autoComplete="on"
//     >
//         <TextField id="name"  sx={{
//         }}  value={name}  onChange={handleChangeName}  className='myTextField' label="Name" variant="outlined" />

// </Box>





// <Autocomplete
                      
//                       sx={{
//                         m: 1,width: {
//                           xs: '40%',
//                           sm: '80%',
//                           md: '50%',
//                           lg: '70%',
//                           xl: '70%',

              
              
              
//                       },
//                         '& label.Mui-focused': {
//                           color: 'black',
//                           fontSize:'16px'
//                           },
//                         '& .MuiOutlinedInput-root': {
//                         "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                           borderColor: "black",
//                           borderWidth: '3px'
//                           },
//                         '&.Mui-focused fieldset':  {
//                           borderColor: 'black', // Set border color to transparent when focused
                        
//                         }
//                         },
                                 
//                                 }} 
                    
                                
//                                       // getOptionLabel={'4MBPS'}
                    
//                             options={top100Films}
                            
//                                     renderInput={(params) => (
//                                       <TextField
//                                       id="user_group"
                    
//                                       className='myTextField'
//                                         {...params}
//                                         label="Select User Group"
                                      
                    
                                       
//                                       />
//                                     )}
                                  
                                
                                    
                    
//                                   />
                                  
                            


//                                   <Autocomplete
                      
//                       sx={{
//                         m: 1, width: {
//                           xs: '40%',
//                           sm: '80%',
//                           md: '50%',
//                           lg: '70%',
//                           xl:'70%'
                          
              
//                       },
//                         '& label.Mui-focused': {
//                           color: 'black',
//                           fontSize:'16px'
//                           },
//                         '& .MuiOutlinedInput-root': {
//                         "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                           borderColor: "black",
//                           borderWidth: '3px'
//                           },
//                         '&.Mui-focused fieldset':  {
//                           borderColor: 'black', // Set border color to transparent when focused
                        
//                         }
//                         },
                                 
//                                 }} 
                    
                                
//                                       // getOptionLabel={'4MBPS'}
                    
//                             options={top100Films}
                            
//                                     renderInput={(params) => (
//                                       <TextField
//                                       id="node"
                    
//                                       className='myTextField'
//                                         {...params}
//                                         label="Select Node"
                                      
                    
                                       
//                                       />
//                                     )}
                                  
                                
                                    
                    
//                                   />





//       </div>
      


// <div className='grid grid-cols-1 md:grid-cols-2 gap-1 '>

// <Stack
// spacing={{
//   xs: 2,
//   sm: 2,
//   md: 4,
//   lg: 5
  
// }}
// direction={{
//   xs: 'column',
//   sm:'row',
//   md: 'row',
//   lg: 'row',
//   xl: 'row',
//   xxl: 'row',

// }}
//       sx={{
//         '& > :not(style)': { m: 1, width: {
//             xs: '20%',
//             sm: '80%',
//             md: '50%',
//             lg: '40%',
//             xl:'70%',
//             xxl: '100%'
//         },
//         '& label.Mui-focused': {
//           color: 'black',
//           fontSize:'18px'
        
//           },
//         '& .MuiOutlinedInput-root': {
//         "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//           borderColor: "black",
//           borderWidth: '3px'
//           },
//         '&.Mui-focused fieldset':  {
//           borderColor: 'black', // Set border color to transparent when focused
        
//         }
//         }, },
//       }}
//       noValidate
//       autoComplete="on"
//     >
//       <TextField   name="email" value={email}   onChange={handleEmailChange} className='myTextField'
//         type='email' label="Email" variant="outlined"/>


//     <TextField id="phone_number"   value={formData.phone_number} placeholder='+254791568852' onChange={handlePhoneNumberChange} label="Phone"   InputProps={{

//       startAdornment: (
//         <InputAdornment  position='start'>
//         <img src="/images/icons8-kenya-48.png" alt="kenyan-flag1" />
//         </InputAdornment>  
//       )
//     }}  
//      className='myTextField'  variant="outlined" />


// </Stack>
// </div>
  



//                 <div className='grid grid-cols-1 '>

// <Box
//       className='myTextField'
//       sx={{
//         '& > :not(style)': { m: 1,  width: {
//             xs: '30%',
//             sm: '80%',
//             md: '50%',
//             lg: '100%',
//             xl:'100%'
//         }  , '& label.Mui-focused': {
//           color: 'black',
//           fontSize:'17px'
        
//           },
//         '& .MuiOutlinedInput-root': {
//         "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//           borderColor: "black",
//           borderWidth: '3px'
//           },
//         '&.Mui-focused fieldset':  {
//           borderColor: 'black', // Set border color to transparent when focused
        
//         }
//         },},
//       }}
//       noValidate
//       autoComplete="on"
//     >
//       <TextField id="second_phone_number"  placeholder='+254791568852'  onChange={handlePhoneNumberChange2}  value={second_phone_number}
//          InputProps={{
//       startAdornment: (
//         <InputAdornment  position='start'>
//         <img src="/images/icons8-kenya-48.png" alt="kenyan-flag1" />
//         </InputAdornment>  
//       )
//     }} label="Phone Number" variant="outlined" />
//     </Box>
//                 </div>




//                 <div className='grid grid-cols-1 md:grid-cols-3'>
//                 <Box
//       className='myTextField'
//       sx={{
//         '& > :not(style)': { m: 1, width: {
//             xs: '50%',
//             sm: '80%',
//             md: '50%',
//             lg: '40%',
//         } ,
//         '& label.Mui-focused': {
//           color: 'black',
//           fontSize:'17px'
        
//           },
//         '& .MuiOutlinedInput-root': {
//         "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//           borderColor: "black",
//           borderWidth: '3px'
//           },
//         '&.Mui-focused fieldset':  {
//           borderColor: 'black', // Set border color to transparent when focused
        
//         }
//         }, },
//       }}
//       noValidate
//       autoComplete="on"
//     >
//               <TextField id="ref_no"  onChange={handleChangeForm} value={ref_no} label="Ref No" variant="outlined" />

//       <TextField id="ppoe_username"  onChange={handleChangeForm} value={ppoe_username}   label="Ppoe Username" variant="outlined" />
//       <TextField id="ppoe_password"  onChange={handleChangeForm}  value={ppoe_password} label="Ppoe Password" variant="outlined"/>


//     </Box>

//                 </div>

             
//                 <div className='grid grid-cols-1  md:grid-cols-2  '>




//                 <Autocomplete
//             value={packageName.find(pkg => pkg.name === initialPackage) || null}

//         sx={{
//           m: 1,
//           width: {
//             xs: '50%',
//             sm: '80%',
//             md: '50%',
//             lg: '70%',
//           },
//           '& label.Mui-focused': {
//             color: 'black',
//             fontSize: '16px'
//           },
//           '& .MuiOutlinedInput-root': {
//             "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//               borderColor: "black",
//               borderWidth: '3px'
//             },
//             '&.Mui-focused fieldset': {
//               borderColor: 'black',
//             }
//           },
//         }}
//         getOptionLabel={(option) => option.name}

//         options={packageName}
//         renderInput={(params) => (
//           <TextField
//             id="router_name"
//             className='myTextField'
//             {...params}
//             label="Select Package"
//             getOptionValue={(option) => option.id}  

//           />
//         )}
//         renderOption={(props, packageName) => (
//           <Stack
//             direction='row'
//             spacing={2}
//             sx={{
//               width: '100%',
//               padding: 1,
//               '&:hover': {
//                 backgroundColor: 'rgba(0, 0, 0, 0.1)',
//                 display: 'flex',
//                 flexDirection: 'start'
//               }
//             }}
//             {...props}
//           >
//             <ion-icon size='large' name="wifi-outline"></ion-icon>
//             {/* <div className='dark:bg-white  bg-gray-300  rounded-[100px] p-7 place-content-center
//               text-xl w-7 dark:text-black h-8' >4</div> */}
//             <Stack direction='column'>
//             <span>{packageName.name}</span>
//             <span>KES{packageName.price}</span>
//             </Stack>
          
//           </Stack>
          
//         )}
//         onChange={(event, newValue) => {
//           console.log("Selected Package:", newValue);

//           setFormData({ ...formData, package_name: newValue ? newValue.name : '' });
//         }}

//       />
                                  
                               


//     <DemoContainer   sx={{ m: 1, width: {
//             xs: '50%',
//             sm: '80%',
//             md: '50%',
//             lg: '50%',
//         },  '& label.Mui-focused': {
//           color: 'black',
//           fontSize:'16px'
        
//           },
//         '& .MuiOutlinedInput-root': {
//         "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//           borderColor: "black",
//           borderWidth: '3px'
//           },
//         '&.Mui-focused fieldset':  {
//           borderColor: 'black', // Set border color to transparent when focused
        
//         }
//         },  }} components={['DatePicker']}>
//         <DatePicker  className='myTextField' onChange={(date)=> handleChangeDate(date)} 
//          value={date_registered}  label="Date Registered" />

//       </DemoContainer>
//                 </div>





//                 <div>
//                 <Stack
//       component="form"
//       className='myTextField'
//       direction={{
//         xs: 'column',
//         lg: 'row',
//         xl: 'row'
//       }}
        
    
//       sx={{
//         '& > :not(style)': { m: 1, width: '40ch' },
//         '& label.Mui-focused': {
//           color: 'black',
//           fontSize:'16px'
        
//           },
//         '& .MuiOutlinedInput-root': {
//         "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//           borderColor: "black",
//           borderWidth: '3px'
//           },
//         '&.Mui-focused fieldset':  {
//           borderColor: 'black', // Set border color to transparent when focused
        
//         }
//         },
//       }}
//       noValidate
//       autoComplete="on"
//     >
     
//       <TextField id="installation_fee"   InputProps={{
//       startAdornment: (
//         <InputAdornment  position='start'>
//         KES
//         </InputAdornment>  
//       )
//     }}   value={installation_fee}   onChange={handleChangeForm} label="Installation Fee" type='number' variant="outlined" />
//        <TextField id="subscriber_discount"   InputProps={{
//       startAdornment: (
//         <InputAdornment  position='start'>
//         KES
//         </InputAdornment>  
//       )
//     }}  value={subscriber_discount}  onChange={handleChangeForm}  label="Amount Subtracted From Customers Next Bill" type='number' variant="outlined" />
//      <TextField id="outlined-basic" label="Installation Fee2" type='number' variant="outlined" />


//     </Stack>


//                         </div>



          





// <div className='flex justify-center mt-12'>

// <div className='dark:bg-gray-500 bg-gray-800 dark:text-white
//   text-white flex justify-center items-center gap-x-4  w-[200px] h-10'>
// <p className='text-lg'>Get Location</p>

// <ion-icon name="location-outline"></ion-icon>
// </div>
// </div>



// <Stack    sx={{
                
//                 marginTop: 3,
//                 width: {
//                   xs: '50%',
//                   sm: '90%',
//                   md: '90%',
//               } ,
//                 '& label.Mui-focused': {
//                     color: 'black',
//                     fontSize: '17px'
                  
//                     },
//                   '& .MuiOutlinedInput-root': {
//                   "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                     borderColor: "black",
//                     borderWidth: '3px'
//                     },
//                   '&.Mui-focused fieldset':  {
//                     borderColor: 'black', 
                    
                  
//                   }
//                   },
//                 }}   spacing={{
//                 lg: 4,
//                 xl: 4,
//                 sm: 4,
//                 md: 4,
//                 xs: 2
//                 }} direction={{
//                 xs: 'column',
//                 sm: 'row',
//                 md: 'row',
//                 lg: 'row',
//                 xl: 'row',
               
//                 }}  className='myTextField'>
                
//                                 <TextField    sx={{
//                                   width: '100%'
//                                 }}  label='Latitude'/>
//                                 <TextField sx={{
//                                                                  width: '100%'

//                                 }}  label='Longitude'/>
                
//                             </Stack>
                


//    <Box   className='myTextField' sx={{
//        marginTop: 2,
// "& .MuiInputBase-root": {
//   height: 100
//   }, 


//    '& > :not(style)': { m: 1, width: {
//     xs: '50%',
//     sm: '80%',
//     md: '50%',
//     lg: '100%',
//     xl:'100%'
// } ,
// '& label.Mui-focused': {
//   color: 'black',
//   fontSize:'17px'

//   },
// '& .MuiOutlinedInput-root': {
// "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//   borderColor: "black",
//   borderWidth: '3px'
//   },
// '&.Mui-focused fieldset':  {
//   borderColor: 'black', // Set border color to transparent when focused

// }
// }, },
// }} >
              
// <TextField    label='Description Of Location'  />
//     </Box> 

    
  

              
//         <div className='flex gap-x-7 mt-3'>
          
//         <Button color='error'   startIcon={<CloseIcon/>} variant='outlined' onClick={handleClose} >Cancel</Button>

// <LoadingButton    loadingPosition= 'start'   startIcon={<AutorenewIcon/>} type='submit'
//  loading={isloading}  color='success'
//     variant='outlined'   >


//   save
// </LoadingButton>
//         </div> 
//         </form>

//     </div>
  )
}

export default SubscriberDetails
