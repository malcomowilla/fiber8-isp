import {Button} from '../components/ui/button'

import {Link} from 'react-router-dom'

// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSeparator,
//   InputOTPSlot,
// } from "@/components/ui/input-otp"

import Loader from '../loader/Loader'
import {useState,useEffect} from 'react'
import { ReloadIcon } from "@radix-ui/react-icons"
import ResetNotification from '../notification/ResetNotification'
import { useApplicationSettings } from '../settings/ApplicationSettings';




 function ResetPassword() {

  const [isSeen, setIsSeen] = useState(true)
  const [email, setEmail] = useState('')
  const [loading, setloading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('');


  const {settingsformData, setWelcomeMessage,  setWelcome,
    companySettings,setCompanySettings,
    adminSettings, setAdminSettings,
  }  = useApplicationSettings()
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const {company_name, contact_info, email_info, logo_preview} = companySettings


const formData = {
  email: email,
}


console.log('message:', message)

const subdomain = window.location.hostname.split('.')[0]
const handleSignIn = async (e) => {
 

  e.preventDefault()
  setloading(true)
  const controller = new AbortController()
  

  const users = await fetch('api/password/reset', {
    method: "POST",
    
    headers: {
      'X-Subdomain': subdomain,
      "Content-Type": "application/json"
    }, 
    body: JSON.stringify(formData),

  },

  {
    signal: controller.signal
  }, 


  )



  setloading(false)

  let  actualUserDataInJson = await users.json()

  if (users.ok) {
    // const actualUserDataInJson = await users.json
    setEmail('')
    setloading(false)
    setOpen(true)
 setMessage(actualUserDataInJson.message );

 setError('');


// setTimeout(() => {
//   setMessage(actualUserDataInJson.message )
// }, 15000);

  } else {
    setError(actualUserDataInJson.error);
    setMessage('')
    setOpen(true)


  }
}





useEffect(() => {

}, [email]);




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
    
    </div>
    <div className='text-center mt-10 font-extralight'>
    <p>Enter Your One Time Password</p>

    </div> */}
<div className='text-center'>
    <p className='text-red-800 mt-8 font-bold text-2xl dotted-font '>{company_name}
       <span className='dark:text-white text-black'> 
     your isp of choice</span></p>
    </div>
    


 


    <main className=''>
    <ResetNotification handleClose={handleClose} open={open} message={message} error={error}/>
    <section className=" ">
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 ">
      <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-40 h-40 mr-2 rounded-full"
           src={logo_preview}  alt={company_name}/>
          
      </a>

      <div className="w-full p-6 bg-white rounded-lg shadow dark:border
       md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
         
         


          <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5"   onSubmit={handleSignIn }>
              <div className=' flex  flex-col  relative '>
                <div className=''>
                <label  className="  text-sm font-mono text-gray-900 dark:text-white ">Your email</label>

                </div>
                

                  <input value={email} required type="email" name="email" id="email" onChange={(e)=> setEmail(e.target.value)}  
                   className="bg-gray-50 border
                   border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600
                    block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                     dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="" />
 
              </div>
             
            
                <Link to='/signin'>
                <div className="flex gap-x-4 h-5">
                    
                    <ion-icon name="arrow-back-outline"></ion-icon>
                    <p>login</p>
                    </div>
                </Link>
                
                  
              <div className='flex items-center justify-center'>
              <Button variant='outline'  type='submit' className='dotted-font p-5' >Reset Password
            <ReloadIcon className={`ml-2 h-4 w-4  ${loading ? 'animate-spin' : 'hidden'}  `} />

            </Button>
              </div>

          </form>

      </div>
  </div>
</section>

</main>
    </>
  )
}


export default ResetPassword