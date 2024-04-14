import {Button} from '../components/ui/button'
import {Link} from 'react-router-dom'
import {ApplicationContext} from '../context/ApplicationContext'
import {useNavigate} from 'react-router-dom'
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSeparator,
//   InputOTPSlot,
// } from "@/components/ui/input-otp"

import Loader from '../loader/Loader'
import { useContext, useState, useEffect} from 'react'


 function InputOTPWithSeparator() {

const { setCurrentUser, handleThemeSwitch   
} = useContext(ApplicationContext);
  
const navigate = useNavigate()
const [icon, setIcon] = useState()

  const [isSeen, setIsSeen] = useState(true)
  const [showErrors, setShowErrors] = useState(false)
  const [isPassword, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setloading] = useState(false)
  const [error, setError] = useState('')
  const [offlineError, setOfflineError] = useState(false)




const formData = {
  email: email,
  password: isPassword
}
const token = localStorage.getItem("jwt");


const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 9000);

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

      "Content-Type": "application/json",

    }, 
    credentials: 'include', // Include cookies in the request
    signal: controller.signal,  

    // Authorization: `Bearer ${token}`,

    body: JSON.stringify(formData),

  },

  


  )

  clearTimeout(id);


  setloading(false)
  setOfflineError(false)

  let  actualUserDataInJson = await users.json()

  if (users.status === 401) {
    setOfflineError(false)

  }
  if (users.ok) {
    setEmail('')
    setPassword('')
    setShowErrors(false)
    setloading(false)
   setCurrentUser(actualUserDataInJson.user)
   document.cookie = "authenticated=true; path=/";
   console.log('user1:',actualUserDataInJson)
   navigate('/layout/admin-dashboard')
   setOfflineError(false)


    // console.log(actualUserDataInJson)
  } else {
    setError(actualUserDataInJson.message);
   

    setShowErrors(true)
  setCurrentUser([])
  setloading(false)

    console.log(actualUserDataInJson)

  }
  } catch (error) {
    console.log(error.name === 'AbortError');
    setloading(false);
    setOfflineError(true);
  }

}



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


<div onClick={handleThemeSwitch} className='dark:text-white flex justify-center'>
<ion-icon onClick={()=>setIcon(!icon)}  name={icon ? 'moon-outline' : 'sunny'} className='' size='small'></ion-icon>
</div>


<div className='text-center'>
    <p className='dark:text-white mt-8 font-bold text-2xl font-mono'>Welcome To <span className='text-red-700'>Fiber 8</span> </p>
    </div>
    


 

 <div className='flex flex-row'>
  {loading ? <Loader/> : null


 }

 </div>


<div className=''>
  {offlineError && <p className='text-red-300'>Something Went Wrong Please Try Again Later


   <span onClick={()=> setOfflineError(false)}  className='text-red-700 cursor-pointer '>      x</span></p>}
</div>


    <main className='lg:grid grid-cols-2'>

    <section className="bg-gray-100 dark:bg-gray-900">
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 dark:bg-black">
      <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-40 h-40 mr-2 rounded-md" src="/images/fiber8logo1.png" alt="logo"  />
          
      </a>

      <div className="w-full p-6 bg-white rounded-lg shadow dark:border
       md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h2 className="mb-1 text-xl  leading-tight tracking-tight text-gray-900 md:text-2xl dotted-font  dark:text-white">
          Sign-In to your account and start managing your  business 

          </h2>
          <div className='flex flex-row'>
          <p>Don't have an account? <Link to='/'><span className='underline'>Sign Up</span></Link> </p>

          </div>

          {showErrors && <p className="text-red-600">{error}</p>}

          <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5"   onSubmit={handleSignIn }>
              <div className=' flex  flex-col  relative '>
                <div className=''>
                <label  className="  text-sm font-mono text-gray-900 dark:text-white ">Your email</label>
{error}
                </div>
                 <div className='self-end  absolute p-8'>
                  <img src="/images/gmail.png" className=' ' alt="gmail" />

                  </div> 

                  <input value={email}  type="email" name="email" id="email" onChange={(e)=> setEmail(e.target.value)}  
                   className="bg-gray-50 border
                   border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600
                    block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                     dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="" />
 
              </div>
              <div className='flex flex-col relative'>
                  <label  className="block mb-2 text-sm font-mono text-gray-900 dark:text-white"> Password</label>
                  <div className='absolute self-end p-9' onClick={()=>setIsSeen(!isSeen)}>
                       <ion-icon name={isSeen ? "eye-outline" : "eye-off-outline"}></ion-icon>

                       </div>
                  <input value={isPassword} type={isSeen ? 'password' : 'text'} name="password" id="password"   onChange={(e)=> {
setPassword(e.target.value)
                  }}
                   
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm
                     rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
                      dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                       dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       
                       
                       />
                      
 
              </div>
              <div>

                
              </div>
              <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input id="newsletter" aria-describedby="newsletter" type="checkbox" className="w-4 h-4 border
                     border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700
                      dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
 
                  </div>
                  <div className="ml-3 text-sm flex justify-evenly flex-wrap lg:gap-20 max-md:gap-40 sm:gap-20 max-sm:gap-10 "> 
                    <label className="font-mono text-gray-500 dark:text-gray-300">
                      Remeber Me</label>
                 <Link to='/reset-password'> <p className='text-sm underline'>Forgot your password?</p></Link>
                  </div>
              </div>
              <div className='flex items-center justify-center'>
            <Button><button className='dotted-font' type="submit">Sign In</button></Button>

              </div>

          </form>

      </div>
  </div>
</section>
<div className='max-sm:hidden  '>
<img src="/images/fiber8logo1.png" alt="login-image"  className=' rounded-lg'/>
</div>

</main>
    </>
  )
}
export default  InputOTPWithSeparator