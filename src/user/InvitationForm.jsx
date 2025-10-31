
import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useEffect, useCallback } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { GoPeople } from "react-icons/go";

import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import Lottie from 'react-lottie';
import LoadingAnimation from '../loader/loading_animation.json'
import Backdrop from '@mui/material/Backdrop';
import { MdOutlineTextsms } from "react-icons/md";
import { PiTicketLight } from "react-icons/pi";

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
import { RiHotspotLine } from "react-icons/ri";
import { ImCancelCircle } from "react-icons/im";
import { FaHandshakeSimple } from "react-icons/fa6";
import { MdEventAvailable } from "react-icons/md";
import { GoUpload } from "react-icons/go";
import { FcDataConfiguration } from "react-icons/fc";
import { GiMeshNetwork } from "react-icons/gi";
import { TbNetwork } from "react-icons/tb";


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
  hotspotSettings: false,
  clientLead: false,
  calendarEvent: false,
  uploadSubscriber: false,
  wireguardConfiguration: false,
privateIps: false,
ipNetworks: false,
invoice: false,
equipment: false,



  
  
  
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


const handleUserRoleFormDataChange = (role, event) => {
  const { name } = event.target;

  setPermissionAndRoles((prevData) => {
    const newPermission = { ...prevData, [role]: { ...prevData[role] } };

    if (name === 'read') {
      newPermission[role].read = !newPermission[role].read;
      if (newPermission[role].read) {
        newPermission[role].readWrite = false;
      }
    } else if (name === 'readWrite') {
      newPermission[role].readWrite = !newPermission[role].readWrite;
      if (newPermission[role].readWrite) {
        newPermission[role].read = false;
      }
    }
console.log('newpermision role read', newPermission[role].read)
    setUserPermisions((prevUserPermissions) => ({
      ...prevUserPermissions,
      can_manage_subscriber: newPermission.subscriber.readWrite,
      can_read_read_subscriber: newPermission.subscriber.read,
      can_manage_ticket_settings: newPermission.ticketSettings.readWrite,
      can_read_ticket_settings: newPermission.ticketSettings.read,
      can_read_ppoe_package: newPermission.package.read,
      can_manage_ppoe_package: newPermission.package.readWrite,
      can_manage_company_setting: newPermission.companySettings.readWrite,
      can_read_company_setting: newPermission.companySettings.read,
      can_manage_email_setting: newPermission.emailSettings.readWrite,
      can_read_email_setting: newPermission.emailSettings.read,
      can_manage_hotspot_packages: newPermission.hotspotPackage.readWrite,
      can_read_hotspot_packages: newPermission.hotspotPackage.read,
      can_manage_ip_pool: newPermission?.pool?.readWrite,
      can_read_ip_pool: newPermission?.pool?.read,
      can_manage_nas_routers: newPermission?.router?.readWrite,
      can_read_nas_routers: newPermission?.router?.read,
      can_manage_router_setting: newPermission?.routerSettings?.readWrite,
      can_read_router_setting: newPermission?.routerSettings?.read,
      can_manage_sms: newPermission.sms.readWrite,
      can_read_sms: newPermission.sms.read,
      can_manage_sms_settings: newPermission.smsSettings.readWrite,
      can_read_sms_settings: newPermission.smsSettings.read,
      can_manage_subscriber_setting: newPermission.subscriberSettings.readWrite,
      can_read_subscriber_setting: newPermission.subscriberSettings.read,
      can_manage_subscription: newPermission.subscription.readWrite,
      can_read_subscription: newPermission.subscription.read,
      can_manage_support_tickets: newPermission.tickets.readWrite,
      can_read_support_tickets: newPermission.tickets.read,
      can_manage_users: newPermission.user.readWrite,
      can_read_users: newPermission.user.read,
      can_manage_user_setting: newPermission.userSettings.readWrite,
      can_read_user_setting: newPermission.userSettings.read,
      can_manage_free_radius: newPermission.freeRadius.readWrite,
      can_read_free_radius: newPermission.freeRadius.read,
      can_manage_mpesa_settings: newPermission.mpesaSettings.readWrite,
      can_read_mpesa_settings: newPermission.mpesaSettings.read,
      can_reboot_router: newPermission.rebootRouter.readWrite,
      can_manage_user_group: newPermission.userGroup.readWrite,
      can_read_user_group: newPermission.userGroup.read,
      can_manage_hotspot_template: newPermission.hotspotTemplate.readWrite,
      can_read_hotspot_template: newPermission.hotspotTemplate.read,
      can_read_hotspot_voucher: newPermission.hotspotVoucher.read,
      can_manage_hotspot_voucher: newPermission.hotspotVoucher.readWrite,
      can_manage_hotspot_settings: newPermission.hotspotSettings.readWrite,
      can_read_hotspot_settings: newPermission.hotspotSettings.read,
      can_manage_invoice: newPermission.invoice.readWrite,
      can_read_invoice: newPermission.invoice.read,
      can_manage_equipment: newPermission.equipment.readWrite,
      can_read_equipment: newPermission.equipment.read,
    }));

    return newPermission;
  });
};


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
      {loading && (
        <Backdrop open={openLoad} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Lottie className='relative z-50' options={defaultOptions} height={400} width={400} />
        </Backdrop>
      )}
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center
             p-4 bg-slate-900/20 backdrop-blur"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-lg shadow-xl w-full
               max-w-3xl max-h-[90vh] flex flex-col"
            >
              <div className="sticky top-0 z-10 bg-white p-6 border-b border-gray-200 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Invite Users
                  </h3>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ImCancelCircle className="text-2xl" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto p-6 flex-1">
                <form onSubmit={inviteUser} className="space-y-6">
                  {/* User Details Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <TextField
                        fullWidth
                        label="Your Name"
                        variant="outlined"
                        name="username"
                        value={userPermisions.username}
                        onChange={handleUserDetailsFormDataChange}
                        error={seeUsernameError || seeUsernameError2}
                        helperText={(seeUsernameError && usernameError) || (seeUsernameError2 && usernameError2)}
                      />
                    </div>

                    <div className="space-y-2">
                      <TextField
                        fullWidth
                        label="Your Phone"
                        variant="outlined"
                        name="phone_number"
                        value={userPermisions.phone_number}
                        onChange={handleUserDetailsPhoneNumber}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        name="email"
                        value={userPermisions.email}
                        onChange={handleUserDetailsFormDataChange}
                        error={seeEmailError || seeEmailError2 || seeStrictEmailError}
                        helperText={
                          (seeEmailError && emailError) || 
                          (seeEmailError2 && emailError2) || 
                          (seeStrictEmailError && strictEmailError)
                        }
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Autocomplete
                        value={userRoles.find(permission => permission.name === userPermisions.role)}
                        options={userRoles}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => {
                          setUserPermisions(prev => ({
                            ...prev,
                            role: newValue ? newValue.name : ''
                          }));
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select User Role"
                            variant="outlined"
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Permissions Section */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b">
                      <div className="grid grid-cols-12 gap-4 font-medium">
                        <div className="col-span-6">Item</div>
                        <div className="col-span-3 text-center">Read</div>
                        <div className="col-span-3 text-center">Read/Write</div>
                      </div>
                    </div>

                    <div className="divide-y max-h-[300px] overflow-y-auto">
                      {Object.keys(seeItem).map((user_role, index) => (
                        <div key={index} className="hover:bg-gray-50 transition-colors">
                          <button
                            type="button"
                            onClick={() => handleSeeItem(user_role)}
                            className="w-full p-4 text-left grid grid-cols-12 gap-4 items-center"
                          >
                            <div className="col-span-6 flex items-center gap-3">
                              {/* Icons based on user_role */}
                              {user_role === 'userSettings' && <GrUserSettings className="w-5 h-5" />}
                              {user_role === 'sms' && <MdOutlineTextsms className="w-5 h-5" />}
                              {/* Add all other icons similarly */}
                              <span className="capitalize">{user_role.replace(/([A-Z])/g, ' $1').trim()}</span>
                            </div>
                            <div className="col-span-3 flex justify-center">
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={permissionAndRoles[user_role]?.read}
                                    onChange={(event) => handleUserRoleFormDataChange(user_role, event)}
                                    name="read"
                                    color="primary"
                                  />
                                }
                                label=""
                              />
                            </div>
                            <div className="col-span-3 flex justify-center">
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={permissionAndRoles[user_role]?.readWrite}
                                    onChange={(event) => handleUserRoleFormDataChange(user_role, event)}
                                    name="readWrite"
                                    color="primary"
                                  />
                                }
                                label=""
                              />
                            </div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsOpen(false);
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      Invite User
                    </motion.button>
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