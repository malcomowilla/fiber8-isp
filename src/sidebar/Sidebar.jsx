
// import { useContext, useCallback, useEffect} from 'react'
// import {ApplicationContext} from '../context/ApplicationContext'
// import {Link} from  'react-router-dom'
// import WifiIcon from '@mui/icons-material/Wifi';
// import RouterIcon from '@mui/icons-material/Router';
// import SensorsIcon from '@mui/icons-material/Sensors';
// import BarChartIcon from '@mui/icons-material/BarChart';
// import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
// import PaymentsIcon from '@mui/icons-material/Payments';
// import CellTowerIcon from '@mui/icons-material/CellTower';
// import SignalWifi3BarIcon from '@mui/icons-material/SignalWifi3Bar';
// import PermDataSettingIcon from '@mui/icons-material/PermDataSetting';
// import PaymentIcon from '@mui/icons-material/Payment';
// import ReceiptIcon from '@mui/icons-material/Receipt';
// import MailOutlineIcon from '@mui/icons-material/MailOutline';
// import TextsmsSharpIcon from '@mui/icons-material/TextsmsSharp';
// import WifiSharpIcon from '@mui/icons-material/WifiSharp';
// import KeyboardArrowUpSharpIcon from '@mui/icons-material/KeyboardArrowUpSharp';
// import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp';
// import PaymentsSharpIcon from '@mui/icons-material/PaymentsSharp';
// import {useApplicationSettings} from '../settings/ApplicationSettings';
// import toast,{Toaster} from 'react-hot-toast';
// import { LuUsers } from "react-icons/lu";

// import { motion, AnimatePresence } from "framer-motion";
// import { LuTicketsPlane } from "react-icons/lu";
// import { FcOnlineSupport } from "react-icons/fc";
// import { FaUpload } from "react-icons/fa6";
// import { LuLayoutTemplate } from "react-icons/lu";
// import { MdSettingsInputAntenna } from "react-icons/md";
// import { CgComponents } from "react-icons/cg";
// import { TbCloudNetwork } from "react-icons/tb";
// import { IoStatsChartOutline } from "react-icons/io5";
// import { SiPaloaltonetworks } from "react-icons/si";
// import { FaHandshake } from "react-icons/fa";
// import { FaRegCalendarAlt } from "react-icons/fa";
// import { AiOutlineWhatsApp } from "react-icons/ai";
// import { PiNetworkSlashLight } from "react-icons/pi";
// import { TbLicense } from "react-icons/tb";
// import { CiMoneyCheck1 } from "react-icons/ci";
// import { MdOutlineSecurity } from "react-icons/md";
// import { MdMenuOpen } from "react-icons/md";
// import { MdDevices } from "react-icons/md";
// import { FaPhoneVolume } from "react-icons/fa";
// import { RiRouterLine } from "react-icons/ri";
// import { ImStatsDots } from "react-icons/im";
// import { GrLicense } from "react-icons/gr";
// import { TbHomeStats } from "react-icons/tb";
// import AssessmentIcon from '@mui/icons-material/Assessment';








// const Sidebar = () => {


// const {isExpanded, setIsExpanded, isExpanded1, setIsExpanded1 , isExpanded2, setIsExpanded2,
  
//   isExpanded3, setIsExpanded3, isExpanded4, setIsExpanded4, isExpanded5, setIsExpanded5, seeSidebar, 
//   setSeeSideBar, isExpanded6, setIsExpanded6, isExpanded7, setIsExpanded7,
//   setIsExpanded9, isExpanded9



// } = useContext(ApplicationContext);

// const {companySettings, setCompanySettings,
// showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
//       showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
//        showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
//         showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,
//         showMenu13, setShowMenu13

// } = useApplicationSettings()
  
// const {company_name, contact_info, email_info, logo_preview} = companySettings



// useEffect(() => {

//   if (window.innerWidth < 1080) {
//     if (seeSidebar === true) {
//             setIsExpanded(false)
//             setIsExpanded2(false)
//             setIsExpanded3(false)
//             setIsExpanded4(false)
//             setIsExpanded5(false)
//             setIsExpanded6(false)
//             setIsExpanded7(false)

//           }
//   }
     
  
  
// }, [setIsExpanded2, setIsExpanded3, setIsExpanded4,
//   setIsExpanded5, setIsExpanded6, setIsExpanded7, setIsExpanded,
//   setSeeSideBar, seeSidebar,
// ]);



// useEffect(() => {
//   const handleResize = () => {
//     setSeeSideBar(window.innerWidth < 1080);
    
//   };

//   handleResize();

//   window.addEventListener("resize", handleResize);
  
//   return () => window.removeEventListener("resize", handleResize);
// }, []);




// const subdomain = window.location.hostname.split('.')[0]; 

// const handleGetCompanySettings = useCallback(
//    async() => {
//      try {
//        const response = await fetch('/api/allow_get_company_settings', {
//          method: 'GET',
//          headers: {
//            'X-Subdomain': subdomain,
//          },
//        })
//        const newData = await response.json()
//        if (response.ok) {
//          // setcompanySettings(newData)
//          const { contact_info, company_name, email_info, logo_url,
//            customer_support_phone_number,agent_email ,customer_support_email
//           } = newData
//          setCompanySettings((prevData)=> ({...prevData, 
//            contact_info, company_name, email_info,
//            customer_support_phone_number,agent_email ,customer_support_email,
         
//            logo_preview: logo_url
//          }))
 
//        }else{
//        }
//      } catch (error) {
//        toast.error('internal servere error  while fetching company settings')
     
//      }
//    },
//    [],
//  )
 
//  useEffect(() => {
   
//    handleGetCompanySettings()
   
//  }, [handleGetCompanySettings])
 

 
//   return (


//     <>
    

// <aside 
// id='sidebar-multi-level-sidebar'
// className={`fixed top-0 left-0 
//   overflow-auto

// w-64 h-screen transition-all duration-300 ease-in-out 
//   bg-[#042f2e]       mogra-regular shadow-xl   
//   lg:block ${seeSidebar ? 'w-[58px]' : 'w-[240px] '}    
// `}aria-label="Sidebar">
//    <div className={`h-full px-3 py-4   
//       dark:bg-gray-800
   
   
//    `}>
//    <div className='flex justify-between   text-white'>
// {seeSidebar ? (
//   <img
//   className="h-[32px] w-[32px] rounded-full"
//   src={logo_preview || "/images/aitechs.png"}
//   alt={company_name || "Aitechs"}
//   onError={(e) => { e.target.src = "/images/aitechs.png"; }}
// />
// ):  <img
//   className="h-[80px] w-[80px] rounded-full"
//   src={logo_preview || "/images/aitechs.png"}
//   alt={company_name || "Aitechs"}
//   onError={(e) => { e.target.src = "/images/aitechs.png"; }}
// />}
   
//    {/* <img  className='h-[80px] w-[80px] rounded-full'  src={logo_preview || 
//    '/images/aitechs.png'}  alt="company-logo" /> */}

//    {seeSidebar ? null : <p className='font-extrabold roboto-condensed lg:text-xl'>{company_name || "Aitechs"}</p>}


//       {!seeSidebar &&  
//       <div id='sidebar-toggle'>
//         <MdMenuOpen
      
//         className='cursor-pointer w-7 h-7'
//          onClick={()=> {
//           setSeeSideBar(!seeSidebar)
//           if (!seeSidebar) {
//             setIsExpanded(false)
//             setIsExpanded2(false)
//             setIsExpanded3(false)
//             setIsExpanded4(false)
//             setIsExpanded5(false)
//             setIsExpanded6(false)
//             setIsExpanded7(false)

//           }
//          }}
         
         
//          />
// </div>

         

// }







//    </div>
  




//       <ul className="font-extralight roboto-condensed ">
// {seeSidebar ? (
//    <button 
         
//          onMouseEnter={() => {
//           setShowMenu1(true)
//           setShowMenu2(false)
//           setShowMenu3(false)
//           setShowMenu4(false)
//           setShowMenu5(false)
//           setShowMenu6(false)
//           setShowMenu7(false)
//           setShowMenu8(false)
//           setShowMenu9(false)
//           setShowMenu10(false)
//           setShowMenu11(false)  
//           setShowMenu12(false)
//          }}
//           type="button" className="flex 
//          flex-row mt-[50px]  hover:bg-black  dark:bg-white dark:hover:text-black
//           items-center  p-2 text-base  
//              text-white  duration-700  rounded-lg group hover:
//               dark:text-black " aria-controls="dropdown-example"
//                data-collapse-toggle="dropdown-example">
//                      <BarChartIcon />
//                      {showMenu1 &&  <span 
//                               onMouseLeave={() => setShowMenu1(false)}

//                      className="flex-1 ms-3 
                     
//                      text-left rtl:text-right 
//                      whitespace-nowrap text-black
//                      bg-white shadow-lg rounded-lg
//                      ">
                     
//                        <motion.li
//               onClick={() => {
//                 if (window.innerWidth < 962) {
//                   setSeeSideBar(true);
//                 }
//               }}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <Link
//                   to="/admin/admin-dashboard"
//                   className="flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-black
//                    hover:bg-gray-700"
//                 >
//                   <ManageAccountsOutlinedIcon />
//                   Activity Logs
//                 </Link>
//               </motion.li>

//               <motion.li
//               onClick={() => {
//                 if (window.innerWidth < 962) {
//                   setSeeSideBar(true);
//                 }
//               }}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 transition={{ duration: 0.2, delay: 0.1 }}
//               >
//                 <Link
//                   to="/admin/analytics"
//                   className="flex items-center gap-x-4 w-full 
//                   p-2 transition duration-75 rounded-lg pl-11 group text-black
//                    hover:bg-gray-700"
//                 >
//                   <img
//                     src="/images/icons8-increase.gif"
//                     className="rounded-full w-8 h-8"
//                     alt="Analytics"
//                   />
//                   Analytics
//                 </Link>
//               </motion.li>


             

//                      </span>
                     
//                      }
                    


                 

               
//             </button>
// ):  <button 
         
       
//          onClick={()=> {
//           setIsExpanded5(!isExpanded5)
//           setIsExpanded6(false)  
//           setIsExpanded7(false)
//           setIsExpanded4(false)
//           setIsExpanded3(false)
//           setIsExpanded2(false)
//           setIsExpanded1(false)
//           setIsExpanded(false)


//          }} type="button" className="flex 
//          flex-row mt-[50px]  hover:bg-black transition-colors dark:bg-white dark:hover:text-black
//           items-center w-full p-2 text-base  
//              text-white  duration-700  rounded-lg group hover:
//               dark:text-black " aria-controls="dropdown-example"
//                data-collapse-toggle="dropdown-example">
//                      <BarChartIcon/>
//                      {!seeSidebar && <span className="flex-1 ms-3 text-left rtl:text-right 
//                      whitespace-nowrap">Dashboard</span>}
//                   {isExpanded ? (
//                      <KeyboardArrowUpSharpIcon/>

//                    ):     <>  
                   
                    
//                     {!seeSidebar &&   < KeyboardArrowDownSharpIcon/>
// }

//                      </>
// }
               
//             </button>}

        


//          <motion.ul id="dropdown-example"
//         className="py-1 space-y-1"
//         initial={{ opacity: 0, height: 0 }}
//         animate={{
//           opacity: isExpanded5 ? 1 : 0,
//           height: isExpanded5 ? "auto" : 0,
//         }}
//         transition={{ duration: 0.3, ease: "easeInOut" }}>




// <AnimatePresence>
//           {isExpanded5 && (
//             <>
//               <motion.li
//               onClick={() => {
//                 if (window.innerWidth < 962) {
//                   setSeeSideBar(true);
//                 }
//               }}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <Link
//                   to="/admin/admin-dashboard"
//                   className="flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-white
//                    hover:bg-gray-700"
//                 >
//                   <ManageAccountsOutlinedIcon />
//                   Activity Logs
//                 </Link>
//               </motion.li>

//               <motion.li
//               onClick={() => {
//                 if (window.innerWidth < 962) {
//                   setSeeSideBar(true);
//                 }
//               }}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 transition={{ duration: 0.2, delay: 0.1 }}
//               >
//                 <Link
//                   to="/admin/analytics"
//                   className="flex items-center gap-x-4 w-full p-2 transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700"
//                 >
//                   <img
//                     src="/images/icons8-increase.gif"
//                     className="rounded-full w-8 h-8"
//                     alt="Analytics"
//                   />
//                   Analytics
//                 </Link>
//               </motion.li>



//  <motion.li
//               onClick={() => {
//                 if (window.innerWidth < 962) {
//                   setSeeSideBar(true);
//                 }
//               }}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 transition={{ duration: 0.2, delay: 0.1 }}
//               >
//                 <Link
//                   to="/admin/finance-stats"
//                   className="flex items-center gap-x-4 w-full p-2 transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700"
//                 >
//                  <CiMoneyCheck1 className='w-7 h-7'/>
//                   Money Check
//                 </Link>
//               </motion.li>






             
//             </>
//           )}
//         </AnimatePresence>
     
//             </motion.ul>




         
        


