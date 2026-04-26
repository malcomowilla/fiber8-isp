
import { useContext, useEffect, useState} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'
import { Navigate, Outlet } from "react-router-dom";

import {useApplicationSettings} from '../settings/ApplicationSettings'


import LoadingAnimation from '../loader/loading_animation.json'
import Lottie from 'react-lottie';
import {RefreshCw} from 'lucide-react';





const ProtectAuthClient = ({children}) => {



  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };


  const {  currentCustomer, setCurrentCustomer, fetchCurrentCustomer} = useApplicationSettings();
  const [loading, setLoading] = useState(true);





  useEffect(() => {
    const loadUser = async () => {
      await fetchCurrentCustomer();
      setLoading(false);
    };

    loadUser();
  }, [fetchCurrentCustomer]);



    const {   user
    } = useContext(ApplicationContext);
     
    const isAuthenticated = currentCustomer && currentCustomer.id;

  if (loading) {
    return <>
              <RefreshCw className='animate-spin text-blue-500 w-12 h-12 mx-auto ' />

    
     </>
  }
  if (isAuthenticated) {
    return <Outlet />;
  } else {
    return <Navigate to="/client-login" replace={true} />;
  }
}

export default ProtectAuthClient
