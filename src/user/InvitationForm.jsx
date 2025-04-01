
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { useState, useEffect, useCallback } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { Accordion } from "flowbite-react";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { CiSettings } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import { IoStorefrontOutline } from "react-icons/io5";
import { LiaSearchLocationSolid } from "react-icons/lia";
import { GrUserManager } from "react-icons/gr";
import { GoPeople } from "react-icons/go";
import { CiUser } from "react-icons/ci";
import { TfiWallet } from "react-icons/tfi";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { CiReceipt } from "react-icons/ci";
import { BsCalendar2Date } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import Lottie from 'react-lottie';
import LoadingAnimation from '../loader/loading_animation.json'
import Backdrop from '@mui/material/Backdrop';
import { MdOutlineTextsms } from "react-icons/md";
import { CgTemplate } from "react-icons/cg";
import { PiTicketLight } from "react-icons/pi";
// import { useLayoutSettings } from '../settings/LayoutSettings';
import { MdOutlineMail } from "react-icons/md";
import { TfiStatsUp } from "react-icons/tfi";
import { MdOutlineChat } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import {useApplicationSettings} from '../settings/ApplicationSettings'
import { GrUserSettings } from "react-icons/gr";
import { RiMailSettingsLine } from "react-icons/ri";
import { RiChatSettingsLine } from "react-icons/ri";
import { TbFileSettings } from "react-icons/tb";
import { GiSettingsKnobs } from "react-icons/gi";
import { RiUserSettingsFill } from "react-icons/ri";
import { LuSettings2 } from "react-icons/lu";
import { BsRouter } from "react-icons/bs";
import { FcPackage } from "react-icons/fc";
import { PiNetwork } from "react-icons/pi";
import { TbRouter } from "react-icons/tb";
import { FaUsers } from "react-icons/fa";
import { LuLayoutTemplate } from "react-icons/lu";

















