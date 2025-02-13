import {Button} from '../components/ui/button'
import { ReloadIcon } from "@radix-ui/react-icons"
import {Link} from 'react-router-dom'
import {ApplicationContext} from '../context/ApplicationContext'
import {useNavigate} from 'react-router-dom'
import { useApplicationSettings } from '../settings/ApplicationSettings';

// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSeparator,
//   InputOTPSlot,
// } from "@/components/ui/input-otp"

import Loader from '../loader/Loader'
import { useContext, useState, useEffect, useCallback} from 'react'

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import toast, { Toaster } from 'react-hot-toast';
import { IoKeyOutline } from "react-icons/io5";






 function InputOTPWithSeparator() {

const { setCurrentUser, handleThemeSwitch   
} = useContext(ApplicationContext);


  const {settingsformData, setWelcomeMessage,  setWelcome,
    companySettings,setCompanySettings
  }  = useApplicationSettings()
const navigate = useNavigate()
const [icon, setIcon] = useState()

  const [isSeen, setIsSeen] = useState(true)
  const [showErrors, setShowErrors] = useState(false)
  const [isPassword, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setloading] = useState(false)
  const [error, setError] = useState('')
  const [offlineError, setOfflineError] = useState(false)


  const {company_name, contact_info, email_info, logo_preview} = companySettings


const formData = {
  email: email,
  password: isPassword,
  welcome_back_message: settingsformData.welcome_back_message
}


const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 9000);




  const subdomain = window.location.hostname.split('.')[0];
const [logoUrl, setLogoUrl] = useState('')

  const handleGetCompanySettings = useCallback(
    async() => {
      try {
        const response = await fetch('/api/allow_get_company_settings', {
          headers: {
            'X-Subdomain': subdomain,
          },
        })
        const newData = await response.json()
        if (response.ok) {
          // setcompanySettings(newData)
          const { contact_info, company_name, email_info, logo_url,
            customer_support_phone_number,agent_email ,customer_support_email
           } = newData

           setLogoUrl(logo_url)
          setCompanySettings((prevData)=> ({...prevData, 
            contact_info, company_name, email_info,
            customer_support_phone_number,agent_email ,customer_support_email,
          
            logo_preview: logo_url
          }))
  
          console.log('company settings fetched', newData)
        }else{
          console.log('failed to fetch company settings')
        }
      } catch (error) {
        toast.error('internal servere error  while fetching company settings')
      
      }
    },
    [setCompanySettings, subdomain],
  )
  
  useEffect(() => {
    
    handleGetCompanySettings()
    
  }, [handleGetCompanySettings])








const handleSignIn = async (e) => {
  


  e.preventDefault()
  // const response = await fetch('/api/csrf_token');
  // const { csrf_token } = await response.json();

  // console.log("CSRF Token:", csrf_token);

  try {
    setShowErrors(false)
  setOfflineError(false)
  setloading(true)

  const users = await fetch('/api/sign_in', {
    method: "POST",
    
    headers: {
      'X-Subdomain': subdomain,

      "Content-Type": "application/json",

    }, 
    signal: controller.signal,  

    // Authorization: `Bearer ${token}`,

    body: JSON.stringify(formData),

  },

  


  )

  clearTimeout(id);


  setloading(false)
  setOfflineError(false)

  let  actualUserDataInJson = await users.json()


  if (users.status === 423) {
   setTimeout(() => {
    navigate('/account-locked')
   }, 1800); 
  }
  // if (users.status === 401) {
  //   setOfflineError(false)

  // }

  if (actualUserDataInJson.redirect) {
    window.location.href = actualUserDataInJson.redirect; // Redirect manually
  }
  
  if (users.ok || users.status === 202) {
    navigate('/admin/analytics')

    setEmail('')
    setPassword('')
    // setShowErrors(false)
    setloading(false)
   

    // setWelcomeMessage(actualUserDataInJson.welcome_back)
   
    
  //  setCurrentUser(actualUserDataInJson.user)

  //  setOfflineError(false)


  } else {
    setError(actualUserDataInJson.error);
   toast.error(actualUserDataInJson.error,{
    position: "top-right",
    duration: 7000,
   })

    setShowErrors(true)
  setCurrentUser([])
  setloading(false)


  }
  } catch (error) {
    toast.error('something went wrong internalserver eror', {
      position: "top-right",
      duration: 7000,
    })
    // console.log(error.name === 'AbortError');
    setloading(false);
    setOfflineError(true);


// setTimeout(() => {
//   setOfflineError(false)
// }, 8000);

  }

}


    
// setTimeout(() => {
//   setWelcome(false)

// }, 9000);

console.log("Logo Preview URL:", logo_preview);