// {seeSidebar ? (
//   <button  
//    onMouseEnter={() => {
//     setShowMenu2(true)
//     setShowMenu1(false)
//     setShowMenu3(false)
//     setShowMenu4(false)
//     setShowMenu5(false)
//     setShowMenu6(false)
//     setShowMenu7(false)
//     setShowMenu8(false)
//     setShowMenu9(false)
//     setShowMenu10(false)
//     setShowMenu11(false)  
//     setShowMenu12(false)
//     setIsExpanded(false)
//    }}
  
//  type="button" className="flex items-center w-full p-2 
//             text-base  dark:hover:bg-white dark:hover:text-black hover:bg-black
//                   transition-colors duration-700      
//               rounded-lg group 
//               dark:text-white  text-white" aria-controls="dropdown-example"
//                data-collapse-toggle="dropdown-example">
//                      <WifiSharpIcon/>
// {showMenu2 ? (
// <ul 
// onMouseLeave={() => setShowMenu2(false)}
// className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap 

// bg-white shadow-lg rounded-lg text-black
// ">
  
//   <p className='text-center roboto-condensed-bold '>PPPoe </p>


// <motion.li 
// onClick={() => {
//   if (window.innerWidth < 962) {
//     setSeeSideBar(true);
//   }
// }}
// initial={{ opacity: 0, x: -20 }}
// animate={{ opacity: 1, x: 0 }}
// exit={{ opacity: 0, x: -20 }}
// transition={{ duration: 0.2, delay: 0.1 }}
// className="flex items-center  w-full p-2 text-black transition
//                       duration-75 rounded-lg  space-x-4 group 
//                        ">
//                               {/* <WifiIcon className='w-[500px]'/>    */}

// <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
// <div className='bg-black rounded-full text-black w-[2.9rem] h-[2.9rem]
//  pt-3 text-center font-extrabold shadow-2xl'>
//    <p className='text-sm dotted-font text-white' >MBPS</p>
// </div>
//                      <Link className='' to='/admin/pppoe-packages'>
//                        PPOE packages                 
//                        </Link>

//                        </div>
//                   </motion.li>


                  

//                   <motion.li 
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                    initial={{ opacity: 0, x: -20 }}
//                    animate={{ opacity: 1, x: 0 }}
//                    exit={{ opacity: 0, x: -20 }}
//                    transition={{ duration: 0.2 , delay: 0.2 }}
//                   className="flex items-center w-full p-2 text-black transition
//                       duration-75 text-nowrap  space-x-4 group 
//                       ">

//                     <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>    
//             <img src="/images/icons8-person.gif " className='rounded-full w-10  h-10' alt="" />

//                      <Link className='text-wrap' to='/admin/pppoe-subscribers' >                  
//                       PPOE subscribers                 
//                   </Link>

//                   </div>
//                   </motion.li>





//    <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.2 , delay: 0.3 }}
//                   className="flex items-center w-full p-2 text-white transition
//                       duration-75   space-x-4 group 
//                        dark:text-white">

//                         <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
//                                  <AssessmentIcon className='w-6 h-6 text-yellow-600'/>   


//                      <Link to='/admin/subscriber-payment-analytics'
//  >                 
//                       Payment Analytics
//                       </Link>

//                       </div>
//                   </motion.li>

// </ul>

// ): null}
                    

                   

//                    {isExpanded ? (
//                      <KeyboardArrowUpSharpIcon/>

//                    ):     <>  
                   
                    
//                     {!seeSidebar &&   < KeyboardArrowDownSharpIcon/>
// }

//                      </>
// }
//             </button>
// ):   <button   onClick={()=> {
//    setIsExpanded6(false)  
//           setIsExpanded7(false)
//           setIsExpanded4(false)
//           setIsExpanded5(false)
//           setIsExpanded3(false)
//           setIsExpanded2(false)
//           setIsExpanded1(false)
//           setIsExpanded(!isExpanded)
// }} type="button" className="flex items-center w-full p-2 
//             text-base  dark:hover:bg-white dark:hover:text-black hover:bg-black
//                   transition-colors duration-700      
//               rounded-lg group 
//               dark:text-white  text-white" aria-controls="dropdown-example"
//                data-collapse-toggle="dropdown-example">
//                      <WifiSharpIcon/>

// {!seeSidebar && <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap ">PPPoe</span>}
                    

// {!seeSidebar && (
//   <>
//   {isExpanded ? (
//                      <KeyboardArrowUpSharpIcon/>

//                    ):     <>  
                   
                    
//                     {!seeSidebar &&   < KeyboardArrowDownSharpIcon/>
// }

//                      </>
// }
//   </>
// )}
                   

                 
//             </button>}
          


//             <motion.ul id="dropdown-example"
//         className="py-1 space-y-1"
//         initial={{ opacity: 0, height: 0 }}
//         animate={{
//           opacity: isExpanded ? 1 : 0,
//           height: isExpanded ? "auto" : 0,
//         }}
//         transition={{ duration: 0.3, ease: "easeInOut" }}>


// <AnimatePresence>
// {isExpanded &&  (
//    <>

// <motion.li 
// onClick={() => {
//   if (window.innerWidth < 962) {
//     setSeeSideBar(true);
//   }
// }}
// initial={{ opacity: 0, x: -20 }}
// animate={{ opacity: 1, x: 0 }}
// exit={{ opacity: 0, x: -20 }}
// transition={{ duration: 0.2, delay: 0.1 }}
// className="flex items-center  w-full p-2 text-white transition
//                       duration-75 rounded-lg  space-x-4 group 
//                        dark:text-white ">
//                               {/* <WifiIcon className='w-[500px]'/>    */}

// <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
// <div className='bg-white rounded-full text-black w-[2.9rem] h-[2.9rem] pt-3 text-center font-extrabold'>
//    <p className='text-sm dotted-font'>MBPS</p>
// </div>
//                      <Link className='' to='/admin/pppoe-packages'>
//                        PPOE packages                 
//                        </Link>

//                        </div>
//                   </motion.li>


                  

//                   <motion.li 
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                    initial={{ opacity: 0, x: -20 }}
//                    animate={{ opacity: 1, x: 0 }}
//                    exit={{ opacity: 0, x: -20 }}
//                    transition={{ duration: 0.2 , delay: 0.2 }}
//                   className="flex items-center w-full p-2 text-white transition
//                       duration-75 text-nowrap  space-x-4 group 
//                        dark:text-white">

//                     <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>    
//             <img src="/images/icons8-person.gif " className='rounded-full w-10  h-10' alt="" />

//                      <Link className='text-wrap' to='/admin/pppoe-subscribers' >                  
//                       PPOE subscribers                 
//                   </Link>

//                   </div>
//                   </motion.li>



                  





//                   {/* <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.2 , delay: 0.3 }}
//                   className="flex items-center w-full p-2 text-white transition
//                       duration-75   space-x-4 group 
//                        dark:text-white">
//                                  <WifiIcon className='w-6 h-6 text-blue-500'/>   


//                      <Link to='/admin/pppoe-subscriptions' >                 
//                       PPOE subscriptions                  
//                       </Link>
//                   </motion.li> */}






//    <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.2 , delay: 0.3 }}
//                   className="flex items-center w-full p-2 text-white transition
//                       duration-75   space-x-4 group 
//                        dark:text-white">

//                         <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
//                                  <AssessmentIcon className='w-6 h-6 text-yellow-600'/>   


//                      <Link to='/admin/subscriber-payment-analytics'
//  >                 
//                       Payment Analytics
//                       </Link>

//                       </div>
//                   </motion.li>



//                   <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.2 , delay: 0.3 }}
//                   className="flex items-center w-full p-2 text-white transition
//                       duration-75   space-x-4 group 
//                        dark:text-white">

//                         <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
//                                  <FaUpload className='w-6 h-6 text-yellow-600'/>   


//                      <Link to='/admin/upload-subscriber' >                 
//                       upload subscribers                  
//                       </Link>

//                       </div>
//                   </motion.li>

                  

//    </>
// )}

                

//                   </AnimatePresence>

//             </motion.ul>



// {seeSidebar ? (
//  <button  
//  onMouseEnter={() => {

//    setShowMenu3(true)
//    setShowMenu4(false)
//    setShowMenu2(false)
//    setShowMenu5(false)
//    setShowMenu6(false)
//    setShowMenu7(false)
//    setShowMenu8(false)
//    setShowMenu9(false)
//    setShowMenu10(false)
//    setShowMenu11(false)
//    setShowMenu12(false)

   
//  }}
//  type="button" className="flex items-center w-full p-2
//           text-base transition-colors duration-700
//              text-white  rounded-lg group dark:hover:bg-white dark:hover:text-black
//               hover:bg-black
//               dark:text-white " aria-controls="dropdown-example"
//                data-collapse-toggle="dropdown-example">
//                   <SensorsIcon/>
                

// {showMenu3 ? (

//             <motion.ul
            
//             onMouseLeave={() => {
//               setShowMenu3(false)
            
//             }}
//             id="dropdown-example"
//         className="py-1 space-y-1 bg-white shadow-lg rounded-lg"
//      >
// {seeSidebar && <p className='text-black roboto-condensed-bold'>Networks </p>
//  }

  
//    <motion.li
//    onClick={() => {
//     if (window.innerWidth < 962) {
//       setSeeSideBar(true);
//     }
//   }}
//    initial={{ opacity: 0, x: -20 }}
//    animate={{ opacity: 1, x: 0 }}
//    exit={{ opacity: 0, x: -20 }}
//    transition={{ duration: 0.2 , delay: 0.1 }}
//    >

//     <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
//                      <Link to='/admin/nodes' className="flex items-center w-full p-2 text-black
//                       transition
//                       duration-75 rounded-lg  group 
//                        dark:text-white  gap-x-3">
//                         <img src="/images/icons8-map-pin.gif " className='w-8 h-8 rounded-full' alt="" />
//                         <p className='text-black'>Nodes </p></Link>

//                         </div>
//                   </motion.li>



                  



// <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.2 , delay: 0.2 }}
//                   >
//                     <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
//                      <Link to='/admin/ip-pool' className="flex items-center w-full p-2 ttext-black
//                      transition duration-75 rounded-lg group  
//                        gap-x-3">
//                               <PiNetworkSlashLight
//                               className='w-8 h-8 text-yellow-600'
//  />
//                         <p className='text-white'>Ip Pool</p></Link>

//                         </div>
//                   </motion.li>

//   <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.2 , delay: 0.2 }}
//                   >
//                     <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
//                      <Link to='/admin/private-network' className="flex items-center w-full p-2 ttext-black
//                      transition duration-75 rounded-lg group  
//                        gap-x-3">
//                               <PiNetworkSlashLight
//                               className='w-8 h-8 text-blue-600'
//  />
//                         private network</Link>

//                         </div>
//                   </motion.li>
               


//                   <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.2 , delay: 0.2 }}
//                   >
                    
//                     <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
//                      <Link to='/admin/networks-wireguard-config' className="flex items-center w-full p-2
//                       text-black
//                      transition duration-75 rounded-lg group  
//                        gap-x-3">
//                         <div>
//                               <img src='/images/wireguard2.png' className='rounded-full h-7 w-7' />
//                               </div>
//                         wireguard</Link>

//                         </div>
//                   </motion.li>





//                   <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.2 , delay: 0.2 }}
//                   >
//                     <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
//                      <Link to='/admin/ip_networks' className="flex items-center w-full p-2 text-black
//                      transition duration-75 rounded-lg group  
//                        gap-x-3">
//                         <div>
//                               <TbCloudNetwork className='rounded-full h-7 w-7' />
//                               </div>
//                         ip_networks</Link>

// </div>
//                   </motion.li>







//                   <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.2 , delay: 0.2 }}
//                   >
                    
                  
//                   </motion.li>






//                    <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.2 , delay: 0.2 }}
//                   >
                    
//                     <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
//                      <Link to='/admin/devices' className="flex items-center w-full p-2
//                       text-black
//                      transition duration-75 rounded-lg group  
//                        gap-x-3">
//                         <div>
//                               <RiRouterLine className='text-orange-500
                              
//                               h-7 w-7' />
//                               </div>
//                         ONU</Link>


//                         </div>
//                   </motion.li>

//                   <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.2 , delay: 0.3 }}
//                   >

//                     <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
//                      <Link  to='/admin/map' className="flex items-center w-full p-2 text-black
//                      transition duration-75 rounded-lg  group 
//                         gap-x-3">
//                         <img src="/images/icons8-map (1).gif" className='w-8 h-8 rounded-full' alt="" />
//                         Map</Link>
//                         </div>
//                   </motion.li>






                   


//                         <motion.li
//                         onClick={() => {
//                           if (window.innerWidth < 962) {
//                             setSeeSideBar(true);
//                           }
//                         }}
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         exit={{ opacity: 0, x: -20 }}
//                         transition={{ duration: 0.2 , delay: 0.5 }}
//                         >

//                           <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
//                            <Link to='/admin/nas' className="flex items-center w-full p-2 text-black
//                      transition duration-75 rounded-lg  group 
//                     gap-x-3">
//                            <RouterIcon/>
//                            Routers
//                            </Link>

//                            </div>
//                         </motion.li>

               




//             </motion.ul>
// ): null}

                   
//                     {isExpanded ? (
//                      <KeyboardArrowUpSharpIcon/>

//                    ):     <>  
                   
                    
//                     {!seeSidebar &&   < KeyboardArrowDownSharpIcon/>
// }

