import {Button} from '../components/ui/button'

import { useContext} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'

import {AlertDestructive} from '../validation_errors/AlertDestructive'
import {AlertDestructive2} from '../validation_errors/AlertDestructive2'
import {AlertDestructive3} from '../validation_errors/AlertDestructive3'
import {AlertDestructive4} from '../validation_errors/AlertDestructive4'

import {useState} from 'react'
import {Link} from 'react-router-dom'

import Loader from '../loader/Loader'

const Signup = () => {
  const [icon, setIcon] = useState()

const {isSeen, setIsSeen,isPassword, setPassword, email, setEmail, passwordConfirmation, setPasswordConfirmation,
   showErrors, handleSignUp, loading,handleThemeSwitch, setOfflineError, offlineError,username, setUsername
} = useContext(ApplicationContext);
   


  return (
    <>


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
  {offlineError && <p className='dark:text-red-600'>Something Went Wrong Please Try Again Later


   <span onClick={()=> setOfflineError(false)}  className='text-red-700 cursor-pointer '>      x</span></p>}
</div>


    <main className='lg:grid grid-cols-2 '>

    <section className="bg-gray-100 dark:bg-gray-900">
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 dark:bg-black">
      <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-40 h-40 mr-2" src="/images/fiber8logo1.png" alt="logo"/>
          
      </a>
      <div className="w-full p-6 bg-white rounded-lg shadow dark:border
       md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h2 className="mb-1 text-xl  leading-tight tracking-tight text-gray-900 md:text-2xl dotted-font  dark:text-white">
          Sign-In to your account and start managing your  business 


          </h2>
          <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5"   onSubmit={handleSignUp}>


              <div className=' flex  flex-col  relative '>
                <div className=''>
                <label  className="  text-sm font-mono text-gray-900 dark:text-white ">Your email</label>

                </div>
                 <div className='self-end  absolute p-8'>
                  <img src="/images/gmail.png" className=' ' alt="gmail" />

                  </div> 

                  <input value={email}  type="email" name="email" id="email" onChange={(e)=> setEmail(e.target.value)}  
                   className="bg-gray-50 border
                   border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600
                    block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                     dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-700"
                      placeholder="" />
                      {showErrors &&     <AlertDestructive3/>
 }
              </div>





              <div className=' flex  flex-col  relative '>
                <div className=''>
                <label  className="  text-sm font-mono text-gray-900 dark:text-white ">Your Username</label>

                </div>
                 
                <div className='self-end  absolute p-8'>
                <ion-icon name="person-outline"></ion-icon>
                  </div>
                  <input value={username}  type="text" name="username" id="username" onChange={(e)=> setUsername(e.target.value)}  
                   className="bg-gray-50 border
                   border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600
                    block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                     dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-700"
                      placeholder="" />
                      {showErrors &&     <AlertDestructive4/>
 }
              </div>











  






              <div className='flex flex-col relative'>
                  <label  className="block mb-2 text-sm font-mono text-gray-900 dark:text-white"> Password</label>
                  <div className='absolute max-sm:self-end p-9 lg:self-end' onClick={()=>setIsSeen(!isSeen)}>
                       <ion-icon name={isSeen ? "eye-outline" : "eye-off-outline"}></ion-icon>

                       </div>
                  <input value={isPassword} type={isSeen ? 'password' : 'text'} name="password" id="password"   onChange={(e)=> {
setPassword(e.target.value)
                  }}
                   
                    className="dark:bg-gray-700 border border-gray-300 text-gray-900 sm:text-sm
                     rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
                       dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                       dark:focus:ring-red-500 dark:focus:border-red-700"
                       
                       
                       />
                      
                      {showErrors &&     <AlertDestructive/>
 }
              </div>
              <div>

                  <label  className="block mt-8 text-sm font-mono text-gray-900 dark:text-white">Confirm password</label>
                  <input value={passwordConfirmation} type="password" name="confirm-password" id="confirm-password"
                   onChange={(e)=> setPasswordConfirmation(e.target.value)} className=" border border-gray-300 text-gray-900 sm:text-sm
                    rounded-lg focus:ring-primary-600 focus:border-primary-600 block 
                    w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                     dark:text-white dark:focus:ring-red-500 dark:focus:border-red-700 " />
              </div>
              <div className="flex items-start">
                  <div className="flex items-center h-5">
                    
                        {showErrors &&     <AlertDestructive2/>
 }
                  </div>
                 
              </div>


<div className='flex'>
  <p className='font-mono'>Already have an account?   <Link to='/signin'><span className='underline font-mono'>  Log in</span></Link></p>
</div>
              <div className=''>
                <p className='font-mono text-sm text-wrap'>New on Our Platform Reach us on  
                    <span className='font-extrabold'>  0791568852</span> for further asssitance </p>
              </div>
            
              <div className='flex items-center justify-center'>
            <Button><button className='dotted-font' type="submit">Sign Up</button></Button>

              </div>

          </form>

      </div>
  </div>
</section>
<div className='max-sm:hidden'>
<img src="/images/fiber8logo1.png" alt="" />
</div>

</main>

</>
  )
}

export default Signup



































