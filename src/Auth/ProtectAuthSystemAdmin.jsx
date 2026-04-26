
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Lottie from 'react-lottie';
import Backdrop from '@mui/material/Backdrop';
import LoadingAnimation from '../loader/loading_animation.json'
import {useApplicationSettings} from '../settings/ApplicationSettings'
import {RefreshCw} from 'lucide-react';



const ProtectAuthSystemAdmin = () => {



  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };



  const { 
    currentSystemAdmin, fetchCurrentSystemAdmin,} = useApplicationSettings();
  const [loading, setLoading] = useState(true);
  const [openLoad, setopenLoad] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      await fetchCurrentSystemAdmin();
      setLoading(false);
      setopenLoad(false)
    };

    loadUser();
  }, [fetchCurrentSystemAdmin]);


  if (loading) {
    return <>
      <Backdrop open={openLoad} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>

  <RefreshCw className='animate-spin text-blue-500 w-12 h-12 mx-auto ' />

      </Backdrop>
    
     </>
  }
  const isAuthenticated = currentSystemAdmin && currentSystemAdmin.id; // Check if currentUser has an ID or any other property that indicates authentication

  if (isAuthenticated) {
    return <Outlet />;
  } else {
    return <Navigate to="/system-admin-login" replace={true} />;
  }
};

export default ProtectAuthSystemAdmin;
