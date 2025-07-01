


import { useContext, useEffect, useState} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'
import { Navigate, Outlet } from "react-router-dom";

import {useApplicationSettings} from '../settings/ApplicationSettings'


import LoadingAnimation from '../loader/loading_animation.json'
import Lottie from 'react-lottie';
import Backdrop from '@mui/material/Backdrop';






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
        <Lottie className='relative z-50' options={defaultOptions} height={400} width={400} />
    
     </>
  }
  if (isAuthenticated) {
    return <Outlet />;
  } else {
    return <Navigate to="/client-login" replace={true} />;
  }
}

export default ProtectAuthClient
