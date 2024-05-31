import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import LoadingButton from '@mui/lab/LoadingButton';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';


import Autocomplete from '@mui/material/Autocomplete';
import {  useState, useEffect, useMemo, useRef} from 'react'
import { useDebounce } from 'use-debounce';

const SubscriberDetails = ({handleClose,   
  packageNamee,

  formData,  createSubscriber, handleChangeForm, setFormData, isloading
}) => {

  const {name, ref_no , ppoe_password,  ppoe_username,  phone_number, email, second_phone_number,
     package_name, installation_fee, subscriber_discount, date_registered, router_name}= formData


  const [poe_package,] = useDebounce(package_name, 1000)
  const [ routerName] = useDebounce( router_name, 1000)

  const [packageName, setPackageName] = useState([])
  const [routers, setRouters]= useState ([])

  const [initialPackage, setInitialPackage] = useState(null);
  const [mikrotik_router, setRouter] = useState(null)

      const handleEmailChange =(e)=> {
        const {value, name} = e.target 
        setFormData({...formData, [name]:  value})
        console.log('my date',email)

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

    <div className=' relative right-20 w-full   '>
          <form onSubmit={createSubscriber}>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 '>
        <Box
      sx={{
        '& .MuiTextField-root': { m: 1, marginTop: '',  width: {
            xs: '40%',
            sm: '80%',
            md: '50%',
            lg: '70%',
            xl: '70%',
        },
            '& label.Mui-focused': {
              color: 'black',
              fontSize:'18px'
            
              },
            '& .MuiOutlinedInput-root': {
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "black",
              borderWidth: '3px'
              },
            '&.Mui-focused fieldset':  {
              borderColor: 'black', // Set border color to transparent when focused
            
            }
            },
        },
      }}
      noValidate
      autoComplete="on"
    >
        <TextField id="name"  sx={{
        }}  value={name}  onChange={handleChangeName}  className='myTextField' label="Name" variant="outlined" />

</Box>





<Autocomplete
                      
                      sx={{
                        m: 1,width: {
                          xs: '40%',
                          sm: '80%',
                          md: '50%',
                          lg: '70%',
                          xl: '70%',

              
              
              
                      },
                        '& label.Mui-focused': {
                          color: 'black',
                          fontSize:'16px'
                          },
                        '& .MuiOutlinedInput-root': {
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "black",
                          borderWidth: '3px'
                          },
                        '&.Mui-focused fieldset':  {
                          borderColor: 'black', // Set border color to transparent when focused
                        
                        }
                        },
                                 
                                }} 
                    
                                
                                      // getOptionLabel={'4MBPS'}
                    
                            options={top100Films}
                            
                                    renderInput={(params) => (
                                      <TextField
                                      id="user_group"
                    
                                      className='myTextField'
                                        {...params}
                                        label="Select User Group"
                                      
                    
                                       
                                      />
                                    )}
                                  
                                
                                    
                    
                                  />
                                  
                            


                                  <Autocomplete
                      
                      sx={{
                        m: 1, width: {
                          xs: '40%',
                          sm: '80%',
                          md: '50%',
                          lg: '70%',
                          xl:'70%'
                          
              
                      },
                        '& label.Mui-focused': {
                          color: 'black',
                          fontSize:'16px'
                          },
                        '& .MuiOutlinedInput-root': {
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "black",
                          borderWidth: '3px'
                          },
                        '&.Mui-focused fieldset':  {
                          borderColor: 'black', // Set border color to transparent when focused
                        
                        }
                        },
                                 
                                }} 
                    
                                
                                      // getOptionLabel={'4MBPS'}
                    
                            options={top100Films}
                            
                                    renderInput={(params) => (
                                      <TextField
                                      id="node"
                    
                                      className='myTextField'
                                        {...params}
                                        label="Select Node"
                                      
                    
                                       
                                      />
                                    )}
                                  
                                
                                    
                    
                                  />





      </div>
      


<div className='grid grid-cols-1 md:grid-cols-2 gap-1 '>

<Stack
spacing={{
  xs: 2,
  sm: 2,
  md: 4,
  lg: 5
  
}}
direction={{
  xs: 'column',
  sm:'row',
  md: 'row',
  lg: 'row',
  xl: 'row',
  xxl: 'row',

}}
      sx={{
        '& > :not(style)': { m: 1, width: {
            xs: '20%',
            sm: '80%',
            md: '50%',
            lg: '40%',
            xl:'70%',
            xxl: '100%'
        },
        '& label.Mui-focused': {
          color: 'black',
          fontSize:'18px'
        
          },
        '& .MuiOutlinedInput-root': {
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "black",
          borderWidth: '3px'
          },
        '&.Mui-focused fieldset':  {
          borderColor: 'black', // Set border color to transparent when focused
        
        }
        }, },
      }}
      noValidate
      autoComplete="on"
    >
      <TextField   name="email" value={email}   onChange={handleEmailChange} className='myTextField'
        type='email' label="Email" variant="outlined"/>


    <TextField id="phone_number"   value={formData.phone_number} placeholder='+254791568852' onChange={handlePhoneNumberChange} label="Phone"   InputProps={{

      startAdornment: (
        <InputAdornment  position='start'>
        <img src="/images/icons8-kenya-48.png" alt="kenyan-flag1" />
        </InputAdornment>  
      )
    }}  
     className='myTextField'  variant="outlined" />