//                      </>
// }
//             </button>
// ):  <button   onClick={()=> {
//   setIsExpanded6(false)  
//           setIsExpanded7(false)
//           setIsExpanded5(false)
//           setIsExpanded3(false)
//           setIsExpanded2(false)
//           setIsExpanded1(false)
//           setIsExpanded4(!isExpanded4)
//            setIsExpanded(false)
// }} type="button" className="flex items-center w-full p-2
//           text-base transition-colors duration-700
//              text-white  rounded-lg group dark:hover:bg-white dark:hover:text-black
//               hover:bg-black
//               dark:text-white " aria-controls="dropdown-example"
//                data-collapse-toggle="dropdown-example">
//                   <SensorsIcon/>
//                   {!seeSidebar && <span className="flex-1 ms-3 text-left rtl:text-right
//                    whitespace-nowrap ">Network</span>}
//                     {isExpanded ? (
//                      <KeyboardArrowUpSharpIcon/>

//                    ):     <>  
                   
                    
//                     {!seeSidebar &&   < KeyboardArrowDownSharpIcon/>
// }

//                      </>
// }
//             </button>}
        




//             <motion.ul id="dropdown-example"
//         className="py-1 space-y-1"
//         initial={{ opacity: 0, height: 0 }}
//         animate={{
//           opacity: isExpanded4 ? 1 : 0,
//           height: isExpanded4 ? "auto" : 0,
//         }}
//         transition={{ duration: 0.3, ease: "easeInOut" }}>


// <AnimatePresence>

//    {isExpanded4 && (
//       <>
//    <motion.li
//    onClick={() => {
//     if (window.innerWidth < 962) {
//       setSeeSideBar(true);
//     }
//   }}
//    initial={{ opacity: 0, x: -20 }}
//    animate={{ opacity: 1, x: 0 }}
//    exit={{ opacity: 0, x: -20 }}
//    transition={{ duration: 0.2 , delay: 0.1 }}
//    >

//     <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
//                      <Link to='/admin/nodes' className="flex items-center w-full p-2 text-white transition
//                       duration-75 rounded-lg  group 
//                        dark:text-white  gap-x-3">
//                         <img src="/images/icons8-map-pin.gif " className='w-8 h-8 rounded-full' alt="" />
//                         Nodes</Link>

//                         </div>
//                   </motion.li>



                




//   <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.2 , delay: 0.2 }}
//                   >
//                     <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
//                      <Link to='/admin/private-network' className="flex items-center w-full p-2 ttext-black
//                      transition duration-75 rounded-lg group  
//                        gap-x-3">
//                               <PiNetworkSlashLight
//                               className='w-8 h-8 text-blue-600'
//  />
//                         <p className='text-white'>private network</p></Link>

//                         </div>
//                   </motion.li>
               



// <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.2 , delay: 0.2 }}
//                   >
//                     <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
//                      <Link to='/admin/ip-pool' className="flex items-center w-full p-2 ttext-black
//                      transition duration-75 rounded-lg group  
//                        gap-x-3">
//                               <PiNetworkSlashLight
//                               className='w-8 h-8 text-yellow-600'
//  />
//                         <p className='text-white'>Ip Pool</p></Link>

//                         </div>
//                   </motion.li>
               



//   <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.2 , delay: 0.2 }}
//                   >
//                     <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
//                      <Link to='/admin/devices' className="flex items-center w-full p-2 ttext-black
//                      transition duration-75 rounded-lg group  
//                        gap-x-3">
//                               <RiRouterLine
//                               className='w-8 h-8 text-orange-600'
//  />
//                         <p className='text-white'>ONU</p></Link>

//                         </div>
//                   </motion.li>
               



//                   <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.2 , delay: 0.2 }}
//                   >
                    
//                     <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
//                      <Link to='/admin/networks-wireguard-config' className="flex items-center w-full p-2 text-white
//                      transition duration-75 rounded-lg group  dark:text-white
//                        gap-x-3">
//                         <div>
//                               <img src='/images/wireguard2.png' className='rounded-full h-7 w-7' />
//                               </div>
//                         wireguard</Link>

//                         </div>
//                   </motion.li>





//                   <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.2 , delay: 0.2 }}
//                   >
//                     <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
//                      <Link to='/admin/ip_networks' className="flex items-center w-full p-2 text-white
//                      transition duration-75 rounded-lg group  dark:text-white
//                        gap-x-3">
//                         <div>
//                               <TbCloudNetwork className='rounded-full h-7 w-7' />
//                               </div>
//                         ip_networks</Link>

// </div>
//                   </motion.li>









//                   <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.2 , delay: 0.3 }}
//                   >

//                     <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
//                      <Link to='/admin/map' className="flex items-center w-full p-2 text-white
//                      transition duration-75 rounded-lg  group 
//                       dark:text-white  gap-x-3">
//                         <img src="/images/icons8-map (1).gif" className='w-8 h-8 rounded-full' alt="" />
//                         Map</Link>
//                         </div>
//                   </motion.li>



//                   {/* <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.2 , delay: 0.3 }}
//                   className="flex items-center w-full p-2 text-white transition
//                       duration-75   space-x-4 group 
//                        dark:text-white">
//                                  <BsHddNetwork className='w-6 h-6 text-red-500'/>   


//                      <Link to='/admin/ip-pool-table' >                 
//                       ip pool               
//                       </Link>
//                   </motion.li> */}



                   


//                         <motion.li
//                         onClick={() => {
//                           if (window.innerWidth < 962) {
//                             setSeeSideBar(true);
//                           }
//                         }}
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         exit={{ opacity: 0, x: -20 }}
//                         transition={{ duration: 0.2 , delay: 0.5 }}
//                         >

//                           <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
//                            <Link to='/admin/nas' className="flex items-center w-full p-2 text-white
//                      transition duration-75 rounded-lg  group 
//                       dark:text-white  gap-x-3">
//                            <RouterIcon/>
//                            Routers
//                            </Link>

//                            </div>
//                         </motion.li>

//       </>
//    )}
               



//                         </AnimatePresence>

//             </motion.ul>





            

         
//          <li>

// {seeSidebar ? (
// <button 

// onMouseEnter={() => {
//     setShowMenu2(false)
//     setShowMenu1(false)
//     setShowMenu3(false)
//     setShowMenu4(true)
//     setShowMenu5(false)
//     setShowMenu6(false)
//     setShowMenu7(false)
//     setShowMenu8(false)
//     setShowMenu9(false)
//     setShowMenu10(false)
//     setShowMenu11(false)  
//     setShowMenu12(false)
//     setIsExpanded(false)
//    }}
//  type="button" className="flex items-center w-full p-2 text-base
//               transition duration-75 rounded-lg group dark:hover:bg-white dark:hover:text-black hover:bg-black
//               dark:text-white text-white " aria-controls="dropdown-example"
//                data-collapse-toggle="dropdown-example">
//                      <PaymentsIcon/>
                     

// {showMenu4? (
// <ul
// onMouseLeave={() => {
//   setShowMenu4(false)
// }}
// className="flex-1 ms-3 text-e rtl:text-right
//                       whitespace-nowrap bg-white rounded-lg shadow-lg ">
                        
//                         <p className='text-center text-black roboto-condensed-bold'>Finance </p>
                        
// <motion.li
// onClick={() => {
//   if (window.innerWidth < 962) {
//     setSeeSideBar(true);
//   }
// }}
// initial={{ opacity: 0, x: -20 }}
// animate={{ opacity: 1, x: 0 }}
// exit={{ opacity: 0, x: -20 }}
// transition={{ duration: 0.2, delay: 0.1 }}
// >
//                      <Link   to='/admin/financial-dashboard'  className="flex items-center w-full p-2 text-white transition
//                       duration-75 rounded-lg  group gap-x-3
//                        dark:text-white ">
//                         <AssessmentIcon />
//                          Finance Dashboard
//                        </Link>
//                   </motion.li>




//                   <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                    initial={{ opacity: 0, x: -20 }}
//                    animate={{ opacity: 1, x: 0 }}
//                    exit={{ opacity: 0, x: -20 }}
//                    transition={{ duration: 0.2, delay: 0.2 }}
//                   >
//                      <Link to='/admin/hotspot-payments'  className="flex items-center w-full p-2
//                       text-black
//                      transition duration-75 rounded-lg  group text-nowrap  gap-x-3
//                       ">
//                          <PaymentsSharpIcon/>
//                       Hotspot Payments                  
//                       </Link>
//                       </motion.li>
//                         </ul>

// ): null }
                  
//                     {isExpanded ? (
//                      <KeyboardArrowUpSharpIcon/>

//                    ):     <>  
                   
                    
//                     {!seeSidebar &&   < KeyboardArrowDownSharpIcon/>
// }

//                      </>
// }
//             </button>
            
// ): <button   onClick={()=> setIsExpanded1(!isExpanded1)} type="button" className="flex
//  items-center w-full p-2 text-base
//               transition duration-75 rounded-lg group dark:hover:bg-white dark:hover:text-black
//                hover:bg-black
//              text-white" aria-controls="dropdown-example"
//                data-collapse-toggle="dropdown-example">
//                      <PaymentsIcon/>
//                      {!seeSidebar && <span className="flex-1 ms-3 text-left rtl:text-right
//                       whitespace-nowrap">Finance</span>}

                  
//                     {isExpanded ? (
//                      <KeyboardArrowUpSharpIcon/>

//                    ):     <>  
                   
                    
//                     {!seeSidebar &&   < KeyboardArrowDownSharpIcon/>
// }

//                      </>
// }
//             </button>}
         

//             <motion.ul id="dropdown-example"
//         className="py-1 space-y-1"
//         initial={{ opacity: 0, height: 0 }}
//         animate={{
//           opacity: isExpanded1 ? 1 : 0,
//           height: isExpanded1 ? "auto" : 0,
//         }}
//         transition={{ duration: 0.3, ease: "easeInOut" }}>


// <AnimatePresence>
// {isExpanded1 && (
//    <>

// <motion.li
// onClick={() => {
//   if (window.innerWidth < 962) {
//     setSeeSideBar(true);
//   }
// }}
// initial={{ opacity: 0, x: -20 }}
// animate={{ opacity: 1, x: 0 }}
// exit={{ opacity: 0, x: -20 }}
// transition={{ duration: 0.2, delay: 0.1 }}
// >
//                      <Link   to='/admin/financial-dashboard'  className="flex items-center w-full p-2 text-white transition
//                       duration-75 rounded-lg  group gap-x-3
//                        dark:text-white ">
//                         <AssessmentIcon />
//                          Finance Dashboard
//                        </Link>
//                   </motion.li>




//                   <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                    initial={{ opacity: 0, x: -20 }}
//                    animate={{ opacity: 1, x: 0 }}
//                    exit={{ opacity: 0, x: -20 }}
//                    transition={{ duration: 0.2, delay: 0.2 }}
//                   >
//                      <Link to='/admin/hotspot-payments'  className="flex items-center w-full p-2 text-white
//                      transition duration-75 rounded-lg  group text-nowrap dark:text-white gap-x-3
//                       ">
//                          <PaymentsSharpIcon/>
//                       Hotspot Payments                  
//                       </Link>
//                       </motion.li>
//    </>
// )}
                
                      
//                       </AnimatePresence>
                 
//             </motion.ul>
//          </li>







//          <li>
//           {seeSidebar ? (
//  <button 
//  onMouseEnter={() => {
//   setShowMenu2(false)
//   setShowMenu3(false)
//   setShowMenu1(false)
//   setShowMenu4(false)
//   setShowMenu5(true)
//   setShowMenu6(false)
//   setShowMenu7(false)
//   setShowMenu8(false)
//   setShowMenu9(false)
//   setShowMenu10(false)
//   setShowMenu11(false)  
//   setShowMenu12(false)
//  }}
//   type="button" className="flex 
//          items-center w-full
//           p-2 text-base
//              text-white transition duration-75 rounded-lg group dark:hover:bg-white
//               dark:hover:text-black
//               hover:bg-black
//               dark:text-white  " aria-controls="dropdown-example"
//                data-collapse-toggle="dropdown-example">
//                               <CellTowerIcon/> 

// {showMenu5 ? (
//   <ul 
  
//   onMouseLeave={() => {
//     setShowMenu5(false)
//   }}
//   className="flex-1 ms-3 text-left rtl:text-right 
//                               whitespace-nowrap bg-white shadow-lg rounded-lg">
                                
//                                 <p className='roboto-condensed-bold text-center
//                                 text-black
//                                 '>Comunication</p>
                              
//                               <motion.li
//  onClick={() => {
//   if (window.innerWidth < 962) {
//     setSeeSideBar(true);
//   }
// }}
//   initial={{ opacity: 0, x: -20 }}
//   animate={{ opacity: 1, x: 0 }}
//   exit={{ opacity: 0, x: -20 }}
//   transition={{ duration: 0.2, delay: 0.1 }}
//  className="flex items-center w-full p-2 gap-x-4  transition
//                       duration-75 rounded-lg pl-11 group 
//                        text-black cursor-pointer "> 
//                        <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
//                        <MailOutlineIcon />
//                    Email

//                    </div>
//                   </motion.li>

//                   <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                    initial={{ opacity: 0, x: -20 }}
//                    animate={{ opacity: 1, x: 0 }}
//                    exit={{ opacity: 0, x: -20 }}
//                    transition={{ duration: 0.2 , delay: 0.2 }}
//                   className="flex items-center w-full p-2 text-black
//                      transition duration-75 rounded-lg pl-11 group cursor-pointer 
//                        gap-x-4
//                       " >