// passkey-signin
  return (
<>
    {/* <div className='flex justify-center items-center w-full '>
    <img src="/images/fiber8logo2.png" alt="fiber8-image" />

    </div>
    <div className='flex justify-center items-center mt-[500px] w-full h-full'>
    <InputOTP
      maxLength={6}
      render={({ slots }) => (
        <InputOTPGroup className="gap-10">
          {slots.map((slot, index) => (
            <React.Fragment key={index}>
              <InputOTPSlot className="rounded-md border-4" {...slot} />
              {index !== slots.length - 1 && <InputOTPSeparator />}
            </React.Fragment>
          ))}{" "}
        </InputOTPGroup>
        
      )}
    />
    </div>
    <div className='text-center mt-10 font-extralight'>
    <p>Enter Your One Time Password</p>

    </div> */}
 <Toaster />

    


{/*  

 <div className='flex flex-row'>
  

 </div> */}
{/* 

<div className=''>
  {offlineError &&    <Stack sx={{ width: '20%',   }} >
      <Alert sx={{backgroundColor: 'rgb(255, 0, 0)'}} severity="error">Something Went Wrong Please Try Again Later.</Alert>
    </Stack>}
</div> */}


    <main className=''>






    <section className="flex justify-center items-center">

  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0
  
  ">




<div onClick={handleThemeSwitch} className='dark:text-white flex justify-center cursor-pointer'>
<ion-icon onClick={()=>setIcon(!icon)}  name={icon ? 'moon-outline' : 'sunny'} className='' size='large'></ion-icon>
</div>
<div className='text-center dotted-font'>
    <p className='dark:text-white mt-8 font-bold text-2xl '>Welcome To <span className='text-red-700'>Fiber 8</span> </p>
    </div>

      <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900
       dark:text-white ">
          <img className="w-40 h-40 mr-2 rounded-full mt-20" src={logo_preview} alt="logo"  />
          {/* <img className="w-40 h-40 mr-2 rounded-full mt-20" src='https://8209-102-221-35-92.ngrok-free.app/rails/active_storage/disk/eyJfcmFpbHMiOnsiZGF0YSI6eyJrZXkiOiJsNDBwbWN1YXc1NDJsMG1jZGhmbzBsZm42ODVpIiwiZGlzcG9zaXRpb24iOiJpbmxpbmU7IGZpbGVuYW1lPVwiZmliZXI4bG9nbzEucG5nXCI7IGZpbGVuYW1lKj1VVEYtOCcnZmliZXI4bG9nbzEucG5nIiwiY29udGVudF90eXBlIjoiaW1hZ2UvcG5nIiwic2VydmljZV9uYW1lIjoibG9jYWwifSwicHVyIjoiYmxvYl9rZXkifX0=--1bc68299b8711907c6cbf55859a4e1f68804c6dd/fiber8logo1.png' alt="logo"  /> */}

      </a>

      <div className="w-full p-6 bg-white rounded-lg shadow dark:border
       md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h2 className="mb-1 text-xl  leading-tight tracking-tight text-gray-900 
          md:text-2xl dotted-font 
           dark:text-white">
          Sign-In to your account and start managing your  network

          </h2>
          {/* <div className='flex flex-row'>
          <p className='font-montserat-light'>Don't have an account? <Link to='/'><span className='underline
          font-montserat
          '>Sign Up</span></Link> </p>

          </div> */}

          {/* {showErrors && <p className="text-red-600">{error}</p>} */}

          <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5"   onSubmit={handleSignIn }>
              <div className=' flex  flex-col  relative '>
                <div className=''>
                <label  className="  text-sm font-mono text-gray-900 dark:text-white ">Your email</label>
{/* {error} */}
                </div>
                 <div className='self-end  absolute p-8'>
                  <img src="/images/gmail.png" className=' ' alt="gmail" />

                  </div> 

                  <input value={email}  type="email" name="email" id="email" onChange={(e)=> setEmail(e.target.value)}  
                   className="bg-gray-50 border
                   border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600
                    block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                     dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                      placeholder="" />
 
              </div>
              <div className='flex flex-col relative'>
                  <label  className="block mb-2 text-sm font-mono text-gray-900 dark:text-white"> Password</label>
                  <div className='absolute self-end p-9 dark:text-black' onClick={()=>setIsSeen(!isSeen)}>
                       <ion-icon name={isSeen ? "eye-outline" : "eye-off-outline"}></ion-icon>

                       </div>
                  <input value={isPassword} type={isSeen ? 'password' : 'text'} name="password" id="password"   onChange={(e)=> {
setPassword(e.target.value)
                  }}
                   
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm
                     rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
                      dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                      dark:focus:ring-red-500 dark:focus:border-red-500"
                       
                       
                       />
                      
 
              </div>
              <div>

                
              </div>
              <div className="flex flex-row  justify-between ">

              {/* passkey-signin */}

<Link to='/passkey-signin' className='flex flex-row gap-2 cursor-pointer'>
                <IoKeyOutline className='w-5 h-5' />
                <p className='font-montserat-light'>passkey</p>
</Link>

                
 
                 
                  <div className="ml-3 text-sm 
                  flex justify-evenly flex-wrap lg:gap-20 max-md:gap-40 sm:gap-20 max-sm:gap-10 "> 
                   


                 <Link to='/reset-password'> <p className='text-sm  font-montserat-light'>Forgot your password?</p></Link>
                  </div>
              </div>
              <div className='flex items-center justify-center'>
              <Button variant='outline'  type='submit' className='dotted-font p-5' >Sign In
            <ReloadIcon className={`ml-2 h-4 w-4  ${loading ? 'animate-spin' : 'hidden'}  `} />

            </Button>
              </div>



<div>

  <p className='text-sm font-montserrat'>New on our platform? Reach us on 0791568852 for a free trial!</p>
</div>
          </form>

      </div>
  </div>
</section>


</main>
    </>
  )
}
export default  InputOTPWithSeparator