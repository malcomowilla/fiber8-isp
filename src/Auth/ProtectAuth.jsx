

import { useContext, useEffect, useState} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'
import { Navigate, Outlet } from "react-router-dom";

import {useApplicationSettings} from '../settings/ApplicationSettings'

import animationData from '../lotties/loading_gray.json';

import Lottie from 'react-lottie';
import Backdrop from '@mui/material/Backdrop';
import {RefreshCw} from 'lucide-react';







const ProtectAuth = ({children}) => {



  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
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
  <Backdrop
        sx={{ color: 'red', zIndex: (theme) => theme.zIndex.drawer + 20 }}
        open={open}
      >
       <RefreshCw className='animate-spin text-blue-500 w-12 h-12 mx-auto ' />
      </Backdrop>    
     </>
  }
  if (isAuthenticated) {
    return <Outlet />;
  } else {
    return <Navigate to="/signin" replace={true} />;
  }
}

export default ProtectAuth
