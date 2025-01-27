// import { ApplicationContext } from '../context/ApplicationContext';
// import { useContext, useEffect } from 'react';
// import { Navigate , useNavigate} from 'react-router-dom';
// const ProtectAuth = ({ children }) => {
//   const { user, setCurrentUser } = useContext(ApplicationContext);


// // const navigate = useNavigate()
// //   useEffect(() => {
// //     const authenticated = document.cookie.includes("authenticated=true");

// //     if (authenticated) {
// // setCurrentUser(user)
// //     } else {
// //       setCurrentUser(null);
// //     }

// //   }, []);



//   if (user === undefined) {
//     return null;
//   }

//   if (!user) {

//     return <Navigate to='layout/admin-dashboard' replace={true} />;
//   }

//   return children;
// };

// export default ProtectAuth;


import { useContext, useEffect, useState} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'
import { Navigate, Outlet } from "react-router-dom";
import LoadingAnimation from '../loader/loading_animation.json'
import Lottie from 'react-lottie';
import {useApplicationSettings} from '../settings/ApplicationSettings'

import Backdrop from '@mui/material/Backdrop';




const ProtectAuth = ({children}) => {



  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };


  const {  currentUser, fetchCurrentUser} = useApplicationSettings();
  const [loading, setLoading] = useState(true);





  useEffect(() => {
    const loadUser = async () => {
      await fetchCurrentUser();
      setLoading(false);
    };

    loadUser();
  }, [fetchCurrentUser]);



    const {   user
    } = useContext(ApplicationContext);
     
    const isAuthenticated = currentUser && currentUser.id;

  if (loading) {
    return <>
        <Lottie className='relative z-50' options={defaultOptions} height={400} width={400} />
    
     </>
  }
  if (isAuthenticated) {
    return <Outlet />;
  } else {
    return <Navigate to="/signin" replace={true} />;
  }
}

export default ProtectAuth
