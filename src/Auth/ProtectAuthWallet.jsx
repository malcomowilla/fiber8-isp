

import { useContext, useEffect, useState} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'
import { Navigate, Outlet } from "react-router-dom";

import {useApplicationSettings} from '../settings/ApplicationSettings'

import animationData from '../lotties/loading_gray.json';

import Lottie from 'react-lottie';
import Backdrop from '@mui/material/Backdrop';
import {RefreshCw} from 'lucide-react';







const ProtectAuthWallet = ({children}) => {



  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };


  const {  currentAdminWallet, fetchAdminWallet} = useApplicationSettings();
  const [loading, setLoading] = useState(true);





  useEffect(() => {
    const loadUser = async () => {
      await fetchAdminWallet();
      setLoading(false);
    };

    loadUser();
  }, [fetchAdminWallet]);



    const {   user
    } = useContext(ApplicationContext);
     
    const isAuthenticated = currentAdminWallet && currentAdminWallet.id;



  if (loading) {
      return <AuthLoader />;
    }
  
    if (!isAuthenticated) {
      return <Navigate to="/admin-wallet-login" replace />;
    }
  
   
    return <Outlet />;
  }












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
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 border-r-indigo-500 animate-spin"
            style={{ animationDuration: '0.9s' }}
          />
          {/* inner dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse" />
          </div>
        </div>

        {/* Status text */}
        <div className="space-y-1">
          <p className="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-200">
            Verifying your session
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Hang tight, this only takes a moment…
          </p>
        </div>

        {/* progress bar */}
        <div className="h-1 w-40 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full w-1/3 animate-[loaderBar_1.2s_ease-in-out_infinite] rounded-full bg-indigo-500" />
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



export default ProtectAuthWallet