//                         <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-black
//                    hover:bg-gray-700'>
//                         <TextsmsSharpIcon/>
//                     <Link to='/admin/send-sms' >SMS</Link>

//                     </div>
//                   </motion.li>



//                   <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                    initial={{ opacity: 0, x: -20 }}
//                    animate={{ opacity: 1, x: 0 }}
//                    exit={{ opacity: 0, x: -20 }}
//                    transition={{ duration: 0.2 , delay: 0.2 }}
//                   className="flex items-center w-full p-2 text-black
//                      transition duration-75 rounded-lg pl-11 group cursor-pointer 
//                      gap-x-4
//                       " >
//                         <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
//                         <TextsmsSharpIcon/>
//                     <Link to='/admin/messages' >Messages</Link>
//                     </div>
//                   </motion.li>

//                   <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                    initial={{ opacity: 0, x: -20 }}
//                    animate={{ opacity: 1, x: 0 }}
//                    exit={{ opacity: 0, x: -20 }}
//                    transition={{ duration: 0.2 , delay: 0.2 }}
//                   className="flex items-center w-full p-2 textblack
//                      transition duration-75 rounded-lg pl-11 group   gap-x-4
//                       " >
//                         <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
//                         <TextsmsSharpIcon/>
//                     <Link to='/admin/bulk-messages' >Bulk</Link>  
//                     </div>
//                   </motion.li>

//                   <motion.li 
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }} 
//                    initial={{ opacity: 0, x: -20 }}
//                    animate={{ opacity: 1, x: 0 }}
//                    exit={{ opacity: 0, x: -20 }}
//                    transition={{ duration: 0.2, delay: 0.3 }}
//                   className="flex items-center w-full p-2 text-black
//                      transition duration-75 rounded-lg pl-11 group gap-x-4
//                       dark:text-white ">

//                         <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
                      
//                       <AiOutlineWhatsApp className='w-6 h-6' />
//                      <p className='text-black'>Whatsap</p>

//                      </div>
//                   </motion.li> 
//                               </ul>
// ): null}
                            

//             </button>
//           ):  <button   onClick={()=>{
//             setIsExpanded6(false)  
//           setIsExpanded7(false)
//           setIsExpanded4(false)
//           setIsExpanded5(false)
//           setIsExpanded3(false)
//           setIsExpanded1(false)
//           setIsExpanded2(!isExpanded2)
//            setIsExpanded(false)
//           }} type="button" className="flex 
//          items-center w-full
//           p-2 text-base
//              text-white transition duration-75 rounded-lg group dark:hover:bg-white
//               dark:hover:text-black
//               hover:bg-black
//               dark:text-white  " aria-controls="dropdown-example"
//                data-collapse-toggle="dropdown-example">
//                               <CellTowerIcon/> 
//                               {!seeSidebar && <span className="flex-1 ms-3 text-left rtl:text-right 
//                               whitespace-nowrap">Comunication</span>}

//                     {isExpanded ? (
//                      <KeyboardArrowUpSharpIcon/>

//                    ):     <>  
                   
                    
//                     {!seeSidebar &&   < KeyboardArrowDownSharpIcon/>
// }

//                      </>
// }
//             </button>}
        
//             <motion.ul
            
//             id="dropdown-example"
//         className="py-1 space-y-1"
//         initial={{ opacity: 0, height: 0 }}
//         animate={{
//           opacity: isExpanded2 ? 1 : 0,
//           height: isExpanded2 ? "auto" : 0,
//         }}
//         transition={{ duration: 0.3, ease: "easeInOut" }}>



// <AnimatePresence>
//    {isExpanded2 && (
//       <>
//  <motion.li
//  onClick={() => {
//   if (window.innerWidth < 962) {
//     setSeeSideBar(true);
//   }
// }}
//   initial={{ opacity: 0, x: -20 }}
//   animate={{ opacity: 1, x: 0 }}
//   exit={{ opacity: 0, x: -20 }}
//   transition={{ duration: 0.2, delay: 0.1 }}
//  className="flex items-center w-full p-2 gap-x-4 text-white transition
//                       duration-75 rounded-lg pl-11 group 
//                        dark:text-white cursor-pointer "> 
//                        <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
//                        <MailOutlineIcon />
//                    Email

//                    </div>
//                   </motion.li>

//                   <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                    initial={{ opacity: 0, x: -20 }}
//                    animate={{ opacity: 1, x: 0 }}
//                    exit={{ opacity: 0, x: -20 }}
//                    transition={{ duration: 0.2 , delay: 0.2 }}
//                   className="flex items-center w-full p-2 text-white
//                      transition duration-75 rounded-lg pl-11 group cursor-pointer  dark:text-white gap-x-4
//                       " >

//                         <Link to='/admin/send-sms' className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
//                         <TextsmsSharpIcon/>
//                     SMS

//                     </Link>
//                   </motion.li>



//                   <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                    initial={{ opacity: 0, x: -20 }}
//                    animate={{ opacity: 1, x: 0 }}
//                    exit={{ opacity: 0, x: -20 }}
//                    transition={{ duration: 0.2 , delay: 0.2 }}
//                   className="flex items-center w-full p-2 text-white
//                      transition duration-75 rounded-lg pl-11 group cursor-pointer  dark:text-white gap-x-4
//                       " >
//                         <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
//                         <TextsmsSharpIcon/>
//                     <Link to='/admin/messages' >Messages</Link>
//                     </div>
//                   </motion.li>



//                   <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                    initial={{ opacity: 0, x: -20 }}
//                    animate={{ opacity: 1, x: 0 }}
//                    exit={{ opacity: 0, x: -20 }}
//                    transition={{ duration: 0.2 , delay: 0.2 }}
//                   className="flex items-center w-full p-2 text-white
//                      transition cursor-pointer
//                       duration-75 rounded-lg pl-11 group  dark:text-white gap-x-4
//                       " >
//                         <Link
//                         className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'
//                         to='/admin/bulk-messages' >
//                         <TextsmsSharpIcon/>
//                     Bulk
//                     </Link>  
//                   </motion.li>

//                   <motion.li 
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }} 
//                    initial={{ opacity: 0, x: -20 }}
//                    animate={{ opacity: 1, x: 0 }}
//                    exit={{ opacity: 0, x: -20 }}
//                    transition={{ duration: 0.2, delay: 0.3 }}
//                   className="flex items-center w-full p-2 text-white
//                      transition duration-75 rounded-lg pl-11 group gap-x-4
//                       dark:text-white ">

//                         <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
//                         <img src="/images/logo-whatsapp.svg" className='sm:w-[30px] max-sm:w-[30px]' alt="" />
//                      Whatsap

//                      </div>
//                   </motion.li>

//       </>
//    )}
                 

//                   </AnimatePresence>
//             </motion.ul>
//          </li>
//          <li>



// {seeSidebar ? (

//  <button  
//  onMouseEnter={() => {
//    setShowMenu7(false)
//    setShowMenu8(false)
//    setShowMenu9(false)
//    setShowMenu10(false)
//    setShowMenu11(false)
//    setShowMenu12(false)
//    setShowMenu6(true)
//    setShowMenu5(false)
//    setShowMenu4(false)
//    setShowMenu3(false)
//    setShowMenu2(false)
//     setShowMenu1(false)



//  }}
//   type="button" className="flex items-center w-full p-2
//   text-base
//              text-white transition duration-75 rounded-lg group 
//               dark:text-white dark:hover:bg-white dark:hover:text-black
//  hover:bg-black "
//                aria-controls="dropdown-example"
//                data-collapse-toggle="dropdown-example">
//                    <SignalWifi3BarIcon/>
                   
//                    {showMenu6 ? (
//  <ul 
//  onMouseLeave={() => {
//   setShowMenu6(false)
 
  
//  }}
//  className="flex-1 ms-3 text-left rtl:text-right
//                     bg-white shadow-lg">
                      
//                       <p className='text-center roboto-condensed-bold text-black '
//                       >Hotspot Bundle </p>
                    
                    

// <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                    initial={{ opacity: 0, x: -20 }}
//                    animate={{ opacity: 1, x: 0 }}
//                    exit={{ opacity: 0, x: -20 }}
//                    transition={{ duration: 0.2 , delay: 0.1 }}
//                   >
//                     <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-6 group text-black hover:bg-gray-700'>
//                      <Link  to='/admin/hotspot-dashboard' className="flex items-center w-full p-2
//                       text-black transition
//                       duration-75 rounded-lg  group gap-x-3 text-nowrap 
//                        "> 
//                         <IoStatsChartOutline className='text-black '/>
//                       Hotspot  Dashboard</Link>
//                       </div>
//                   </motion.li>


//                   <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                    initial={{ opacity: 0, x: -20 }}
//                    animate={{ opacity: 1, x: 0 }}
//                    exit={{ opacity: 0, x: -20 }}
//                    transition={{ duration: 0.2 , delay: 0.1 }}
//                   >
//                     <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-6 group text-black hover:bg-gray-700'>
//                      <Link  to='/admin/hotspot-package' className="flex items-center w-full p-2
//                       text-black transition
//                       duration-75 rounded-lg  group gap-x-3 text-nowrap 
//                        dark:text-white "> 
//                         <SiPaloaltonetworks className='text-black'/>
//                       <p className='text-black'>Hotspot  Package</p></Link>
//                       </div>
//                   </motion.li>




// <motion.li
// onClick={() => {
//   if (window.innerWidth < 962) {
//     setSeeSideBar(true);
//   }
// }}
//  initial={{ opacity: 0, x: -20 }}
//  animate={{ opacity: 1, x: 0 }}
//  exit={{ opacity: 0, x: -20 }}
//  transition={{ duration: 0.2 , delay: 0.1 }}
// >

// <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-6 group text-black hover:bg-gray-700'>
// <Link  to='/admin/hotspot-templates' className="flex items-center w-full p-2 text-black transition
//                       duration-75 rounded-lg  group gap-x-3 text-nowrap 
//                        "> 
//                         <LuLayoutTemplate/>
//                       Hotspot  Templates</Link>
// </div>
//   </motion.li>




// <motion.li
// onClick={() => {
//   if (window.innerWidth < 962) {
//     setSeeSideBar(true);
//   }
// }}
//  initial={{ opacity: 0, x: -20 }}
//  animate={{ opacity: 1, x: 0 }}
//  exit={{ opacity: 0, x: -20 }}
//  transition={{ duration: 0.2 , delay: 0.1 }}
// >

// <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-6 group text-white hover:bg-gray-700'>
// <Link  to='/admin/template-assignment' className="flex items-center w-full p-2 text-white transition
//                       duration-75 rounded-lg  group gap-x-3 text-nowrap 
//                        dark:text-white "> 
//                         <LuLayoutTemplate classNme='text-yellow-600'/>
//                       Template Assignment</Link>
// </div>
//   </motion.li>

//                   <motion.li 
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.2 , delay: 0.3 }}
//                   >
//                     <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-6 group text-black hover:bg-gray-700'>
//                      <Link to='/admin/hotspot-subscriptions' className="flex items-center w-full p-2
//                       text-black
//                      transition duration-75 rounded-lg group 
//                      gap-x-3  ">
//                         🎫
//                       Vouchers</Link>
//                       </div>
//                   </motion.li>





//                   <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                    initial={{ opacity: 0, x: -20 }}
//                    animate={{ opacity: 1, x: 0 }}
//                    exit={{ opacity: 0, x: -20 }}
//                    transition={{ duration: 0.2 , delay: 0.4 }}
//                   >
//                      <Link to='/admin/hotspot_anlytics'  className="flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-6 group text-black hover:bg-gray-700  ">
//                         <WifiIcon/>
//                         Hotspot Overview</Link>
//                   </ motion.li>



//                   <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                    initial={{ opacity: 0, x: -20 }}
//                    animate={{ opacity: 1, x: 0 }}
//                    exit={{ opacity: 0, x: -20 }}
//                    transition={{ duration: 0.2 , delay: 0.4 }}
//                   >
//                      <Link to='/admin/hotspot_settings'  className="flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-6 group text-black hover:bg-gray-700">
//                         <MdSettingsInputAntenna/>
//                         Settings</Link>
//                   </ motion.li>
                    
//                     </ul>
//                    ): null}
                  



                  
//             </button>

// ):  <button   onClick={()=> {
//   setIsExpanded6(false)  
//           setIsExpanded7(false)
//           setIsExpanded5(false)
//           setIsExpanded4(false)
//           setIsExpanded2(false)
//           setIsExpanded1(false)
//           setIsExpanded3(!isExpanded3)
//            setIsExpanded(false)
// }} type="button" className="flex items-center w-full p-2 text-base
//              text-white transition duration-75 rounded-lg group 
//               dark:text-white dark:hover:bg-white dark:hover:text-black hover:bg-black " aria-controls="dropdown-example"
//                data-collapse-toggle="dropdown-example">
//                    <SignalWifi3BarIcon/>
//                    {!seeSidebar && <span className="flex-1 ms-3 text-left rtl:text-right
//                     whitespace-nowrap">Hotspot Bundle</span>}
//                      {isExpanded ? (
//                      <KeyboardArrowUpSharpIcon/>