</Stack>
</div>
  



                <div className='grid grid-cols-1 '>

<Box
      className='myTextField'
      sx={{
        '& > :not(style)': { m: 1,  width: {
            xs: '30%',
            sm: '80%',
            md: '50%',
            lg: '100%',
            xl:'100%'
        }  , '& label.Mui-focused': {
          color: 'black',
          fontSize:'17px'
        
          },
        '& .MuiOutlinedInput-root': {
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "black",
          borderWidth: '3px'
          },
        '&.Mui-focused fieldset':  {
          borderColor: 'black', // Set border color to transparent when focused
        
        }
        },},
      }}
      noValidate
      autoComplete="on"
    >
      <TextField id="second_phone_number"  placeholder='+254791568852'  onChange={handlePhoneNumberChange2}  value={second_phone_number}
         InputProps={{
      startAdornment: (
        <InputAdornment  position='start'>
        <img src="/images/icons8-kenya-48.png" alt="kenyan-flag1" />
        </InputAdornment>  
      )
    }} label="Phone Number" variant="outlined" />
    </Box>
                </div>




                <div className='grid grid-cols-1 md:grid-cols-3'>
                <Box
      className='myTextField'
      sx={{
        '& > :not(style)': { m: 1, width: {
            xs: '50%',
            sm: '80%',
            md: '50%',
            lg: '40%',
        } ,
        '& label.Mui-focused': {
          color: 'black',
          fontSize:'17px'
        
          },
        '& .MuiOutlinedInput-root': {
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "black",
          borderWidth: '3px'
          },
        '&.Mui-focused fieldset':  {
          borderColor: 'black', // Set border color to transparent when focused
        
        }
        }, },
      }}
      noValidate
      autoComplete="on"
    >
              <TextField id="ref_no"  onChange={handleChangeForm} value={ref_no} label="Ref No" variant="outlined" />

      <TextField id="ppoe_username"  onChange={handleChangeForm} value={ppoe_username}   label="Ppoe Username" variant="outlined" />
      <TextField id="ppoe_password"  onChange={handleChangeForm}  value={ppoe_password} label="Ppoe Password" variant="outlined"/>
    </Box>

                </div>

             
                <div className='grid grid-cols-1  md:grid-cols-2  '>




                <Autocomplete
            value={packageName.find(pkg => pkg.name === initialPackage) || null}

        sx={{
          m: 1,
          width: {
            xs: '50%',
            sm: '80%',
            md: '50%',
            lg: '70%',
          },
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
        }}
        getOptionLabel={(option) => option.name}

        options={packageName}
        renderInput={(params) => (
          <TextField
            id="router_name"
            className='myTextField'
            {...params}
            label="Select Package"
            getOptionValue={(option) => option.id}   // Function to extract the value from the option object

          />
        )}
        renderOption={(props, packageName) => (
          <Stack
            direction='row'
            spacing={2}
            sx={{
              width: '100%',
              padding: 1,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'start'
              }
            }}
            {...props}
          >
            <ion-icon size='large' name="wifi-outline"></ion-icon>
            {/* <div className='dark:bg-white  bg-gray-300  rounded-[100px] p-7 place-content-center
              text-xl w-7 dark:text-black h-8' >4</div> */}
            <Stack direction='column'>
            <span>{packageName.name}</span>
            <span>KES{packageName.price}</span>
            </Stack>
          
          </Stack>
          
        )}
        onChange={(event, newValue) => {
          console.log("Selected Package:", newValue);

          setFormData({ ...formData, package_name: newValue ? newValue.name : '' });
        }}

      />
                                  
                               


    <DemoContainer   sx={{ m: 1, width: {
            xs: '50%',
            sm: '80%',
            md: '50%',
            lg: '50%',
        },  '& label.Mui-focused': {
          color: 'black',
          fontSize:'16px'
        
          },
        '& .MuiOutlinedInput-root': {
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "black",
          borderWidth: '3px'
          },
        '&.Mui-focused fieldset':  {
          borderColor: 'black', // Set border color to transparent when focused
        
        }
        },  }} components={['DatePicker']}>
        <DatePicker  className='myTextField' onChange={(date)=> handleChangeDate(date)}  value={date_registered}  label="Date Registered" />
      </DemoContainer>
                </div>





                <div>
                <Stack
      component="form"
      className='myTextField'
      direction={{
        xs: 'column',
        lg: 'row',
        xl: 'row'
      }}
        
    
      sx={{
        '& > :not(style)': { m: 1, width: '40ch' },
        '& label.Mui-focused': {
          color: 'black',
          fontSize:'16px'
        
          },
        '& .MuiOutlinedInput-root': {
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "black",
          borderWidth: '3px'
          },
        '&.Mui-focused fieldset':  {
          borderColor: 'black', // Set border color to transparent when focused
        
        }
        },
      }}
      noValidate
      autoComplete="on"
    >
     
      <TextField id="installation_fee"   InputProps={{
      startAdornment: (
        <InputAdornment  position='start'>
        KES
        </InputAdornment>  
      )
    }}   value={installation_fee}   onChange={handleChangeForm} label="Installation Fee" type='number' variant="outlined" />
       <TextField id="subscriber_discount"   InputProps={{
      startAdornment: (
        <InputAdornment  position='start'>
        KES
        </InputAdornment>  
      )
    }}  value={subscriber_discount}  onChange={handleChangeForm}  label="Amount Subtracted From Customers Next Bill" type='number' variant="outlined" />
     <TextField id="outlined-basic" label="Installation Fee2" type='number' variant="outlined" />


    </Stack>


                        </div>



              <Autocomplete
                      value={routers.find((router)=> router.name === mikrotik_router)|| null}

  sx={{
width:{
  xs: '55%'
},
    '& label.Mui-focused': {
      color: 'black',
      fontSize:'16px'
      },
    '& .MuiOutlinedInput-root': {
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "black",
      borderWidth: '3px'
      },
    '&.Mui-focused fieldset':  {
      borderColor: 'black', // Set border color to transparent when focused
    
    }
    },
             
            }} 

            
                  getOptionLabel={(router) => router.name}

        options={routers}
        
                renderInput={(params) => (
                  <TextField
                  id="router_name"
                  getOptionValue={(option) => option.id}   // Function to extract the value from the option object

                  className='myTextField'
                    {...params}
                    label="Select Router"
                    error={!formData.router_name}
                    helperText={!formData.router_name ? 'required' : ''}

                   
                  />
                  
                )}
              
                onChange={(event, newValue) => {
                  console.log("Selected Router:", newValue);

                  setFormData({...formData, router_name: newValue ? newValue.name : '' });
                }}

                renderOption={(props, routerName) => (
                  <Stack
                    direction='row'
                    spacing={2}
                    sx={{
                      width: '100%',
                      padding: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        flexDirection: 'start'
                      }
                    }}
                    {...props}
                  >
                   <img  className='w-[60px] h-[50px]' src="/images/icons8-router-80.png" alt="router" />
                    <Stack direction='column'>
                    <span>{routerName.name}</span>
                    </Stack>
                  
                  </Stack>
                  
                )}
              />