const InvitationForm = ({ isOpen, setIsOpen,permissionAndRoles, 
  setPermissionAndRoles, userDetails,
  setuserDetails,
  loading,openLoad,userPermisions,
  setUserPermisions, emailError, seeEmailError,
  emailError2, seeEmailError2,seeUsernameError2,usernameError2,
  
  seeUsernameError,  usernameError, 
  seeStrictEmailError,strictEmailError,
  inviteUser
 }) => {

const handleAddUser = (e) => {
e.preventDefault()
}

//   const { settings, borderRadiusClasses } = useLayoutSettings();

const {bottomNavigation, setBottomNavigation} = useApplicationSettings()

const [seeItem, setSeeItem] = useState({
  package: false,
  hotspotPackage: false,
  subscriber: false,
  smsSettings: false,
  ticketSettings: false,
  emailSettings: false,
  subscriberSettings: false,
  router: false,
  routerSettings: false,
  companySettings: false,
  user: false,
  sms: false,
  userSettings: false,
  pool: false,
  subscription: false,
  tickets: false,
  freeRadius: false,
  mpesaSettings: false,
  rebootRouter: false,
  userGroup: false,
  hotspotTemplate: false,
  hotspotVoucher: false,
  
  
  
})



const handleSeeItem = (key)=>{
  setSeeItem((prevData)=> ({...prevData, [key]: !prevData[key]}))
}



const convertToKenyanFormat = (number) => {
  if (number.startsWith('0')) {
    return '+254' + number.substring(1)
  }


 
  return number;
};







  const handleUserDetailsPhoneNumber = (e)=> {
    const {name, value} = e.target 
   const  kenyanNumber = convertToKenyanFormat(value) 
    setUserPermisions((prevData) => (
     {...prevData, [name]: kenyanNumber}
    ))
   }






const handleUserDetailsFormDataChange = (e)=> {
 const {name, value} = e.target  
 setUserPermisions((prevData) => (
  {...prevData, [name]: value}
 ))
}


const handleUserRoleFormDataChange = (role,  event)=> {
  const { name } = event.target;
  setPermissionAndRoles((prevData)=> {
    const newPermission = {...prevData}
    if (name === 'read') {
      newPermission[role].read = !newPermission[role].read;
      if (newPermission[role].read) {
        newPermission[role].readWrite = false
      }

      
    
    } else if (name === 'readWrite') {
      newPermission[role].readWrite = !newPermission[role].readWrite

      if (newPermission[role].readWrite ) {
        newPermission[role].read = false 
      }
      
    }
    return newPermission
  })

console.log('hotspot package read ', permissionAndRoles.hotspotPackage
)
  setUserPermisions((prevData) => ({
    ...prevData,
    can_manage_subscriber: permissionAndRoles.subscriber.readWrite,
    can_read_read_subscriber: permissionAndRoles.subscriber.read,
    can_manage_ticket_settings: permissionAndRoles.ticketSettings.readWrite,
    can_read_ticket_settings: permissionAndRoles.ticketSettings.read,
    can_read_ppoe_package: permissionAndRoles.package.read,
    can_manage_ppoe_package: permissionAndRoles.package.readWrite,
    can_manage_company_setting: permissionAndRoles.companySettings.readWrite,
    can_read_company_setting: permissionAndRoles.companySettings.read,
    can_manage_email_setting: permissionAndRoles.emailSettings.readWrite,
    can_read_email_setting: permissionAndRoles.emailSettings.read,
    can_manage_hotspot_packages: permissionAndRoles.hotspotPackage.readWrite,
    
    
    can_read_hotspot_packages: permissionAndRoles.hotspotPackage.read,
   
    can_manage_ip_pool: permissionAndRoles?.pool?.readWrite,
    can_read_ip_pool: permissionAndRoles?.pool?.read,
    can_manage_nas_routers: permissionAndRoles?.router?.readWrite,
    can_read_nas_routers: permissionAndRoles?.router?.read,
    can_manage_router_setting: permissionAndRoles?.routerSettings?.readWrite,
    can_read_router_setting: permissionAndRoles?.routerSettings?.read,
    can_manage_sms: permissionAndRoles.sms.readWrite,
    can_read_sms: permissionAndRoles.sms.read,
    can_manage_sms_settings: permissionAndRoles.smsSettings.readWrite,
    can_read_sms_settings: permissionAndRoles.smsSettings.read,
    can_manage_subscriber_setting: permissionAndRoles.subscriberSettings.readWrite,
    can_read_subscriber_setting: permissionAndRoles.subscriberSettings.read,
    can_manage_subscription: permissionAndRoles.subscription.readWrite,
    can_read_subscription: permissionAndRoles.subscription.read,
    can_manage_support_tickets: permissionAndRoles.tickets.readWrite,
    can_read_support_tickets: permissionAndRoles.tickets.read,
    can_manage_users: permissionAndRoles.user.readWrite,
    can_read_users: permissionAndRoles.user.read,

    can_manage_user_setting: permissionAndRoles.userSettings.readWrite,
    can_read_user_setting: permissionAndRoles.userSettings.read,
    can_manage_free_radius: permissionAndRoles.freeRadius.readWrite,
    can_read_free_radius: permissionAndRoles.freeRadius.read,
    can_manage_mpesa_settings: permissionAndRoles.mpesaSettings.readWrite,
    can_read_mpesa_settings: permissionAndRoles.mpesaSettings.read,
    can_reboot_router: permissionAndRoles.rebootRouter.readWrite,
    can_manage_user_group: permissionAndRoles.userGroup.readWrite,
    can_read_user_group: permissionAndRoles.userGroup.read,
    can_manage_hotspot_template: permissionAndRoles.hotspotTemplate.readWrite,
    can_read_hotspot_template: permissionAndRoles.hotspotTemplate.read,
    can_read_hotspot_voucher: permissionAndRoles.hotspotVoucher.read,
    can_manage_hotspot_voucher: permissionAndRoles.hotspotVoucher.readWrite,

   
  


  }));
}


const variantDiv = {
    hidden: {
      opacity: 0,
      overflow: 'hidden',
      height: 0,
      padding: 1,
      
    },
  
    visible: {
      opacity: 1,
      overflow: 'hidden',
      height: 'auto',
      padding: 10
    }
  }


  const subdomain = window.location.hostname.split('.')[0]
const [userRoles, setUserRoles] = useState([])

  const getUserGroups = useCallback(
    async() => {
      try {
        const response = await fetch('/api/user_groups', {
          headers: {
            'X-Subdomain': subdomain,
          },
        })
  
        const newData = await response.json()
        if (response.ok) {
          // setUserGroups(newData)
          setUserRoles(newData)
         
        } else {
          console.error(newData)
        }
      } catch (error) {
        console.log(error)
      }
    },
    [],
  )
  
  
  useEffect(() => {
    getUserGroups()
    
  }, [getUserGroups]);

  // const userRoles = [
  //   { label: 'customer_support',  },
  //   { label: 'administrator',},
  //   { label: 'super_administrator',},
  //   { label: "technician",  },
  //   { label: "agent",  },

    
  //   ]





  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: LoadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };


  return (
    <>
    
    {loading &&    <Backdrop open={openLoad} sx={{ color:'#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
  
  <Lottie className='relative z-50' options={defaultOptions} height={400} width={400} />
    
     </Backdrop>
  }
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center  overflow-y-scroll
           cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            className={`bg-white text-black rounded-lg   p-6 w-full 
            max-w-[600px]
             shadow-xl cursor-default relative `}
          >
            <FiAlertCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
            <div className="relative z-10">
              
              <h3 className="text-3xl font-montserat font-bold text-center mb-2 ">
                Invite Users
              </h3>
<form onSubmit={inviteUser}>
             
<div className='group w-full'>
<label className='relative' htmlFor="">
    
<input
  onChange={(e) => handleUserDetailsFormDataChange(e)}
  type="text"
  name="username"
  value={userPermisions.username}
  className=" w-full rounded-lg border-2 border-black border-opacity-50
  focus:border-teal-600 myTextField transition duration-300
  outline-none h-[58px] overflow-visible text-black"
/>
<span className='text-opacity-80
absolute top-[-5px] transition-all duration-300
 left-0 px-3 py-2 text-sm text-black input-text
'>Your Name </span>
</label>
  <p className='text-red-800 playwrite-de-grund'>{seeUsernameError && usernameError}</p>
  <p className='text-red-800 playwrite-de-grund'>{seeUsernameError2 && usernameError2}</p>
</div>





              <div className='flex justify-around p-2 mt-8'>

<div className='flex flex-col gap-2 relative'>
<label htmlFor="">
<input
name='phone_number'
onChange={(e) =>handleUserDetailsPhoneNumber(e)}
  type="text"
  value={userPermisions.phone_number}
  className=" w-full rounded-lg border-2 border-black border-opacity-50
  focus:border-teal-600 myTextField transition duration-300
  outline-none h-[58px]   text-black" />

<span className='text-opacity-80
absolute top-[-5px] transition-all duration-300
 left-0 px-3 py-2 text-sm text-black input-text2
'>Your Phone </span>
  </label>
</div>


<div className='flex flex-col gap-2 relative mt-8'>
  
<label htmlFor="">

<input
onChange={(e) =>handleUserDetailsFormDataChange(e)}
name='email'
value={userPermisions.email}
  type="text"

  className=" w-full rounded-lg border-2 border-black border-opacity-50
  focus:border-teal-600 myTextField transition duration-300
  outline-none h-[58px]   text-black" />


<span className='text-opacity-80
absolute top-[-5px] transition-all duration-300
 left-0 px-3 py-2 text-sm text-black input-text2
'>Email </span>
   
  </label>


  <p className='text-red-800 playwrite-de-grund'>{seeEmailError && emailError} </p>
<p className='text-red-800 playwrite-de-grund'>{seeEmailError2 && emailError2}</p>

<p className='text-red-800 playwrite-de-grund'>{seeStrictEmailError && strictEmailError}</p>
</div>
              </div>



              <div className='p-4 '>
             
<Autocomplete

// value={userPermisions.user_role}

value={userRoles.find((permission) => {
  if (permission.name === userPermisions.role) {
   return permission.name
  } else {
    return null
  }
})}


// value={Array.isArray(userRoles) ? userRoles.find((permission) => {
//   return permission.name === userPermisions.role;
// }) || null : null}  //

getOptionLabel={(option) => option.name}
                      
                      sx={{
                        m: 1,width: {
                          xs: '40%',
                          sm: '80%',
                          md: '50%',
                          lg: '70%',
                          xl: '70%',

              
              
              
                      },
                        '& label.Mui-focused': {
                          color: 'black',
                          fontSize:'16px'
                          },
                        '& .MuiOutlinedInput-root': {
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "black",
                          borderWidth: '3px'
                          },
                        '&.Mui-focused fieldset':  {
                          borderColor: 'black', // Set border color to transparent when focused
                        
                        }
                        },
                                 
                                }} 
                    
                                
                                      // getOptionLabel={'4MBPS'}
                    
                            options={userRoles}
                            
                                    renderInput={(params) => (
                                      <TextField
                                      id="user_group"
                    
                                      className='myTextField'
                                        {...params}
                                        label="Select User Roles"
                                      
                    
                                       
                                      />
                                    )}
                                  
                                
                                    
                                    onChange={(event, newValue) => {
                                      console.log('Before Update:', userPermisions.role);
                                      setUserPermisions((prevData) => {
                                        const updatedData = {
                                          ...prevData,
                                          role: newValue ? newValue.name : '', 
                                        };
                                        console.log('After Update:', updatedData.role);
                                        return updatedData;
                                      });
                                    }}
                                  />
              </div>
             
            

 <div className='p-8'>


            <div className='flex justify-around font-bold text-lg p-2'>
            <p >Item</p>
            <p>Permisions</p>
            </div>
   
   

{Object.keys(seeItem).map((role, index)=> (
  <>
  {console.log('role', permissionAndRoles)}
<div key={index}>



<h2  id={`accordion-open-heading-${index}`} onClick={()=> handleSeeItem(role)}>


<button type="button"    className="flex items-center justify-between 
w-full p-5 font-medium rtl:text-right
  border border-b-0 border-gray-200 rounded-t-xl 
  text-black 
  focus:ring-4 focus:ring-gray-200
  dark:focus:ring-gray-800 
  dark:border-gray-700 dark:text-gray-900 hover:dark:text-white hover:text-black hover:bg-gray-100
   dark:hover:bg-gray-800 gap-3"
   data-accordion-target={`#accordion-open-body-${index}`}
   aria-expanded="true"
   aria-controls={`accordion-open-body-${index}`}
   >
  <span className="flex items-center gap-3">    
                        {role === 'userSettings' && <GrUserSettings className='w-5 h-5'/>}
                          {role === 'sms' && <MdOutlineTextsms className='w-5 h-5'/>}
                          {role === 'tickets' && <PiTicketLight className='w-5 h-5' />}
                          {role === 'user' && <FaUserFriends className='w-5 h-5'/>}
                          {role === 'emailSettings' && <RiMailSettingsLine className='w-5 h-5'/>}
                          {role === 'smsSettings' && <  RiChatSettingsLine className='w-5 h-5'/>}
                          {role === 'ticketSettings' && <TbFileSettings className='w-5 h-5' />}
                          {role === 'routerSettings' && <GiSettingsKnobs className='w-5 h-5' />}
                          {role === 'subscriberSettings' && <RiUserSettingsFill className='w-5 h-5' />}
                          {role === 'companySettings' && <RiUserSettingsFill className='w-5 h-5' />}
                          {role === 'pool' && <LuSettings2 className='w-5 h-5' />}
                          {role === 'router' && <BsRouter className='w-5 h-5' />}
                          {role === 'subscriber' && <GoPeople className='w-5 h-5' />}
                          {role === 'package' && <FcPackage className='w-5 h-5' />}
                          {role === 'hotspotPackage' && <FcPackage className='w-5 h-5' />}
                          {role === 'subscription' && <PiNetwork className='w-5 h-5' />}
                          {role === 'freeRadius' && <img src='/images/free_radius.svg' className='w-5 h-5' />}
                          {role === 'mpesaSettings' && <img src='/images/mpesa-logo.png' className='w-7 h-7' />}
                          {role === 'rebootRouter' && <TbRouter className='w-5 h-5' />}
                          {role === 'userGroup' && <FaUsers className='w-5 h-5' />}
                          {role === 'hotspotTemplate' && <LuLayoutTemplate className='w-5 h-5' />}
                          {role === 'hotspotVoucher' &&   '🎫'}
                          

  
  
  
   {role}
  </span>
  {seeItem[role] ?   <IoIosArrowUp /> : <IoIosArrowDown />}
  
  
</button>
</h2>


<motion.div variants={variantDiv} transition={{duration:0.1, ease: "easeInOut",
  }} initial='hidden' animate={seeItem[role] ? "visible" : "hidden"} className='flex justify-between'>
<p>Item</p>
<p>Read</p>
<p>Read/Write</p>
            </motion.div> 


<motion.div variants={variantDiv} transition={{duration:0.1, ease: "easeInOut",
  }} initial='hidden' animate={seeItem[role] ? "visible" : "hidden"} className='flex justify-between'>
            <p className="dark:text-black text-black ">
            {role}
          </p>

      <FormControlLabel control={<Checkbox checked={permissionAndRoles[role]?.read} color='success' 
       onChange={(event)=>handleUserRoleFormDataChange(role, event)} />}   name='read'  />


      <FormControlLabel control={<Checkbox color='success' checked={permissionAndRoles[role]?.readWrite}
       onChange={(event)=>handleUserRoleFormDataChange(role, event)} />}   name='readWrite'  />
            </motion.div>

            </div>

  </>
))}

    </div>

<div className='flex justify-center gap-7'>
<motion.button 
whileTap={{scale: 0.95,

    backgroundColor: 'green',
}}
type='submit'  className={`
 flex-1 flex items-center justify-center  gap-2 px-6 py-3.5 font-medium 
                        bg-secondary text-black rounded-2xl transition-all
                         hover:bg-green-500 duration-300 border-2
                          border-green-500 disabled:opacity-50 disabled:cursor-not-allowed
  `}>
    update
      </motion.button>

      <button   onClick={(e) =>{
            e.preventDefault()
            setIsOpen(false)
            setBottomNavigation(true)

          } } className={`flex-1 px-6 py-3.5 font-medium 
                   text-gray-700 rounded-2xl transition-all
                       duration-300 
                       hover:bg-red-500 border-2 border-red-700`}>
        Cancel
      </button>


{/*   
<button type='submit' className="btn ">invite</button>


        <button
          onClick={(e) =>{
            e.preventDefault()
            setIsOpen(false)

          } }
          className="btn btn-error"
        >
          cancel
        </button> */}
     
    
      </div>
</form>

    
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default InvitationForm;