//                    ):     <>  
                   
                    
//                     {!seeSidebar &&   < KeyboardArrowDownSharpIcon/>
// }

//                      </>
// }
//             </button>
// }




//             <motion.ul id="dropdown-example"
            
//             className={`py-1 space-y-1 `}
//         initial={{ opacity: 0, height: 0 }}
//         animate={{
//           opacity: isExpanded3 ? 1 : 0,
//           height: isExpanded3 ? "auto" : 0,
//         }}
//         transition={{ duration: 0.3, ease: "easeInOut" }}>
// <AnimatePresence>

// {isExpanded3 && (
//    <>






// <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                    initial={{ opacity: 0, x: -20 }}
//                    animate={{ opacity: 1, x: 0 }}
//                    exit={{ opacity: 0, x: -20 }}
//                    transition={{ duration: 0.2 , delay: 0.1 }}
//                   >
//                     <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-6 group
//                    text-white hover:bg-gray-700'>
//                      <Link  to='/admin/hotspot-dashboard' className="flex 
//                      items-center w-full p-2
//                       text-white transition
//                       duration-75 rounded-lg  group gap-x-3 text-nowrap 
//                        dark:text-white "> 
//                         <IoStatsChartOutline className='text-white '/>
//                       Hotspot  Dashboard</Link>
//                       </div>
//                   </motion.li>




// <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                    initial={{ opacity: 0, x: -20 }}
//                    animate={{ opacity: 1, x: 0 }}
//                    exit={{ opacity: 0, x: -20 }}
//                    transition={{ duration: 0.2 , delay: 0.1 }}
//                   >
//                     <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-6 group
//                    text-white hover:bg-gray-700'>


//                      <Link  to='/admin/hotspot-marketing-dashboard' className="
//                     flex 
//                      items-center  p-2
//                       text-white transition
//                       duration-75 rounded-lg  group gap-x-3 text-nowrap 
//                        dark:text-white "> 
//                         <TbHomeStats className=''/>
//                       Marketing Dashboard</Link>
//                       </div>
//                   </motion.li>




//                   <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                    initial={{ opacity: 0, x: -20 }}
//                    animate={{ opacity: 1, x: 0 }}
//                    exit={{ opacity: 0, x: -20 }}
//                    transition={{ duration: 0.2 , delay: 0.1 }}
//                   >
//                     <div className='flex items-center gap-x-4  p-2 
//                   transition duration-75 rounded-lg pl-6 group
//                    text-white hover:bg-gray-700'>
//                      <Link  to='/admin/hotspot-package' className="flex items-center w-full p-2 text-white transition
//                       duration-75 rounded-lg  group gap-x-3 text-nowrap 
//                        dark:text-white "> 
//                         <SiPaloaltonetworks className='text-white'/>
//                       Hotspot Package</Link>
//                       </div>
//                   </motion.li>




// <motion.li
// onClick={() => {
//   if (window.innerWidth < 962) {
//     setSeeSideBar(true);
//   }
// }}
//  initial={{ opacity: 0, x: -20 }}
//  animate={{ opacity: 1, x: 0 }}
//  exit={{ opacity: 0, x: -20 }}
//  transition={{ duration: 0.2 , delay: 0.1 }}
// >

// <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-6 group text-white hover:bg-gray-700'>
// <Link  to='/admin/hotspot-templates' className="flex items-center  p-2 text-white transition
//                       duration-75 rounded-lg  group gap-x-3 text-nowrap 
//                        dark:text-white "> 
//                         <LuLayoutTemplate/>
//                       Hotspot  Templates</Link>
// </div>
//   </motion.li>






// <motion.li
// onClick={() => {
//   if (window.innerWidth < 962) {
//     setSeeSideBar(true);
//   }
// }}
//  initial={{ opacity: 0, x: -20 }}
//  animate={{ opacity: 1, x: 0 }}
//  exit={{ opacity: 0, x: -20 }}
//  transition={{ duration: 0.2 , delay: 0.1 }}
// >

// <div className='flex items-center gap-x-4 w-full p-2 
//                   transition duration-75 rounded-lg pl-6 group text-white hover:bg-gray-700'>
// <Link  to='/admin/template-assignment' className="flex items-center p-2 text-white transition
//                       duration-75 rounded-lg  group gap-x-3 text-nowrap 
//                        dark:text-white "> 
//                         <LuLayoutTemplate classNme='text-yellow-500'/>
//                       Template Assignment</Link>
// </div>
//   </motion.li>
// {/* 
//                   <motion.li 
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.2 , delay: 0.2 }}
//                   className="flex  w-full p-2 text-white
//                      transition duration-75  rounded-lg  group  gap-x-3  dark:text-white
//                       ">
//                         <Groups2Icon/>
//                         Hotspot  Subscribers
//                   </motion.li> */}



//                   <motion.li 
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.2 , delay: 0.3 }}
//                   >
//                     <div className='flex items-center gap-x-4  p-2 
//                   transition duration-75 rounded-lg pl-6 group text-white
//                    hover:bg-gray-700'>
//                      <Link to='/admin/hotspot-subscriptions' className="flex 
//                      items-center p-2 text-white 
//                      transition duration-75 rounded-lg group 
//                       dark:text-white gap-x-3  ">
//                         🎫
//                       Vouchers</Link>
//                       </div>
//                   </motion.li>





//                   <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                    initial={{ opacity: 0, x: -20 }}
//                    animate={{ opacity: 1, x: 0 }}
//                    exit={{ opacity: 0, x: -20 }}
//                    transition={{ duration: 0.2 , delay: 0.4 }}
//                   >
//                      <Link to='/admin/hotspot_anlytics'  className="flex 
//                      items-center gap-x-3  p-2 
//                   transition duration-75 rounded-lg
//                    pl-8 group text-white hover:bg-gray-700  ">
//                         <WifiIcon/>
//                         Hotspot Overview</Link>
//                   </ motion.li>



//                   <motion.li
//                   onClick={() => {
//                     if (window.innerWidth < 962) {
//                       setSeeSideBar(true);
//                     }
//                   }}
//                    initial={{ opacity: 0, x: -20 }}
//                    animate={{ opacity: 1, x: 0 }}
//                    exit={{ opacity: 0, x: -20 }}
//                    transition={{ duration: 0.2 , delay: 0.4 }}
//                   >
//                      <Link to='/admin/hotspot_settings'  className="flex
//                       items-center gap-x-3 w-full p-2 
//                   transition duration-75 rounded-lg pl-8 group
//                    text-white hover:bg-gray-700">
//                         <MdSettingsInputAntenna/>
//                         Settings</Link>
//                   </ motion.li>

                 

                 

//    </>
// ) }

// </AnimatePresence>

//             </motion.ul>
//          </li>



      

// {seeSidebar ? (

//  <li  
 
//  onMouseEnter={()=> {
//   setShowMenu8(false)
//   setShowMenu9(false)
//   setShowMenu10(false)
//   setShowMenu11(false)
//   setShowMenu12(false)
//   setShowMenu7(true)
//   setShowMenu6(false)
//   setShowMenu5(false)
//   setShowMenu4(false)
//   setShowMenu3(false)
//   setShowMenu2(false)
//   setShowMenu1(false)

//  }}
//   type="button" className="flex items-center p-2 text-white
//              rounded-lg dark:text-white hover:cursor-pointer group
//              dark:hover:bg-white dark:hover:text-black hover:bg-black"
//                aria-controls="dropdown-example"
//                data-collapse-toggle="dropdown-example">
//    <FcOnlineSupport className='w-5 h-5'/>


// {showMenu7 ? (
// <ul 
// onMouseLeave={() => {
//   setShowMenu7(false)
// }}
// className="flex-1 ms-3 text-left rtl:text-right
//                    whitespace-nowrap bg-white text-black shadow-lg rounded-lg ">
                    
//                     <p className='text-center'>Support </p>
                   
//                    <li  
                  
                   
//                    onClick={()=> {
//   setIsExpanded3(false)
// setIsExpanded7(false)
//           setIsExpanded5(false)
//           setIsExpanded4(false)
//           setIsExpanded2(false)
//           setIsExpanded1(false)
//           setIsExpanded6(!isExpanded6)
//            setIsExpanded(false)
//                    }} type="button" className="flex
//                     items-center p-2 text-white
//              rounded-lg dark:text-white hover:cursor-pointer group
//              dark:hover:bg-white dark:hover:text-black hover:bg-black"
//                aria-controls="dropdown-example"
//                data-collapse-toggle="dropdown-example">
//    {/* < FcOnlineSupport className='w-5 h-5'/> */}

// {!seeSidebar &&    <span className="flex-1 ms-3 text-left rtl:text-right
//                    whitespace-nowrap">Support</span>}
                 
//             </li>



// <motion.li 
// onClick={() => {
//   if (window.innerWidth < 962) {
//     setSeeSideBar(true);
//   }
// }}
//                    initial={{ opacity: 0, x: -20 }}
//                    animate={{ opacity: 1, x: 0 }}
//                    exit={{ opacity: 0, x: -20 }}
//                    transition={{ duration: 0.2 , delay: 0.1 }}
//                   className='  space-x-2 
//                    text-white  rounded-lg p-2 ms-3 text-lg font-medium' >
//                   {/* <ion-icon name="logo-twitch" ></ion-icon> */}


// <div className='flex items-center gap-x-4  p-2 
//                   transition duration-75 rounded-lg pl-11 group
//                    text-white hover:bg-gray-700'>
//                      <Link to='/admin/customer-tickets' className='flex 
//                      items-center gap-x-2
//                       text-black'>
//                      <LuTicketsPlane className='w-5 h-5 text-yellow-500'/>

//                      Tickets
//                      </Link>
//                      </div>
//                   </motion.li>
//                    </ul>
// ): null}
      
//             </li>




// ):  <li   onClick={() =>{
//   setIsExpanded6(!isExpanded6)
//   setIsExpanded7(false)
//   setIsExpanded4(false)
//   setIsExpanded5(false)
//   setIsExpanded3(false)
//   setIsExpanded2(false)
//   setIsExpanded1(false)
//   setIsExpanded(false)
// }} type="button" className="flex items-center p-2 text-white
//              rounded-lg dark:text-white hover:cursor-pointer group
//              dark:hover:bg-white dark:hover:text-black hover:bg-black"
//                aria-controls="dropdown-example"
//                data-collapse-toggle="dropdown-example">
//                 {!seeSidebar &&    <FcOnlineSupport className='w-5 h-5'/>
// }

// {!seeSidebar &&    <span className="flex-1 ms-3 text-left rtl:text-right
//                    whitespace-nowrap">Support</span>}

//                  {isExpanded ? (
//                      <KeyboardArrowUpSharpIcon/>

//                    ):     <>  
                   
                    
//                     {!seeSidebar &&   < KeyboardArrowDownSharpIcon/>
// }

//                      </>
// }
                   
                
                 
//             </li>}

        

//                <motion.ul   
//               id="dropdown-example"
            
//               className={`py-1 space-y-1 `}
//           initial={{ opacity: 0, height: 0 }}
//           animate={{
//             opacity: isExpanded6 ? 1 : 0,
//             height: isExpanded6 ? "60px" : 0,
//           }}
//           transition={{ duration: 0.3, ease: "easeInOut" }}  
//              >


// <AnimatePresence>
//               {isExpanded6 && (
//                 <>

// <motion.li 
// onClick={() => {
//   if (window.innerWidth < 962) {
//     setSeeSideBar(true);
//   }
// }}
//                    initial={{ opacity: 0, x: -20 }}
//                    animate={{ opacity: 1, x: 0 }}
//                    exit={{ opacity: 0, x: -20 }}
//                    transition={{ duration: 0.2 , delay: 0.1 }}
//                   className='  space-x-2 
//                    text-white  rounded-lg p-2 ms-3 text-lg font-medium' >
//                   {/* <ion-icon name="logo-twitch" ></ion-icon> */}


// <div className='flex items-center gap-x-4 cursor-pointer
//                   transition duration-75 rounded-lg  group text-white '>
//                      <Link to='/admin/customer-tickets' className='flex
//                       items-center gap-x-2 text-white'>
//                      {!seeSidebar &&    <LuTicketsPlane className='w-5 
//                      h-5 text-yellow-500'/>}

// {!seeSidebar &&    <p>Tickets</p>}
                     
//                      </Link>
//                      </div>



//                   </motion.li>



                  
//                 </>
//               )}

// </AnimatePresence>

                 
//                </motion.ul>

        
// {seeSidebar ? (
//     <li  
    
//     onMouseEnter={() => {
//       setShowMenu12(false)
//       setShowMenu11(false)
//        setShowMenu10(false)
//       setShowMenu9(false)
//       setShowMenu8(true)
//       setShowMenu7(false)
//       setShowMenu6(false)
//       setShowMenu5(false)
//       setShowMenu4(false)
//        setShowMenu3(false)
//         setShowMenu2(false)
//          setShowMenu1(false)



//     }}
//     className="flex items-center p-2 text-white
//              rounded-lg dark:text-white hover:cursor-pointer group
//              dark:hover:bg-white dark:hover:text-black hover:bg-black"
//              >
            
