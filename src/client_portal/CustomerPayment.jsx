import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from 'react';
import { Button, Label, TextInput } from "flowbite-react";
import { FaHandPointLeft } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { MdPayments } from "react-icons/md";
import Lottie from 'react-lottie';
// import LoadingAnimation from '../animation/loading_animation.json'
import Backdrop from '@mui/material/Backdrop';
import toast, { Toaster } from 'react-hot-toast';
import { useApplicationSettings } from '../settings/ApplicationSettings';



const CustomerPayment = () => {
  const [activeTab, setActiveTab] = useState('instant');
  const [loading, setLoading] = useState(false);
  const [openLoad, setopenLoad] = useState(false)
  const [mpesaPayment, setMpesaPayment] = useState({
    phone_number: '',
    amount: '',
  });
  const navigate = useNavigate();



  const { customerProfileData, handleCustomerLogout,
     setCustomerProfileData,setCurrentCustomer } = useApplicationSettings();



  const   {amount,phone_number } = mpesaPayment 
  const [shortCode, setShortCode] = useState('');

  const onChangeMpesaPayment = (e) => {
    const { name, value } = e.target;
    setMpesaPayment({ ...mpesaPayment, [name]: value });
  };

  const handleGoBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };



  const makePayment = async (e) => {
    try {
      setopenLoad(true)
      setLoading(true)
      e.preventDefault()
      const response = await fetch('/api/customer_wallet_payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mpesaPayment)
      })
      const newData = await response.json()

      if (response.ok) {
        setLoading(false)
        toast.success(newData.message, {
          duration: 8000,
          position: "top-center",
        })
        setopenLoad(false)
        
      }else{
        setLoading(false)
        setopenLoad(false)
        toast.error(newData.error, {
          duration: 8000,
          position: "top-center",
        })

      }
    } catch (error) {
      toast.error('Something went wrong!', {
        duration: 8000,
        position: "top-center",
      })
      setLoading(false)
      setopenLoad(false)
    }
  } 

  const paymentMethods = [
    {
      name: 'Safaricom Mpesa',
      image: '/images/mpesa-logo2.png',
      alt: 'mpesa'
    },
    // {
    //   name: 'Airtel Money',
    //   image: '/images/Airtel.jpg',
    //   alt: 'airtel'
    // }
  ];

  const mpesaInstructions = [
    { text: 'Go To', bold: 'Mpesa Menu' },
    { text: 'Select', bold: 'Lipa na M-PESA' },
    { text: 'Select Paybill' },
    { text: 'Enter', bold: shortCode, suffix: 'As Business Number' },
    { text: 'Enter', bold: customerProfileData?.ppoe_username, suffix: 'As Account Number' },
    { text: 'Enter Amount In Kenyan Shilling' },
    { text: 'Enter Mpesa Pin' },
    { text: 'You will receive notification from M-PESA with a confirmation code' }
  ];



// const defaultOptions = {
//   loop: true,
//   autoplay: true, 
//   animationData: LoadingAnimation,
//   rendererSettings: {
//     preserveAspectRatio: 'xMidYMid slice'
//   }
// };







const subdomain = window.location.hostname.split('.')[0];

const fetchCurrentCustomer = useCallback(
  async() => {
    try {
      const response = await fetch('/api/current_customer', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
      const newData = await response.json()
      if (response) {
        console.log('fetched current user', newData)
        // const {user_name, email, id, created_at, updated_at, phone_number} = newData
        setCurrentCustomer(newData)
        setCustomerProfileData(newData)
        console.log('current customer', newData)
      }
    } catch (error) {
      console.log(error)
    }
  },
  [],
)



useEffect(() => {
  fetchCurrentCustomer()
}, [fetchCurrentCustomer]);









const fetchHotspotMpesaSettings = useCallback(async () => {
  try {
    const response = await fetch(`/api/get_mpesa_settings?account_type=Paybill`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain,
      },
    });

    const newData = await response.json();

    if (response.ok) {
      
      if (
        !newData || // Handles null or undefined
        newData.length === 0 || // Handles empty array
        !newData.account_type // Handles missing or null provider
      ) {
        console.log('No SMS settings found, resetting form.');
      
     
        setShortCode(newData.short_code)
      
        // setSelectedProvider('');
      } else {
        console.log('Fetched hotspot mpesa settings:', newData);
      
        const { consumer_key, consumer_secret, passkey, short_code } = newData;
      

        // setHotspotMpesaSettings(prevData => ({
        //   ...prevData, 
        //   consumer_key, consumer_secret, passkey, short_code
        // }));
      }
    } else {
      // toast.error(newData.error || 'Failed to fetch SMS settings', {
      //   duration: 3000,
      //   position: 'top-center',
      // });
    }
  } catch (error) {
    // toast.error('Internal server error: Something went wrong with fetching SMS settings', {
    //   duration: 3000,
    //   position: 'top-center',
    // });
  }
}, []);


