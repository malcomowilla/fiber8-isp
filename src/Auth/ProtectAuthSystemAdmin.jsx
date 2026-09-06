
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
      <AuthLoader />
    
     </>
  }
  const isAuthenticated = currentSystemAdmin && currentSystemAdmin.id; 

  if (isAuthenticated) {
    return <Outlet />;
  } else {
    return <Navigate to="/system-admin-login" replace={true} />;
  }
};






const AuthLoader = () => {
  return (
    <div className="fixed inset-0 z-[1400] flex items-center justify-center bg-white/80 
    backdrop-blur-sm dark:bg-slate-950/80 font-sans
">
      <div className="flex flex-col items-center gap-6 px-6 text-center">

        {/* Animated mark */}
        <div className="relative h-20 w-20 sm:h-24 sm:w-24">
          {/* outer pulse ring */}
          <span className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
          {/* mid ring, spinning */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800" />
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent
             border-t-green-500 border-r-green-500 animate-spin"
            style={{ animationDuration: '0.9s' }}
          />
          {/* inner dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>

        {/* Status text */}
        <div className="space-y-1">
          <p className="text-xl font-semibold tracking-wide text-slate-700
           dark:text-slate-200">
            Verifying your session
          </p>
          <p className="text-lg text-slate-400 dark:text-slate-500">
            Hang tight, this only takes a moment…
          </p>
        </div>

        {/* progress bar */}
        <div className="h-1 w-40 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full w-1/3 animate-[loaderBar_1.2s_ease-in-out_infinite] 
          rounded-full bg-green-500" />
        </div>
      </div>

      <style>{`
        @keyframes loaderBar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(60%); }
          100% { transform: translateX(220%); }
        }
      `}</style>
    </div>
  );
};

export default ProtectAuthSystemAdmin;