//                <svg className="flex-shrink-0 w-5 h-5 text-white transition duration-75
//                  group-hover:dark:text-black  " 
//                 aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
//                  viewBox="0 0 20 18">
//                   <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 
//                   4 0 1 0 14 2Zm1 
//                   9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 
//                   0 1-1v-1a5.006 5.006 
//                   0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 
//                   0 0 0-5 5v2a1 1 
//                   0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
//                </svg>
//                {showMenu8 ? (
//                 <ul
//                 onMouseLeave={() => {
//                   setShowMenu8(false)
//                 }}
//                 className="flex-1 ms-3 whitespace-nowrap
//                 bg-white rounded-lg shadow-lg
//                 ">
                  
//                   <p className='text-black text-center roboto-condensed-bold'>Users </p>
                
// <motion.li 
// // onClick={() => {
// //   if (window.innerWidth < 962) {
// //     setSeeSideBar(true);
// //   }
// // }}
//  initial={{ opacity: 0, x: -20 }}
//  animate={{ opacity: 1, x: 0 }}
//  exit={{ opacity: 0, x: -20 }}
//  transition={{ duration: 0.2, delay: 0.1 }}
// className=' rounded-lg  space-x-2  text-white p-2 flex'>

//   <div className='flex items-center gap-x-4 w-full p-2 cursor-pointer
//                   transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
// <img src="/images/icons8-male-user.gif" className='rounded-full w-8 h-8' alt="user" />
//      <Link to='/admin/user'> User </Link>

// </div>
//       </motion.li>


//       <motion.li
//       // onClick={() => {
//       //   if (window.innerWidth < 962) {
//       //     setSeeSideBar(true);
//       //   }
//       // }}
//        initial={{ opacity: 0, x: -20 }}
//        animate={{ opacity: 1, x: 0 }}
//        exit={{ opacity: 0, x: -20 }}
//        transition={{ duration: 0.2, delay: 0.2 }}
//       className=' rounded-lg  text-white  space-x-3  p-2 flex'>

//         <div className='flex items-center gap-x-4 w-full p-2  cursor-pointer
//                   transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
//                     <Link to='/admin/user-group'>
//                     <LuUsers className='w-6 h-6' />
//       </Link>

//    <Link to='/admin/user-group'>
//       User Group
//       </Link>
//       </div>

//        </motion.li>
                
//                 </ul>

//                ): null}
              
//                  {isExpanded ? (
//                      <KeyboardArrowUpSharpIcon/>

//                    ):     <>  
                   
                    
//                     {!seeSidebar &&   < KeyboardArrowDownSharpIcon/>
// }

//                      </>
// }
            
//          </li>
// ):   <li    className="flex items-center p-2 text-white
//              rounded-lg dark:text-white hover:cursor-pointer group
//              dark:hover:bg-white dark:hover:text-black
//               hover:bg-black" onClick={()=> {
//                 setIsExpanded7(!isExpanded7)


//                 setIsExpanded3(false)
//           setIsExpanded5(false)
//           setIsExpanded4(false)
//           setIsExpanded2(false)
//           setIsExpanded1(false)
//           setIsExpanded6(false)
//            setIsExpanded(false)
//               }
//              }>
            
//                <svg className="flex-shrink-0 w-5 h-5 text-white transition duration-75
//                  group-hover:dark:text-black  " 
//                 aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
//                   <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 
//                   9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 
//                   0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 
//                   0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
//                </svg>
//                {!seeSidebar && <span className="flex-1 ms-3 whitespace-nowrap ">User</span>}
//                  {isExpanded ? (
//                      <KeyboardArrowUpSharpIcon/>

//                    ):     <>  
                   
                    
//                     {!seeSidebar &&   < KeyboardArrowDownSharpIcon/>
// }

//                      </>
// }
            
//          </li>}

       


// <motion.ul   id="dropdown-example"
//         className="py-1 space-y-1"
//         initial={{ opacity: 0, height: 0 }}
//         animate={{
//           opacity: isExpanded7 ? 1 : 0,
//           height: isExpanded7 ? "auto" : 0,
//         }}
//         transition={{ duration: 0.3, ease: "easeInOut" }} >
  


//       <AnimatePresence>
// {isExpanded7 && (
//    <>

// <motion.li 
// onClick={() => {
//   if (window.innerWidth < 962) {
//     setSeeSideBar(true);
//   }
// }}
//  initial={{ opacity: 0, x: -20 }}
//  animate={{ opacity: 1, x: 0 }}
//  exit={{ opacity: 0, x: -20 }}
//  transition={{ duration: 0.2, delay: 0.1 }}
// className=' rounded-lg  space-x-2  text-white p-2 flex'>

//   <Link
//   to='/admin/user'
//   className='flex items-center gap-x-4 w-full p-2 cursor-pointer
//                   transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
// <img src="/images/icons8-male-user.gif" className='rounded-full w-8 h-8' alt="user" />
//      User 

// </Link>
//       </motion.li>


//       <motion.li
//       onClick={() => {
//         if (window.innerWidth < 962) {
//           setSeeSideBar(true);
//         }
//       }}
//        initial={{ opacity: 0, x: -20 }}
//        animate={{ opacity: 1, x: 0 }}
//        exit={{ opacity: 0, x: -20 }}
//        transition={{ duration: 0.2, delay: 0.2 }}
//       className=' rounded-lg  text-white  space-x-3  p-2 flex'>

//         <Link to='/admin/user-group' className='flex items-center gap-x-4 w-full p-2  cursor-pointer
//                   transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
//       <img src="/images/icons8-people.gif" className='rounded-full w-8 h-8' alt="" />

//       User Group
//       </Link>

//        </motion.li>
//    </>
// )}
  
//        </AnimatePresence>

// </motion.ul>


        
// {seeSidebar ? (
//  <Link  to='/admin/invoice' className="flex items-center p-2 mt-6 text-white rounded-lg
//              dark:text-white hover:cursor-pointer translate-y-[-1.4rem]
//               dark:hover:bg-white dark:hover:text-black hover:bg-black  group">
           
//            <ReceiptIcon/>
//                {!seeSidebar &&  <span className="flex-1
//                  ms-3 whitespace-nowrap">Invoices</span>
//                }
//          </Link>


// ):  <Link

// onClick={() => {
//    setIsExpanded5(!isExpanded5)
//    setIsExpanded7(false)


//                 setIsExpanded3(false)
//           setIsExpanded5(false)
//           setIsExpanded4(false)
//           setIsExpanded2(false)
//           setIsExpanded1(false)
//           setIsExpanded6(false)
//            setIsExpanded(false)
// }}
// to='/admin/invoice'  className="flex items-center p-2 text-white rounded-lg
//              dark:text-white hover:cursor-pointer translate-y-[-1.4rem]
//               dark:hover:bg-white dark:hover:text-black
//                hover:bg-black  group mt-10">
           
//            <ReceiptIcon/>
//                {!seeSidebar &&<span className="flex-1 ms-3
               
//                whitespace-nowrap">Invoices</span> }

            
            
//          </Link>}
        
         



// {seeSidebar ? (
//     <Link
//     to='/admin/user-license'
//     onMouseEnter={() => {
//       setShowMenu10(true)
//       setShowMenu11(false)
//       setShowMenu12(false)
//       setShowMenu9(false)
//       setShowMenu8(false)
//       setShowMenu7(false)
//       setShowMenu6(false)
//       setShowMenu5(false)
//       setShowMenu4(false)
//       setShowMenu3(false)
//       setShowMenu2(false)
//       setShowMenu1(false)
//     }}
//          onClick={() => {
//           if (window.innerWidth < 962) {
//             setSeeSideBar(true);
//           }
//         }}
//          className='dark:hover:bg-white  p-2  flex items-center 
//              text-white rounded-lg dark:text-white   group dark:hover:text-black
             
//              cuursor-pointer
//              hover:bg-black'>


          
//                   <TbLicense className='w-6 h-6'/>
//                   {showMenu10 && <span 
//                   onMouseLeave={()=> {
//                     setShowMenu10(false)
//                   }}
//                   className="flex-1 ms-3 whitespace-nowrap bg-white rounded-lg *:
//                   text-black px-2 py-[-2px]
//                   ">Plan</span>}
//          </Link>





// ):   <Link

// to='/admin/user-license'
//          onClick={() => {
//            setIsExpanded7(false)


//                 setIsExpanded3(false)
//           setIsExpanded5(false)
//           setIsExpanded4(false)
//           setIsExpanded2(false)
//           setIsExpanded1(false)
//           setIsExpanded6(false)
//            setIsExpanded(false)
//           if (window.innerWidth < 962) {
//             setSeeSideBar(true);
            
//           }
//         }}
//          className='dark:hover:bg-white  p-2  flex items-center 
//              text-white rounded-lg dark:text-white   group dark:hover:text-black
             
//              cursor-pointer
//              hover:bg-black'>


            
//                   <TbLicense className='w-6 h-6'/>
//                   {!seeSidebar && <span className="flex-1 ms-3 whitespace-nowrap">Plan</span>}
//          </Link>

// }




// {seeSidebar ? (
//     <Link
//     to='/admin/client-leads'
//     onMouseEnter={() => {
//       setShowMenu10(true)
//       setShowMenu11(false)
//       setShowMenu12(false)
//       setShowMenu9(false)
//       setShowMenu8(false)
//       setShowMenu7(false)
//       setShowMenu6(false)
//       setShowMenu5(false)
//       setShowMenu4(false)
//       setShowMenu3(false)
//       setShowMenu2(false)
//       setShowMenu1(false)
//     }}
//          onClick={() => {
//           if (window.innerWidth < 962) {
//             setSeeSideBar(true);
//           }
//         }}
//          className='dark:hover:bg-white  p-2  flex items-center 
//              text-white rounded-lg dark:text-white   group dark:hover:text-black
             
//              cuursor-pointer
//              hover:bg-black'>


          
//                   <FaHandshake className='w-6 h-6'/>
//                   {showMenu10 && <span 
//                   onMouseLeave={()=> {
//                     setShowMenu10(false)
//                   }}
//                   className="flex-1 ms-3 whitespace-nowrap bg-white rounded-lg *:
//                   text-black px-2 py-[-2px]
//                   ">Leads</span>}
//          </Link>


// ):   

// <Link
// to='/admin/client-leads'
//          onClick={() => {
//           if (window.innerWidth < 962) {
//             setSeeSideBar(true);
//           }
//  setIsExpanded7(false)


//                 setIsExpanded3(false)
//           setIsExpanded5(false)
//           setIsExpanded4(false)
//           setIsExpanded2(false)
//           setIsExpanded1(false)
//           setIsExpanded6(false)
//            setIsExpanded(false)
          
//         }}
//          className='dark:hover:bg-white  p-2  flex items-center 
//              text-white rounded-lg dark:text-white   group dark:hover:text-black
             
//              cursor-pointer
//              hover:bg-black'>


            
//                   <FaHandshake className='w-6 h-6'/>
//                   {!seeSidebar && <span className="flex-1 ms-3 whitespace-nowrap">Leads</span>}
//          </Link>

// }











       

// {seeSidebar ? (
 
//   <Link
// to='/admin/scheduler'
// onMouseEnter={() => {
//       setShowMenu9(false)
//       setShowMenu10(false)
//       setShowMenu11(true)
//       setShowMenu12(false)
//       setShowMenu9(false)
//       setShowMenu8(false)
//       setShowMenu7(false)
//       setShowMenu6(false)
//       setShowMenu5(false)
//       setShowMenu4(false)
//       setShowMenu3(false)
//       setShowMenu2(false)
//       setShowMenu1(false)
//     }}
//          onClick={() => {
//           if (window.innerWidth < 962) {
//             setSeeSideBar(true);
//           }
//         }}
//          className='dark:hover:bg-white  p-2  flex items-center 
//              text-white rounded-lg dark:text-white   group dark:hover:text-black
             
//              cuursor-pointer
//              hover:bg-black'>


//                   <FaRegCalendarAlt  className='w-6 h-6'/>
//                    {showMenu11 && <span 
//                   onMouseLeave={()=> {
//                     setShowMenu11(false)
//                   }}
//                   className="flex-1 ms-3 whitespace-nowrap bg-white rounded-lg *:
//                   text-black px-2 py-[-2px]
//                   ">Events</span>}
//          </Link>



// ):

// <Link
// to='/admin/scheduler'
//          onClick={() => {
//           if (window.innerWidth < 962) {
//             setSeeSideBar(true);
//           }
//            setIsExpanded7(false)


//                 setIsExpanded3(false)
//           setIsExpanded5(false)
//           setIsExpanded4(false)
//           setIsExpanded2(false)
//           setIsExpanded1(false)
//           setIsExpanded6(false)
//            setIsExpanded(false)
//         }}
//          className='dark:hover:bg-white  p-2  flex items-center 
//              text-white rounded-lg dark:text-white   group dark:hover:text-black
             
//              cuursor-pointer
//              hover:bg-black'>


//                   <FaRegCalendarAlt  className='w-6 h-6'/>
//                   {!seeSidebar && <span className="flex-1 ms-3 whitespace-nowrap">Scheduler</span>}
//          </Link>}
 







// {seeSidebar ? (
 
