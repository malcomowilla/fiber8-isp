import React from 'react'
import {useApplicationSettings} from '../settings/ApplicationSettings'
import {useState, useEffect} from 'react'
import { createAvatar } from '@dicebear/core';
  import { lorelei } from '@dicebear/collection';
  import toast, { Toaster } from 'react-hot-toast';
  import LoadingAnimation from '../loader/loading_animation.json'
import Lottie from 'react-lottie';

import Backdrop from '@mui/material/Backdrop';




const AdminProfile = () => {
  const {currentUser, setCurrentUser, currentUsername, currentEmail} = useApplicationSettings()
const [formData, setFormData] = useState({
  // password_confirmation: '',
  email: '',
  password: '',
  username: '',
  phone_number: '',
})
const [loading, setLoading] = useState(false)
const [openLoad, setOpenLoad] = useState(false)

const {email, password, username, phone_number} = formData







useEffect(() => {
  
  const fetchCurrentUser = async() => {
   try {
     const response = await fetch('/api/currently_logged_in_user')
     const newData = await response.json()
     if (response) {
       console.log('fetched current user', newData)
       const {username, email, id, created_at, updated_at, phone_number} = newData
       setFormData({...formData, username, email, phone_number})
       console.log('current user', newData)
     }
   } catch (error) {
     toast.error('Something went wrong please try again failed to fetch profile', {
       duration: 7000,
       position: "top-center",
     });
   }
  }
  fetchCurrentUser()
 }, []);







  // update_profile
const handleChangeFormData = (e) => {
  const { type, name, checked, value } = e.target;
  setFormData((prevFormData) => ({
    ...prevFormData,
    [name]: type === "checkbox" ? checked : value,
  }));
};

  const updateProfile = async(e) => {
    setOpenLoad(true)
    setLoading(true)
    e.preventDefault()
    const url = "/api/update_profile"
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include', // Include cookies in the request
      body: JSON.stringify(formData),
    })

    try {
      if (response.ok) {
        setOpenLoad(false)
        setLoading(false)
        const newData = await response.json()
        const {username, email,  phone_number} = newData
        setFormData({...formData, username, email, phone_number})
        console.log('updated profile', newData)
        toast.success("Profile updated successfully", {
          duration: 7000,
          position: "top-center",
        })
      } else {
        const newData = await response.json()
        setOpenLoad(false)
        setLoading(false)
        toast.error("Failed to update profile", {
          duration: 7000,
          position: "top-center",
        })

        toast.error(newData.error, {
          duration: 7000,
          position: "top-center",
        })
      }
    } catch (error) {
      setOpenLoad(false)
      setLoading(false)
      toast.error("something went wrong please try again", {
        duration: 7000,
        position: "top-center",
      })
    }
  }




  function generateAvatar(name) {
    const avatar = createAvatar(lorelei, {
      seed: name, // Use the customer's name as the seed
      // Customize options for the lorelei style
      backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9'], // Example: random background colors
      radius: 50, // Rounded corners
      size: 64, // Size of the avatar
    });
  
    // Generate the SVG as a data URL
    return `data:image/svg+xml;utf8,${encodeURIComponent(avatar.toString())}`;
  }