<div className='flex justify-center mt-12'>

<div className='dark:bg-gray-500 bg-gray-800 dark:text-white
  text-white flex justify-center items-center gap-x-4  w-[200px] h-10'>
<p className='text-lg'>Get Location</p>

<ion-icon name="location-outline"></ion-icon>
</div>
</div>



<Stack    sx={{
                
                marginTop: 3,
                width: {
                  xs: '50%',
                  sm: '90%',
                  md: '90%',
              } ,
                '& label.Mui-focused': {
                    color: 'black',
                    fontSize: '17px'
                  
                    },
                  '& .MuiOutlinedInput-root': {
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                    borderWidth: '3px'
                    },
                  '&.Mui-focused fieldset':  {
                    borderColor: 'black', 
                    
                  
                  }
                  },
                }}   spacing={{
                lg: 4,
                xl: 4,
                sm: 4,
                md: 4,
                xs: 2
                }} direction={{
                xs: 'column',
                sm: 'row',
                md: 'row',
                lg: 'row',
                xl: 'row',
               
                }}  className='myTextField'>
                
                                <TextField    sx={{
                                  width: '100%'
                                }}  label='Latitude'/>
                                <TextField sx={{
                                                                 width: '100%'

                                }}  label='Longitude'/>
                
                            </Stack>
                


   <Box   className='myTextField' sx={{
       marginTop: 2,
"& .MuiInputBase-root": {
  height: 100
  }, 


   '& > :not(style)': { m: 1, width: {
    xs: '50%',
    sm: '80%',
    md: '50%',
    lg: '100%',
    xl:'100%'
} ,
'& label.Mui-focused': {
  color: 'black',
  fontSize:'17px'

  },
'& .MuiOutlinedInput-root': {
"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
  borderColor: "black",
  borderWidth: '3px'
  },
'&.Mui-focused fieldset':  {
  borderColor: 'black', // Set border color to transparent when focused

}
}, },
}} >
              
<TextField    label='Description Of Location'  />
    </Box> 

    
  

              
        <div className='flex gap-x-7 mt-3'>
          
        <Button color='error'   startIcon={<CloseIcon/>} variant='outlined' onClick={handleClose} >Cancel</Button>

<LoadingButton    loadingPosition= 'start'   startIcon={<AutorenewIcon/>} type='submit'
 loading={isloading}  color='success'
    variant='outlined'   >


  save
</LoadingButton>
        </div> 
        </form>

    </div>
  )
}

export default SubscriberDetails
