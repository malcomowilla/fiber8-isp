import { useContext, useEffect, useState} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'
import { Navigate } from "react-router-dom";
import LoadingAnimation from '../loader/loading_animation.json'
import Lottie from 'react-lottie';
import {useApplicationSettings} from '../settings/ApplicationSettings'

import Backdrop from '@mui/material/Backdrop';




const PrivateRoutes = ({children}) => {



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
     
    const isAuthenticated = currentUser  && currentUser.id

  if (loading) {
    return <>
        <Lottie className='relative z-50' options={defaultOptions} height={400} width={400} />
    
     </>
  }
    if (isAuthenticated) {
        return children
    }
  return <Navigate to='/signin' replace={true}/>
}

export default PrivateRoutes
