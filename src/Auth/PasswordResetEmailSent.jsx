
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import { useApplicationSettings } from '../settings/ApplicationSettings';
import {useNavigate} from 'react-router-dom'



const PasswordResetEmailSent = () => {
  const { companySettings } = useApplicationSettings();
  const { company_name, logo_preview } = companySettings;
const navigate = useNavigate()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-white 
        dark:from-gray-900 dark:to-gray-800 flex items-center
         justify-center px-4"
    >
      <motion.div
        variants={itemVariants}
        className="max-w-md w-full bg-white/80 dark:bg-gray-800/80 
        backdrop-blur-xl 
          rounded-2xl shadow-xl p-8 space-y-6"
      >
        {/* Logo and Company Name */}
        <motion.div 
          className="flex flex-col items-center"
          variants={itemVariants}
        >
          <img
  className="mx-auto h-20 w-20 rounded-full shadow-lg ring-4
               ring-emerald-50"
  src={logo_preview || "/images/aitechs.png"}
  alt={company_name || "Aitechs"}
  onError={(e) => { e.target.src = "/images/aitechs.png"; }}
/>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            {company_name}
          </h1>
        </motion.div>

        {/* Email Icon */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center"
        >
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full 
            flex items-center justify-center">
            <EmailIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          variants={itemVariants}
          className="text-center space-y-4"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Check Your Email
          </h2>
          <p className="text-black dark:text-white text-xl">
            We've sent password reset instructions to your email address. 
            Please check your inbox and follow the link to reset your password.
          </p>
          <p className="text-lg text-black dark:text-white ">
            If you don't see the email, check your spam folder.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="space-y-4 pt-4"
        >
          <Link to="/signin">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-emerald-600 text-white font-medium 
                rounded-xl shadow-lg hover:bg-emerald-700 
                hover:shadow-emerald-500/25 transition-all duration-200"
            >
              
              <span className='text-white
               font-bol text-lg'>Return to Sign In</span>
            </motion.button>
          </Link>

          <motion.button
          onClick={() => navigate('/reset-password')} 
           whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 
              text-gray-700 dark:text-gray-200 font-medium rounded-xl 
              hover:bg-gray-200 
               dark:hover:bg-gray-600 transition-all 
              duration-200"
          >
        <span className='text-black font-bold text-lg'>Resend Email</span>

          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PasswordResetEmailSent;