const defaultOptions = {
  loop: true,
  autoplay: true, 
  animationData: LoadingAnimation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

  return (

<>
<Toaster />



{loading &&    <Backdrop open={openLoad} sx={{ color:'#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
  
  <Lottie className='relative z-50' options={defaultOptions} height={400} width={400} />
    
     </Backdrop>
  }
      <div className="mx-auto container max-w-2xl md:w-3/4 shadow-md rounded-lg ">
        <div className="bg-gray-100 p-4 border-t-2 bg-opacity-5 border-indigo-400 rounded-t">
          <div className="max-w-sm mx-auto md:w-full md:mx-0">
            <div className="inline-flex items-center space-x-4">
             
<img
                  className="w-12 h-12 rounded-full"
                  src={generateAvatar(currentUsername.toString())}
                  alt={`${currentUsername.toString()}'s avatar`}
                />

              <h1 className="text-gray-600 dark:text-white">{currentUsername}</h1>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-black space-y-6">
        <form onSubmit={updateProfile}>

          <div className="md:inline-flex space-y-4 md:space-y-0 w-full p-4 text-gray-500 dark:text-white items-center">
            <h2 className="md:w-1/3 max-w-sm mx-auto">Account</h2>
            <div className="md:w-2/3 max-w-sm mx-auto">
              <label className="text-sm text-gray-400 dark:text-white">{currentEmail}</label>
              <div className="w-full inline-flex border">
                <div className="pt-2 w-1/12 bg-gray-100 bg-opacity-50">
                  <svg
                    fill="none"
                    className="w-6 text-gray-400 mx-auto"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                name='email'
                value={email}
                onChange={handleChangeFormData}
                  className="w-11/12 focus:outline-none focus:text-gray-600 dark:text-black p-2"
                  placeholder={`${currentEmail}`}
                  // disabled
                />
              </div>
            </div>
          </div>

          <hr />
          <div className="md:inline-flex  space-y-4 md:space-y-0  w-full p-4 text-gray-500
          dark:text-white
          items-center">
            <h2 className="md:w-1/3 mx-auto max-w-sm">Personal info</h2>
            <div className="md:w-2/3 mx-auto max-w-sm space-y-5">
              <div>
                <label className="text-sm text-gray-400 dark:text-white">Full name</label>
                <div className="w-full inline-flex border">
                  <div className="w-1/12 pt-2 bg-gray-100">
                    <svg
                      fill="none"
                      className="w-6 text-gray-400 mx-auto"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    onChange={handleChangeFormData}
                    name='username'
                    value={username}
                    className="w-11/12 focus:outline-none focus:text-gray-600 
                    dark:text-black
                    p-2"
                    placeholder={`${currentUsername}`}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 dark:text-black">Phone number</label>
                <div className="w-full inline-flex border">
                  <div className="pt-2 w-1/12 bg-gray-100">
                    <svg
                      fill="none"
                      className="w-6 text-gray-400 mx-auto"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    onChange={handleChangeFormData}
                    name='phone_number'
                    value={phone_number}
                    className="w-11/12 focus:outline-none focus:text-gray-600 
                    dark:text-black
                    p-2"
                    placeholder="12341234"
                  />
                </div>
              </div>
            </div>
          </div>

          <hr />
          <div className="md:inline-flex w-full space-y-4 md:space-y-0 p-8 text-gray-500
           items-center dark:text-white">
            <h2 className="md:w-4/12 max-w-sm mx-auto">Change password</h2>

            <div className="md:w-5/12 w-full md:pl-9 max-w-sm mx-auto space-y-5 md:inline-flex pl-2">
              <div className="w-full inline-flex border-b">
                <div className="w-1/12 pt-2">
                  <svg
                    fill="none"
                    className="w-6 text-gray-400 mx-auto"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  onChange={handleChangeFormData}
                  name='password'
                  value={password}
                  className="w-11/12 focus:outline-none focus:text-gray-600 dark:text-black p-2 ml-4"
                  placeholder="New"
                />
              </div>
            </div>

            <div className="md:w-3/12 text-center md:pl-6">
              <button type='submit' className="text-white w-full mx-auto max-w-sm rounded-md 
              text-center bg-indigo-600 py-2 px-4 inline-flex items-center 
              focus:outline-none md:float-right">
                <svg
                  fill="none"
                  className="w-4 text-white mr-2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 
                    0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Update
              </button>
            </div>
          </div>


</form>
          <hr />
          <div className="w-full p-4 text-right text-gray-500">
            <button className="inline-flex items-center focus:outline-none mr-4">
              <svg
                fill="none"
                className="w-4 mr-2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete account
            </button>
          </div>
        </div>
      </div>

      </>
  )
}

export default AdminProfile