//   <Link
// to='/admin/prevent-ddos'
// onMouseEnter={() => {
//       setShowMenu9(false)
//       setShowMenu10(false)
//       setShowMenu11(true)
//       setShowMenu12(false)
//       setShowMenu9(false)
//       setShowMenu8(false)
//       setShowMenu7(false)
//       setShowMenu6(false)
//       setShowMenu5(false)
//       setShowMenu4(false)
//       setShowMenu3(false)
//       setShowMenu2(false)
//       setShowMenu1(false)
//     }}
//          onClick={() => {
//           if (window.innerWidth < 962) {
//             setSeeSideBar(true);
//           }
//         }}
//          className='dark:hover:bg-white  p-2  flex items-center 
//              text-white rounded-lg dark:text-white   group dark:hover:text-black
             
//              cuursor-pointer
//              hover:bg-black'>


//                   <MdOutlineSecurity  className='w-6 h-6'/>
//                    {showMenu11 && <span 
//                   onMouseLeave={()=> {
//                     setShowMenu11(false)
//                   }}
//                   className="flex-1 ms-3 whitespace-nowrap bg-white rounded-lg *:
//                   text-black px-2 py-[-2px]
//                   ">DDOS</span>}
//          </Link>
// ): 


// <Link
// to='/admin/prevent-ddos'
//          onClick={() => {
//           if (window.innerWidth < 962) {
//             setSeeSideBar(true);
//           }

//            setIsExpanded7(false)


//                 setIsExpanded3(false)
//           setIsExpanded5(false)
//           setIsExpanded4(false)
//           setIsExpanded2(false)
//           setIsExpanded1(false)
//           setIsExpanded6(false)
//            setIsExpanded(false)
//         }}
//          className='dark:hover:bg-white  p-2  flex items-center 
//              text-white rounded-lg dark:text-white   group dark:hover:text-black
             
//              cursor-pointer
//              hover:bg-black'>


//                   <MdOutlineSecurity  className='w-6 h-6'/>
//                   {!seeSidebar && <span className="flex-1 ms-3 whitespace-nowrap">DDOS</span>}
//          </Link>}
 





// {seeSidebar ? (
 
//   <Link
//   to='/admin/equipment'

// onMouseEnter={() => {
//       setShowMenu9(false)
//       setShowMenu10(false)
//       setShowMenu11(false)
//       setShowMenu12(false)
//       setShowMenu13(true)
//       setShowMenu9(false)
//       setShowMenu8(false)
//       setShowMenu7(false)
//       setShowMenu6(false)
//       setShowMenu5(false)
//       setShowMenu4(false)
//       setShowMenu3(false)
//       setShowMenu2(false)
//       setShowMenu1(false)
//     }}
//          onClick={() => {
//           if (window.innerWidth < 962) {
//             setSeeSideBar(true);
//           }
//         }}
//          className='dark:hover:bg-white  p-2  flex items-center 
//              text-white rounded-lg dark:text-white   group dark:hover:text-black
             
//              cursor-pointer
//              hover:bg-black'>


//                   <MdDevices  className='w-6 h-6'/>
//                    {showMenu11 && <span 
//                   onMouseLeave={()=> {
//                     setShowMenu13(false)
//                   }}
//                   className="flex-1 ms-3 whitespace-nowrap bg-white rounded-lg *:
//                   text-black px-2 py-[-2px]
//                   ">Equipment</span>}
//          </Link>
// ): 


// <Link
// to='/admin/equipment'
//          onClick={() => {
//           if (window.innerWidth < 962) {
//             setSeeSideBar(true);
//           }

          

//            setIsExpanded7(false)
// // setIsExpanded9(false)

//                 setIsExpanded3(false)
//           setIsExpanded5(false)
//           setIsExpanded4(false)
//           setIsExpanded2(false)
//           setIsExpanded1(false)
//           setIsExpanded6(false)
//            setIsExpanded(false)
//         }}
//          className='dark:hover:bg-white  p-2  flex items-center 
//              text-white rounded-lg dark:text-white   group dark:hover:text-black
             
//              cursor-pointer
//              hover:bg-black'>


//                   <MdDevices  className='w-6 h-6'/>
//                   {!seeSidebar && <span className="flex-1 ms-3 whitespace-nowrap">Equipments</span>}
//          </Link>}










// {seeSidebar ? (
 
//   <Link
//   to='/admin/license'

// onMouseEnter={() => {
//       setShowMenu9(false)
//       setShowMenu10(false)
//       setShowMenu11(false)
//       setShowMenu12(false)
//       setShowMenu13(true)
//       setShowMenu9(false)
//       setShowMenu8(false)
//       setShowMenu7(false)
//       setShowMenu6(false)
//       setShowMenu5(false)
//       setShowMenu4(false)
//       setShowMenu3(false)
//       setShowMenu2(false)
//       setShowMenu1(false)
//     }}
//          onClick={() => {
//           if (window.innerWidth < 962) {
//             setSeeSideBar(true);
//           }
//         }}
//          className='dark:hover:bg-white  p-2  flex items-center 
//              text-white rounded-lg dark:text-white   group dark:hover:text-black
             
//              cursor-pointer
//              hover:bg-black'>


//                   <GrLicense  className='w-6 h-6'/>
//                    {showMenu11 && <span 
//                   onMouseLeave={()=> {
//                     setShowMenu13(false)
//                   }}
//                   className="flex-1 ms-3 whitespace-nowrap bg-white rounded-lg *:
//                   text-black px-2 py-[-2px]
//                   ">License</span>}
//          </Link>
// ): 


// <Link
// to='/admin/license'
//          onClick={() => {
          
//           if (window.innerWidth < 962) {
//             setSeeSideBar(true);
//           }

//            setIsExpanded7(false)
// // setIsExpanded9(false)

//                 setIsExpanded3(false)
//           setIsExpanded5(false)
//           setIsExpanded4(false)
//           setIsExpanded2(false)
//           setIsExpanded1(false)
//           setIsExpanded6(false)
//            setIsExpanded(false)
//         }}
//          className='dark:hover:bg-white  p-2  flex items-center 
//              text-white rounded-lg dark:text-white   group dark:hover:text-black
             
//              cursor-pointer
//              hover:bg-black'>


//                   <GrLicense  className='w-6 h-6'/>
//                   {!seeSidebar && <span className="flex-1 ms-3 whitespace-nowrap">License</span>}
//          </Link>}


// {seeSidebar ? (
// <Link
// to='/admin/settings'
// onMouseEnter={() => {
//       setShowMenu9(false)
//       setShowMenu10(false)
//       setShowMenu11(false)
//       setShowMenu12(true)
//       setShowMenu9(false)
//       setShowMenu8(false)
//       setShowMenu7(false)
//       setShowMenu6(false)
//       setShowMenu5(false)
//       setShowMenu4(false)
//       setShowMenu3(false)
//       setShowMenu2(false)
//       setShowMenu1(false)
//     }}
//          onClick={() => {
//           if (window.innerWidth < 962) {
//             setSeeSideBar(true);
//           }
//         }}
//          className='dark:hover:bg-white  p-2  flex items-center 
//              text-white rounded-lg dark:text-white   group dark:hover:text-black hover:bg-black'>
//                   <PermDataSettingIcon/>
//                    {showMenu12 && <span 
//                   onMouseLeave={()=> {
//                     setShowMenu12(false)
//                   }}
//                   className="flex-1 ms-3 whitespace-nowrap bg-white rounded-lg *:
//                   text-black px-2 py-[-2px]
//                   ">Settings</span>}
//          </Link>


// ):


// <Link
// to='/admin/settings'
//          onClick={() => {
//           if (window.innerWidth < 962) {
//             setSeeSideBar(true);
//           }

//            setIsExpanded7(false)


//                 setIsExpanded3(false)
//           setIsExpanded5(false)
//           setIsExpanded4(false)
//           setIsExpanded2(false)
//           setIsExpanded1(false)
//           setIsExpanded6(false)
//            setIsExpanded(false)
//         }}
//          className='dark:hover:bg-white  p-2  flex items-center 
//              text-white rounded-lg dark:text-white   group dark:hover:text-black hover:bg-black'>
//                   <PermDataSettingIcon/>
//                   {!seeSidebar && <span className="flex-1 ms-3 whitespace-nowrap">Settings</span>}
//          </Link>}
         
//       </ul>
//    </div>
// </aside>


//     </>

//   )
// }

// export default Sidebar





























import { useContext, useCallback, useEffect, useState } from 'react'
import { ApplicationContext } from '../context/ApplicationContext'
import { Link, useLocation } from 'react-router-dom'
import { useApplicationSettings } from '../settings/ApplicationSettings'
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";
import BarChartIcon from '@mui/icons-material/BarChart';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';

import CellTowerIcon from '@mui/icons-material/CellTower';
import PaymentsIcon from '@mui/icons-material/Payments';

import RouterIcon from '@mui/icons-material/Router';
import SensorsIcon from '@mui/icons-material/Sensors';
import WifiIcon from '@mui/icons-material/Wifi';
import SignalWifi3BarIcon from '@mui/icons-material/SignalWifi3Bar';
import PermDataSettingIcon from '@mui/icons-material/PermDataSetting';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import TextsmsSharpIcon from '@mui/icons-material/TextsmsSharp';
import WifiSharpIcon from '@mui/icons-material/WifiSharp';
import KeyboardArrowUpSharpIcon from '@mui/icons-material/KeyboardArrowUpSharp';
import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp';
import PaymentsSharpIcon from '@mui/icons-material/PaymentsSharp';
import AssessmentIcon from '@mui/icons-material/Assessment';
// React Icons
import {
  LuUsers,
  LuTicketsPlane,
  LuLayoutTemplate,
  FaUpload,
  FcOnlineSupport,
  MdSettingsInputAntenna,
  CgComponents,
  TbCloudNetwork,
  IoStatsChartOutline,
  SiPaloaltonetworks,
  FaHandshake,
  FaRegCalendarAlt,
  AiOutlineWhatsApp,
  PiNetworkSlashLight,
  TbLicense,
  CiMoneyCheck1,
  MdOutlineSecurity,
  MdMenuOpen,
  MdDevices,
  FaPhoneVolume,
  RiRouterLine,
  ImStatsDots,
  GrLicense,
  TbHomeStats
} from '../icons'; // Create an icons index file
import { FaRegMap } from "react-icons/fa";
import { ImStatsBars } from "react-icons/im";
import { CiSettings } from "react-icons/ci";
import { APP_VERSION, APP_DESCRIPTION } from '../version';
import { CiReceipt } from "react-icons/ci";
import {
  People as PeopleIcon,
  
} from '@mui/icons-material';
import { BsRouter } from "react-icons/bs";




