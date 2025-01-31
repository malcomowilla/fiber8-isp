import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';



// Mock data for passkeys
const initialPasskeys = [
  { id: 1, name: "Passkey 1" },
  { id: 2, name: "Passkey 2" },
  { id: 3, name: "Passkey 3" },
];


// get_passkey_credentials_system_admin

const PasskeyList = () => {
  const [passkeys, setPasskeys] = useState(initialPasskeys);

  // Function to handle deletion of a passkey
  const handleDelete = (id) => {
    setPasskeys((prevPasskeys) => prevPasskeys.filter((passkey) => passkey.id !== id));
  };


const fetchPasskeyLists =  useCallback(
  async() => {

    try {
        const response = await fetch('/api/get_passkey_credentials_system_admin')   
        const newData = await response.json()
        if (response) {
          console.log('fetched passkey credentials', newData)
          const {credentials} = newData
          console.log('credentials', credentials)
          setPasskeys(credentials)
        } else {
            toast.error('failed to fetch passkey credentials', {
                duration: 7000, 
                position: 'top-center',
            })
          console.log('failed to fetch passkey credentials')
        }   
    } catch (error) {
        toast.error('internal server error something went wrong with geting passkey credentials', {
            duration: 7000, 
            position: 'top-center',
        })
    }
    
  },
  [],
)


useEffect(() => {
    fetchPasskeyLists()
   
}, [fetchPasskeyLists]);


  return (

    <>

    <Toaster />
    <div className="passkey-list">
      <h1 className="text-2xl font-bold mb-4">Your Passkeys</h1>
      <ul className="space-y-3">
        <AnimatePresence>
          {passkeys.map((passkey) => (
            <motion.li
              key={passkey.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg"
            >
              <span className="text-lg">{passkey.system_admin?.email}</span>
              <button
                onClick={() => handleDelete(passkey.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>

    </>
  );
};

export default PasskeyList;