useEffect(() => {
    fetchHotspotMpesaSettings();
  
}, [fetchHotspotMpesaSettings]);





  return (
<>

<Toaster />
{/* {loading &&    <Backdrop open={openLoad} sx={{ color:'#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
  
  <Lottie className='relative z-50' options={defaultOptions} height={400} width={400} />
    
     </Backdrop>
  } */}

    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8
      flex justify-center items-center"
    >
      <div className="max-w-6xl mx-auto flex flex-wrap lg:flex-nowrap gap-8">
        {/* Payment Methods Card */}
        <motion.div 
          className="hidden lg:block w-[330px] bg-white rounded-2xl shadow-lg p-6 h-fit"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-2 playwrite-de-grund">Add To Wallet</h2>
          {/* <p className="text-gray-600 mb-6 playwrite-de-grund">Select Your Preferred Payment Method</p> */}

          <div className="space-y-4">
            {paymentMethods.map((method, index) => (
              <motion.div
                key={method.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-xl border border-gray-200 hover:bg-gray-50
                 cursor-pointer 
                  transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <img 
                    src={method.image} 
                    className="w-20 h-16 object-contain rounded-lg" 
                    alt={method.alt} 
                  />
                  <p className="text-gray-800 font-medium playwrite-de-grund">{method.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Payment Card */}
        <motion.div 
          className="flex-1 bg-white rounded-2xl shadow-lg p-6 md:p-8"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <MdPayments className="text-3xl text-green-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 playwrite-de-grund">Mpesa Payment Services</h2>
              <p className="text-gray-600 playwrite-de-grund">Follow Instructions To Top Up Your Account</p>
            </div>
          </div>

          {/* Payment Tabs */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-8">
            {[
              { id: 'instant', label: 'TopUp Instantly' },
              { id: 'instructions', label: 'Paybill/Till Instructions' }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-4 rounded-md playwrite-de-grund transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'instant' ? (
              <motion.form
                onSubmit={makePayment}
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <Label htmlFor="amount" className="text-gray-700 playwrite-de-grund">Amount</Label>
                  <TextInput 
                    name='amount'
                    value={amount}
                    onChange={onChangeMpesaPayment}
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    className="mt-1"
                    style={{
                      backgroundColor: 'transparent',
                      borderRadius: '0.5rem',
                      padding: '0.5rem',
                      color: 'black'
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="phone_number" className="text-gray-700 playwrite-de-grund">Phone Number</Label>
                  <TextInput 
                    id="phone_number"
                    onChange={onChangeMpesaPayment}
                    value={customerProfileData?.phone_number}
                    name='phone_number'
                    type="tel"
                    style={{
                      backgroundColor: 'transparent',
                      borderRadius: '0.5rem',
                      padding: '0.5rem',
                      color: 'black'
                    }}
                    placeholder="Enter phone number"
                    className="mt-1"
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Top Up Now'}
                </Button>
              </motion.form>
            ) : (
              <motion.div
                key="instructions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                {mpesaInstructions.map((instruction, index) => (
                  <motion.p 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-gray-700 playwrite-de-grund"
                  >
                    {instruction.text}{' '}
                    {instruction.bold && <span className="font-bold">{instruction.bold}</span>}{' '}
                    {instruction.suffix}
                  </motion.p>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back Button */}
          <motion.button
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mt-8"
          >
            <FaHandPointLeft className="text-xl" />
            <span className="playwrite-de-grund">Go Back</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>

    </>
  );
};

export default CustomerPayment;






