const Sidebar = () => {
  const {
    isExpanded,
    setIsExpanded,
    seeSidebar,
    setSeeSideBar
  } = useContext(ApplicationContext);

  const { companySettings, setCompanySettings } = useApplicationSettings();
  const { company_name, logo_preview } = companySettings;
  const location = useLocation();
  const subdomain = window.location.hostname.split('.')[0];
  
  // Use a single state for all expanded menus
  const [expandedMenus, setExpandedMenus] = useState({
    dashboard: false,
    pppoe: false,
    network: false,
    finance: false,
    communication: false,
    hotspot: false,
    support: false,
    users: false
  });

  const [hoveredMenu, setHoveredMenu] = useState(null);

  // Menu items configuration
  const menuItems = {
    dashboard: {
      icon: <BarChartIcon />,
      label: "Dashboard",
      path: "/admin/admin-dashboard",
      subItems: [
        {
          icon: <ManageAccountsOutlinedIcon />,
          label: "Activity Logs",
          path: "/admin/admin-dashboard"
        },
        {
          icon: <img src="/images/icons8-increase.gif" className="rounded-full
           w-6 h-6" alt="Analytics" />,
          label: "Analytics",
          path: "/admin/analytics"
        },
        {
          icon: <CiMoneyCheck1 className="w-6 h-6" />,
          label: "Money Check",
          path: "/admin/finance-stats"
        }
      ]
    },
    pppoe: {
      icon: <WifiIcon />,
      label: "PPPoe",
      subItems: [
        {
          icon: <div className="bg-white rounded-full w-8 h-8 
          flex items-center justify-center">
            <span className="text-xs font-bold text-black">MBPS</span>
          </div>,
          label: "PPOE Packages",
          path: "/admin/pppoe-packages"
        },
        {
          icon: <img src="/images/icons8-person.gif" className="rounded-full w-8 h-8" alt="User" />,
          label: "PPOE Subscribers",
          path: "/admin/pppoe-subscribers"
        },
        {
          icon: <AssessmentIcon className="w-6 h-6 text-yellow-600" />,
          label: "Payment Analytics",
          path: "/admin/subscriber-payment-analytics"
        },
        {
          icon: <FaUpload className="w-6 h-6 text-blue-500" />,
          label: "Upload Subscribers",
          path: "/admin/upload-subscriber"
        }
      ]
    },
    network: {
      icon: <SensorsIcon />,
      label: "Network",
      subItems: [
        {
          icon: <img src="/images/icons8-map-pin.gif" className="w-6 h-6 rounded-full" alt="Nodes" />,
          label: "Nodes",
          path: "/admin/nodes"
        },
        {
          icon: <PiNetworkSlashLight className="w-6 h-6 text-yellow-600" />,
          label: "IP Pool",
          path: "/admin/ip-pool"
        },

 {
          icon: <PiNetworkSlashLight className="w-6 h-6
           text-blue-600" />,
          label: "VPN Tunnel",
          path: "/admin/private-network"
        },

        {
          icon: <RouterIcon  />,
          label: "Routers",
          path: "/admin/nas"
        },


        {

          icon: <TbCloudNetwork />,
          label: "Ip Networks",
          path: "/admin/ip_networks"

        },
        {
          icon: <RiRouterLine className="w-6 h-6 text-orange-500" />,
          label: "ONU",
          path: "/admin/devices"
        },

        {
          icon: < BsRouter />,
          label: "Access Points",
          path: "/admin/access-point"

        },
        {
          icon: <img src="/images/wireguard2.png" className="w-6 h-6 
          rounded-full" alt="Wireguard" />,
          label: "Wireguard",
          path: "/admin/networks-wireguard-config"
        }, 

        {
          icon: <FaRegMap />,
          label: "Map",
          path: "/admin/map"
        }
      ]
    },
    finance: {
      icon: <PaymentsIcon />,
      label: "Finance",
      subItems: [
        {
          icon: <AssessmentIcon />,
          label: "Finance Dashboard",
          path: "/admin/financial-dashboard"
        },
        {
          icon: <PaymentIcon />,
          label: "Hotspot Payments",
          path: "/admin/hotspot-payments"
        }, 

        {
          icon: <PaymentIcon />,
          label: "PpPoe Payments",
          path: "/admin/pppoe-payments"
        }
      ]
    },
    communication: {
      icon: <CellTowerIcon />,
      label: "Communication",
      subItems: [
        {
          icon: <MailOutlineIcon />,
          label: "Email",
          path: "/admin/email"
        },
        {
          icon: <TextsmsSharpIcon />,
          label: "SMS",
          path: "/admin/send-sms"
        },
 {
          icon: <TextsmsSharpIcon />,
          label: "Bulk",
          path: "/admin/bulk-messages"
        },

        {
          icon: <TextsmsSharpIcon />,
          label: "Messages",
          path: "/admin/messages"
        },
        {
          icon: <AiOutlineWhatsApp className="w-6 h-6 text-green-500" />,
          label: "WhatsApp",
          path: "/admin/whatsapp"
        }
      ]
    },
    hotspot: {
      icon: <SignalWifi3BarIcon />,
      label: "Hotspot Bundle",
      subItems: [
        {
          icon: <IoStatsChartOutline className="w-6 h-6" />,
          label: "Hotspot Dashboard",
          path: "/admin/hotspot-dashboard"
        },

        {
            icon: <TbHomeStats className=''/>,
            label: "Marketing",
            path: "/admin/hotspot-marketing-dashboard"

        },
        {
          icon: <SiPaloaltonetworks className="w-6 h-6" />,
          label: "Hotspot Package",
          path: "/admin/hotspot-package"
        },
        {
          icon: <LuTicketsPlane className="w-6 h-6 text-yellow-500" />,
          label: "Vouchers",
          path: "/admin/hotspot-subscriptions"
        }, 


        {
          icon: <LuLayoutTemplate />,
          label: "Templates",
          path: "/admin/hotspot-templates"
        },
        {
          icon: <ImStatsBars className="w-6 h-6 text-yellow-500" />,
          label: "Revenue",
          path: "/admin/hotspot_anlytics"
        }, 


      

        {
          icon: <CiSettings className="w-6 h-6 text-green-500" />,
          label: "Settings",
          path: "/admin/hotspot_settings"
        }
      ]
    },
    support: {
      icon: <FcOnlineSupport className="w-6 h-6" />,
      label: "Support",
      subItems: [
        {
          icon: <LuTicketsPlane className="w-6 h-6 text-yellow-500" />,
          label: "Tickets",
          path: "/admin/customer-tickets"
        }
      ]
    },
    users: {
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 18">
        <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
      </svg>,
      label: "Users",
      subItems: [
        {
          icon: <img src="/images/icons8-male-user.gif" className="w-6 h-6 rounded-full" alt="User" />,
          label: "Users",
          path: "/admin/user"
        },
        {
          icon: <LuUsers className="w-6 h-6" />,
          label: "User Groups",
          path: "/admin/user-group"
        },
          {
          icon: <PeopleIcon className="w-6 h-6 text-green-500" />,
          label: "Partners",
          path: "/admin/partners-management"
        },
      ]
    }
  };

  const quickLinks = [
    { icon: <ReceiptIcon />, label: "Invoices", path: "/admin/invoice" },
    // { icon: <TbLicense className="w-6 h-6" />, label: "Plan", path: "/admin/user-license" },
    { icon: <FaHandshake className="w-6 h-6" />, label: "Leads", path: "/admin/client-leads" },
    { icon: <FaRegCalendarAlt className="w-6 h-6" />, label: "Scheduler", path: "/admin/scheduler" },
    { icon: <MdOutlineSecurity className="w-6 h-6" />, label: "DDOS", path: "/admin/prevent-ddos" },
    { icon: <MdDevices className="w-6 h-6" />, label: "Equipment", path: "/admin/equipment" },
    { icon: <GrLicense className="w-6 h-6" />, label: "License", path: "/admin/license" },
    { icon: <PermDataSettingIcon />, label: "Settings", path: "/admin/settings" }
  ];

const toggleMenu = (menu) => {
  setExpandedMenus(prev => {
    // Create a new object with all menus set to false
    const newState = {
      dashboard: false,
      pppoe: false,
      network: false,
      finance: false,
      communication: false,
      hotspot: false,
      support: false,
      users: false
    };
    
    // If the clicked menu is currently closed, open it
    // If it's already open, this will close it (since all are set to false above)
    if (!prev[menu]) {
      newState[menu] = true;
    }
    
    return newState;
  });
};  
  // Collapse all menus
  const collapseAllMenus = () => {
    setExpandedMenus({
      dashboard: false,
      pppoe: false,
      network: false,
      finance: false,
      communication: false,
      hotspot: false,
      support: false,
      users: false
    });
  };

  // Check if current path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Handle resize effect
  useEffect(() => {
    const handleResize = () => {
      setSeeSideBar(window.innerWidth < 1080);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, [setSeeSideBar]);

  // Collapse sidebar on small screens when menu item clicked
  useEffect(() => {
    if (window.innerWidth < 1080 && seeSidebar) {
      collapseAllMenus();
    }
  }, [seeSidebar, location]);

  // Fetch company settings
  const handleGetCompanySettings = useCallback(async () => {
    try {
      const response = await fetch('/api/allow_get_company_settings', {
        method: 'GET',
        headers: { 'X-Subdomain': subdomain },
      });
      
      if (response.ok) {
        const newData = await response.json();
        setCompanySettings(prev => ({
          ...prev,
          ...newData,
          logo_preview: newData.logo_url
        }));
      }
    } catch (error) {
      toast.error('Internal server error while fetching company settings');
    }
  }, [subdomain, setCompanySettings]);

  useEffect(() => {
    handleGetCompanySettings();
  }, [handleGetCompanySettings]);

  // Render menu item
  const renderMenuItem = (menuKey) => {
    const menu = menuItems[menuKey];
    const isOpen = expandedMenus[menuKey];
    const isHovered = hoveredMenu === menuKey;

    return (
      <li key={menuKey} className="relative">
        {seeSidebar ? (
          // Collapsed sidebar view
          <div
            className={`flex items-center p-3 rounded-lg transition-all
               duration-300 cursor-pointer group ${
              isActive(menu.path) ? 'bg-teal-800' : 'hover:bg-teal-700'
            }`}
            onMouseEnter={() => setHoveredMenu(menuKey)}
            onMouseLeave={() => setHoveredMenu(null)}
            onClick={() => {
              if (menu.path) {
                window.innerWidth < 1080 && setSeeSideBar(true);
              }
            }}
          >
            <div className="flex items-center justify-center w-6 h-6">
              {menu.icon}
            </div>
            
            {/* Hover tooltip for collapsed sidebar */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="absolute left-full 
                  ml-2 top-1/2 -translate-y-1/2 bg-gray-900 
                  text-white px-3 py-2 rounded-md shadow-lg 
                  whitespace-nowrap z-50"
                >
                  {menu.label}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Submenu for collapsed sidebar */}
            {menu.subItems && isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="absolute left-full ml-2 top-0 bg-gray-900
                 text-white rounded-lg shadow-xl py-2 z-40 min-w-[200px]"
              >
                <div className="px-3 py-2 font-semibold border-b border-gray-700">
                  {menu.label}
                </div>
                {menu.subItems.map((subItem, idx) => (
                  <Link
                    key={idx}
                    to={subItem.path}
                    className="flex items-center gap-3 px-4 py-3
                     hover:bg-gray-800 transition-colors"
                    onClick={() => window.innerWidth < 1080 && setSeeSideBar(true)}
                  >
                    <span className="flex-shrink-0">{subItem.icon}</span>
                    <span>{subItem.label}</span>
                  </Link>
                ))}
              </motion.div>
            )}
          </div>
        ) : (
          
          // Expanded sidebar view
          <div className="space-y-1">
            <button
              onClick={() => menu.subItems ? toggleMenu(menuKey) : null}
              className={`flex items-center justify-between w-full p-3
                 rounded-lg transition-all duration-300 group ${
                isActive(menu.path) ? 'bg-teal-800' : 'hover:bg-teal-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0">{menu.icon}</span>
                <span>{menu.label}</span>
              </div>
              {menu.subItems && (
                <span className="transition-transform duration-300">
                  {isOpen ? <KeyboardArrowUpSharpIcon /> : <KeyboardArrowDownSharpIcon />}
                </span>
              )}
            </button>
            
            
            
            {/* Submenu for expanded sidebar */}
            {menu.subItems && (
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 pl-4 border-l border-teal-600 space-y-1">
                      {menu.subItems.map((subItem, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <Link
                            to={subItem.path}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                              isActive(subItem.path) ? 'bg-teal-800/50' : 'hover:bg-teal-700/50'
                            }`}
                            onClick={() => window.innerWidth < 1080 && setSeeSideBar(true)}
                          >
                            <span className="flex-shrink-0">{subItem.icon}</span>
                            <span>{subItem.label}</span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
                


              </AnimatePresence>
            )}
          </div>
        )}
      </li>
    );
  };

  return (
    <>
      <motion.aside
        id="sidebar"
        initial={false}
        animate={{
          width: seeSidebar ? "64px" : "240px"
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 h-screen bg-gradient-to-b
         from-teal-900 to-teal-950 shadow-2xl overflow-hidden
          flex flex-col text-white font-montserat z-50"
      >
        {/* Header */}
        <div className="p-4 border-b border-teal-700">
          <div className="flex items-center justify-between">
            {!seeSidebar ? (
              <>
                <div className="flex items-center gap-3">
                  <motion.img
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-12 w-12 rounded-full border-2 border-white"
                    src={logo_preview || "/images/aitechs.png"}
                    alt={company_name || "Aitechs"}
                    onError={(e) => { e.target.src = "/images/aitechs.png"; }}
                  />
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-bold text-white text-lg truncate"
                  >
                    {company_name || "Aitechs"}
                  </motion.span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setSeeSideBar(!seeSidebar);
                    collapseAllMenus();
                  }}
                  className="p-2 rounded-lg hover:bg-teal-800 
                  transition-colors"
                >
                  <MdMenuOpen className="w-8 h-8 text-white" />
                </motion.button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <motion.img
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="h-10 w-10 rounded-full border-2 border-white"
                  src={logo_preview || "/images/aitechs.png"}
                  alt={company_name || "Aitechs"}
                  onError={(e) => { e.target.src = "/images/aitechs.png"; }}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setSeeSideBar(!seeSidebar);
                    collapseAllMenus();
                  }}
                  className="p-2 rounded-lg hover:bg-teal-800 transition-colors"
                >
                  <MdMenuOpen className="w-8 h-8 text-white
                   rotate-180" />
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-2">
            {Object.keys(menuItems).map(renderMenuItem)}
          </ul>

          {/* Quick Links */}
          <div className={`mt-8 ${seeSidebar ? 'px-0' : 'px-2'}`}>
            {!seeSidebar && (
              <div className="text-xs uppercase text-teal-300 
              font-semibold mb-2 tracking-wider">
                Quick Links
              </div>
            )}
            <ul className="space-y-1">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.path}
                    className={`flex items-center gap-3 p-3 rounded-lg 
                      transition-all duration-300 group ${
                      seeSidebar ? 'justify-center' : ''
                    } ${
                      isActive(link.path) ? 'bg-teal-800' : 'hover:bg-teal-700'
                    }`}
                    onClick={() => window.innerWidth < 1080 && setSeeSideBar(true)}
                  >
                    <span className="flex-shrink-0">{link.icon}</span>
                    {!seeSidebar && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm"
                      >
                        {link.label}
                      </motion.span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Footer */}
        {!seeSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 border-t border-teal-700"
          >
            <div className="text-xs text-teal-300 text-center">
              <p>© {new Date().getFullYear()} {company_name || "Aitechs"}</p>
              <p className="mt-1 text-teal-400">{APP_VERSION}</p>
            </div>
          </motion.div>
        )}
      </motion.aside>

      {/* Backdrop for mobile */}
      {/* {seeSidebar && window.innerWidth < 1080 && (
        <div
          className="fixed inset-0  lg:hidden"
          onClick={() => setSeeSideBar(true)}
        />
      )} */}
    </>
  );
};

export default Sidebar;