
import { AiOutlineDelete } from "react-icons/ai";
import { motion } from "framer-motion"
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import { TiArrowBackOutline } from "react-icons/ti";
import { FiUserX } from 'react-icons/fi';
import {useCallback, useEffect, useState} from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { GoKey } from "react-icons/go";
import DeletePasskey from '../delete/DeletePasskey'



const PasskeyList = () => {
const [passkeys, setPasskeys] = useState([])
const [openDelete, setOpenDelete] = useState(false)
const [loading, setLoading] = useState(false)
const [passkeyId, setPasskeyId] = useState('')



const  handleCloseDelete = () => {
  setOpenDelete(false);
};

const generateAvatar = (name) => {
  const avatar = createAvatar(lorelei, {
    seed: name, // Use the customer's name as the seed
    // Customize options for the lorelei style
    backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9'], // Example: random background colors
    radius: 50, // Rounded corners
    size: 64, // Size of the avatar
  });

  // Generate the SVG as a data URL
  return `data:image/svg+xml;utf8,${encodeURIComponent(avatar.toString())}`;
}


    
const subdomain = window.location.hostname.split('.')[0];
const getPasskeys = useCallback(
  async() => {
    const response = await fetch('/api/get_passkey_credentials', {
        method: 'GET',
        headers: {
          'X-Subdomain': subdomain,
        },
    })
const newData = await response.json()
    try {
        if (response.ok){
            console.log('passkey', newData)
            setPasskeys(newData.credentials)

        }else{
            
        }

    } catch (error) {
        
    }
  },
  [],
)


useEffect(() => {
    getPasskeys()
}, [getPasskeys]);





const deletePassKey = async(id) => {
  setLoading(true)
  const response = await fetch(`/api/delete_passkey?id=${id}`, {
    method: 'DELETE',
    headers: {
      'X-Subdomain': subdomain,
    },
  })



  try {
    if (response.ok) {
      setPasskeys((prev) => prev.filter((cred) => cred.id !== id));
      toast.success('Passkey deleted successfully', {
        position: "top-center",
        duration: 7000,
      })
      setLoading(false)
    } else {
      toast.error('failed to delete passkey', {
        position: "top-center",
        duration: 7000,
      })
      setLoading(false)
    }
    
  } catch (error) {
    toast.error('failed to delete passkey something went wrong', {
      position: "top-center",
      duration: 7000,
    })
    setLoading(false)
  }
 
}





// const deletePassKey = async (id) => {
//   setLoading(true);

//   try {
//     // Signal the unknown credential before deletion
//     if (window.PublicKeyCredential && PublicKeyCredential.signalUnknownCredential) {
//       await PublicKeyCredential.signalUnknownCredential({
//         rpId: window.location.hostname, // Relying Party ID (e.g., "example.com")
//         credentialId: id, // Ensure this is base64url encoded
//       });
//       console.log("Credential signaled for removal:", id);
//     } else {
//       console.warn("signalUnknownCredential is not supported in this browser.");
//     }
//   } catch (error) {
//     console.error("Error signaling unknown credential:", error);
//   }

//   // Proceed with API deletion
//   try {
//     const response = await fetch(`/api/delete_passkey?id=${id}`, {
//       method: "DELETE",
//       headers: {
//         "X-Subdomain": subdomain,
//       },
//     });

//     if (response.ok) {
//       setPasskeys((prev) => prev.filter((cred) => cred.id !== id));
//       toast.success("Passkey deleted successfully", {
//         position: "top-center",
//         duration: 7000,
//       });
//     } else {
//       toast.error("Failed to delete passkey", {
//         position: "top-center",
//         duration: 7000,
//       });
//     }
//   } catch (error) {
//     toast.error("Failed to delete passkey. Something went wrong.", {
//       position: "top-center",
//       duration: 7000,
//     });
//   } finally {
//     setLoading(false);
//   }
// };

return(

  <>
  <Toaster />

<DeletePasskey  openDelete={openDelete} handleCloseDelete={handleCloseDelete}
 deletePasskey={deletePassKey} id={passkeyId} loading={loading} 
 
 
 />


  <div className='flex flex-row gap-x-3 p-3'>

<p className='font-montserrat text-xl dark:text-white '>

  Your Passkeys
</p>

  </div>
<div className="space-y-4 p-4 cursor-pointer" >
      {passkeys.map((passkey) => (
        
        <motion.ul
        
          key={passkey.id}
          className="bg-white shadow-md flex justify-between rounded-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <li className="pb-3 sm:pb-4">
            <div className="flex items-center p-4">
              <div className="flex-shrink-0">
                {/* <img
                  className="w-12 h-12 rounded-full"
                  src={generateAvatar(passkey.id)}
                  alt={`${passkey.id}'s avatar`}
                /> */}

                <GoKey  className="w-8 h-8 dark:text-black " />
              </div>
              <div className="flex-1 min-w-0 ml-4">
                <p className="text-lg font-semibold text-gray-900 truncate">
                  {passkey.id}
                </p>
                {/* <p className="text-sm text-gray-500 truncate">
                  {customer.customer.email}
                </p> */}
              </div>
            </div>
          </li>
          

          {/* onClick={() => deletePassKey(passkey.id)} */}
          <div className='flex flex-row gap-x-3 p-3'>

          <AiOutlineDelete className='text-red-600 text-2xl ' onClick={() =>   {
            setPasskeyId(passkey.id)
            setOpenDelete(true)
          } }/>

          </div>
        </motion.ul>
      ))} 
    </div>
    </>
    
)

}

export default PasskeyList