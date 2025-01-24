
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Routes
} from "react-router-dom";


// import {ResetPassword} from './Auth/ResetPassword'
import {useState, useEffect, lazy, Suspense} from 'react'
import {ApplicationContext} from './context/ApplicationContext'
import UiLoader from './uiloader/UiLoader'
// import Signup from './Auth/Signup'
// import NotFound from './404/NotFound'
// import {InputOTPWithSeparator} from './Auth/InputOTPWithSeparator'
// import PrivateRoutes  from './private_routes/PrivateRoutes'
// import AdminDashboard from './admindashboard/AdminDashboard'
const AdminDashboard = lazy(()=> import ('./admindashboard/AdminDashboard'))
// import Sidebar from './sidebar/Sidebar'
// import Layout from './layout/Layout'
import {CableProvider} from './context/CableContext'
import { redirect } from "react-router-dom";

//  import PPPOEpackages from './packages/PPPOEpackages'

const PPPOEpackages = lazy(()=> import('./packages/PPPOEpackages'))
//  import HotspotPackage from './packages/HotspotPackage'
const HotspotPackage = lazy(()=> import('./packages/HotspotPackage'))
const AdminProfile = lazy(() => import('./profile/AdminProfile.jsx'))
 
//  import HotspotSubscriptions from './subscriptions/HotspotSubscriptions'

const HotspotSubscriptions = lazy(()=> import('./subscriptions/HotspotSubscriptions'))
// import EditPackage from './edit/EditPackage'

const EditPackage = lazy(()=> import('./edit/EditPackage'))
// import PPPOEsubscribers from './subscribers/PPPOEsubscribers'
const PPPOEsubscribers = lazy(()=> import('./subscribers/PPPOEsubscribers'))

// import FixedPayments from './payments/FixedPayments'
const FixedPayments = lazy(()=> import('./payments/FixedPayments'))

// import PPPOEsubscriptions from './subscriptions/PPPOEsubscriptions'
const PPPOEsubscriptions = lazy(()=> import('./subscriptions/PPPOEsubscriptions'))

// import Zones from './zones/Zones'
const Zones = lazy(()=> import('./zones/Zones'))

// import Nodes from './Node/Nodes'
const Nodes = lazy(()=> import('./Node/Nodes'))

// import User from './user/User'
const User = lazy(()=> import('./user/User'))

// import UserGroup from './user/UserGroup'
const UserGroup = lazy(()=> import('./user/UserGroup'))
// import Nas from './NAS_IDENTIFIER/Nas'
const Nas = lazy(()=> import('./NAS_IDENTIFIER/Nas'))
const HotspotPricing = lazy(()=> import('./pricing/HotspotPricing.jsx'))

// import Analytics from './analytics/Analytics'

const Analytics = lazy(()=> import('./analytics/Analytics'))
// import Hotspotanalytics from './analytics/HotspotAnalytics'
const Hotspotanalytics = lazy(()=> import('./analytics/HotspotAnalytics'))
// import Settings from './settings/Settings'
const Settings = lazy(()=> import('./settings/Settings'))
import {DatePicker} from './date-picker/Date'
import LocalizeDate from './date-picker/LocalizeDate'
// import Sms from './sms/Sms'
const Sms = lazy(()=> import('./sms/Sms'))
import ProtectAuth from './Auth/ProtectAuth'
import HotspotPayments from './payments/HotspotPayments'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import  ApplicationSettings from './settings/ApplicationSettings'
// import SignupNotification from './notification/SignupNotification'
const SignupNotification = lazy(()=> import('./notification/SignupNotification'))
import GeneralSettings from './settings/GeneralSettings'
// import HotspotLogin from './hotspot_page/HotspotLogin'
const HotspotLogin = lazy(()=> import('./hotspot_page/HotspotLogin'))
const PasskeySignin = lazy(()=> import('./Auth/PasskeySignin'))
const DashboardSytemAdmin = lazy(()=> import('./system_admin/DashBoardSystemAdmin'))


const ResetPassword = lazy(()=> import('./Auth/ResetPassword')
) 


const Signup = lazy(()=> import('./Auth/Signup')
)

const InputOTPWithSeparator = lazy(()=> import('./Auth/InputOTPWithSeparator')
)

const NotFound = lazy(()=> import('./404/NotFound')
)

const Layout = lazy(()=>  import('./layout/Layout')
)
const HotspotPage = lazy(() => import('./hotspot_page/HotspotPage'))


// const AdminDashboard = lazy(()=> import ('./admindashboard/AdminDashboard')
// )
const Sidebar = lazy(()=> import ('./sidebar/Sidebar')
 )

 const PasskeyList = lazy(()=> import ('./Auth/PasskeyList')
 )
 const SystemAdminLogin = lazy(()=> import ('./system_admin/SystemAdmin'))

 const ProtectAuthSystemAdmin = lazy(()=> import('./Auth/ProtectAuthSystemAdmin'))

 const SmsSent = lazy(()=> import('./system_admin/SmsSent'))

// const PPPOEpackages = lazy(()=> import('./packages/PPPOEpackages')
// )

// const PPPOEsubscribers = lazy(()=> import('./subscribers/PPPOEsubscribers')
// )

// const FixedPayments = lazy(()=> import('./payments/FixedPayments')
// )

// const  PPPOEsubscriptions = lazy(()=> import('./subscriptions/PPPOEsubscriptions')
// )

// const EditPackage = lazy(()=> import('./edit/EditPackage'))


// const HotspotPayments = lazy(()=> import('./payments/HotspotPayments')
// )



// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <>
//       <Route index path='/'  element={<Signup/>}/>
//       <Route  path='/reset-password' element={<ResetPassword/>}/>
//       <Route  path='/hotspot-page' element={<HotspotPage/>}/>
//       <Route  path='/hotspot-login' element={<HotspotLogin/>}/>
//     <Route path='/system-admin-login' element={<SystemAdminLogin/>}/>
//     <Route path='/sms-sent' element={<SmsSent/>}/>   

// <Route element={<ProtectAuthSystemAdmin  />}>
//     <Route path='/system-admin-dashboard' element={<DashboardSytemAdmin/>}/> 


//     </Route>  

  
// {/* 
// <Route path='/admin-dashboard' element={<PrivateRoutes>
//   <AdminDashboard/>
// </PrivateRoutes>}>
// </Route> */}
// <Route element={<ProtectAuth />}>
// {/* <ProtectAuth> <Layout/> </ProtectAuth> */}
// <Route  path='/admin'  element={ 
//       <Layout/> 
// }>

  
// <Route path='/admin/date' element={<DatePicker/>}/>
// <Route 
//  path='/admin/admin-dashboard' element={  <AdminDashboard/>
// }/>
// <Route/>
// <Route path='/admin/side-bar' element={<Sidebar/>}/> 
// <Route path='/admin/profile' element={<AdminProfile/>}/>
// <Route path='/admin/pppoe-packages' element={< PPPOEpackages/>}/>
// <Route path='/admin/pppoe-subscribers' element={< PPPOEsubscribers/>}/>
// <Route path='/admin/fixed-payments' element={<FixedPayments/>}/>
// <Route path='/admin/edit-package' element={<EditPackage/>}/>
// <Route path='/admin/pppoe-subscriptions' element={<PPPOEsubscriptions/>}/>
// <Route path='/admin/hotspot-payments' element={<HotspotPayments/>}/>
// <Route  path='/admin/hotspot-package' element={<HotspotPackage/>}/>
// <Route  path='/admin/hotspot-subscriptions' element={<HotspotSubscriptions/>}/>
// <Route path='/admin/sms' element={<Sms/>}/>
// <Route path='/admin/zones' element={<Zones/>}/>
// <Route path='/admin/nodes' element={<Nodes/>}/>
// <Route path='/admin/user' element={<User/>}/>
// <Route path='/admin/user-group' element={<UserGroup/>}/>
// <Route path='/admin/analytics' element={<Analytics/>}/>
// <Route path='/admin/hotspot_anlytics' element={<Hotspotanalytics/>}/>
// <Route path='/admin/settings' element={<Settings/>}/>
// <Route path='/admin/date' element={<DatePicker/>}></Route>
// <Route path='/admin/nas' element={<Nas/>}/>
// <Route path='/admin/passkeys' element={<PasskeyList/>}/>
// </Route>

// </Route >

//       <Route  path='/signin' element={<InputOTPWithSeparator/>}/>
//       <Route  path='/passkey-signin' element={<PasskeySignin/>}/>
      
//      <Route path="*" element={<NotFound />}/>

//       </>
      

//   )
// )




const App = ({client}) => {

  const [isSeen, setIsSeen] = useState(true)
  const [showErrors, setShowErrors] = useState(false)
  const [isPassword, setPassword] = useState('')
const [email, setEmail] = useState('')
const [passwordConfirmation, setPasswordConfirmation] = useState('')
const [errorData, setErroraData] = useState([])
const [loading, setloading] = useState(false)
const [seeSidebar, setSeeSideBar] = useState(false)
const [logout, setLogout] = useState('') 
const [user, setCurrentUser] = useState('')
const [theme, setTheme] = useState('light')
const [offlineError, setOfflineError] = useState(false)
const [open, setOpen] = useState(false)
const [username, setUsername] = useState('')
const [preferDarkMode, setPreferDarkMode] = useState(true)
const [openSignupNotification, setOpenNotification] = useState(false);

// const mysubdomain = 'fiber8.aitechs.co.ke'
// const s = mysubdomain.split('.')[0]

const subdomain = window.location.hostname.split('.')[1]

const domain = window.location.hostname.split('.')[0]
console.log('subdomain',subdomain)
const handleClose = () => {
  setOpenNotification(false);
};




const formData = {
  password_confirmation: passwordConfirmation,
    email: email,
    password: isPassword,
    username: username
}



const defaultMaterialTheme = createTheme({
  props: {
    MuiInputLabel: {
        shrink: true
     }
},
  palette: {
  
    
    mode: preferDarkMode ? 'dark' : 'light' ,
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '000000',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },

  },

});
const [materialuitheme, setMaterialuiTheme] = 
useState(createTheme(defaultMaterialTheme));
const [isExpanded, setIsExpanded] = useState(false)
const [isExpanded1, setIsExpanded1] = useState(false)
const [isExpanded2, setIsExpanded2] = useState(false)
const [isExpanded3, setIsExpanded3] = useState(false)
const [isExpanded4, setIsExpanded4] = useState(false)
const [isExpanded5, setIsExpanded5] = useState(false)

const [isExpanded6, setIsExpanded6] = useState(false)
const [isExpanded7, setIsExpanded7] = useState(false)
const [isExpanded8, setIsExpanded8] = useState(false)

// const isLogedIn = window.localStorage.getItem('user')
// const [formData, setFormData] = useState({
//   passwordConfirmation: '',
//   email: '',
//   isPassword: ''
// })

// const handleChange = (e) => {
// setFormData({
//   ...formData,
//   [e.target.id]: e.target.value
// })
// }

useEffect(() => {
  const theme = localStorage.getItem('theme') 
 if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  if (theme === 'dark') {
    setTheme('dark')
    setMaterialuiTheme(darkTheme)
  } else{
    if (theme === 'light') {
      setTheme('light')
      setMaterialuiTheme(lightTheme)
    }
  }

 } 
}, []);



// useEffect(() => {
//   const intervalId = setTimeout(() => {
//     setShowLoader(false); // Hide the loader after the interval
//   }, 5);

//   // Clear the interval when the component unmounts
//   return () => clearInterval(intervalId);
// }, []);


useEffect(() => {
if (theme === 'dark') {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')

}
}, [theme]);


const handleThemeSwitch = () => {
  localStorage.setItem('theme', theme === 'dark' ? 'light' : 'dark');
  setTheme(theme === 'dark' ? 'light' : 'dark')
  setMaterialuiTheme(theme === 'dark' ? lightTheme : darkTheme);
}

const handleLogout = async () => {
  const response = await fetch('/logout', {
    method: "DELETE"
  })
  if (response.ok) {
    setLogout('')
  } else {
    setLogout('sth went wrong!!')
  }
}




const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 9000);

const handleSignUp = async (e) => {
 

  e.preventDefault()
  
try {
  setShowErrors(false)
  setOfflineError(false)
  setloading(true)


  const users = await fetch('api/sign_up', {
    method: "POST",
    headers: {

      "Content-Type": "application/json",
    }, 
    credentials: 'include', // Include cookies in the request
    signal: controller.signal,  


    body: JSON.stringify(formData),

  },



  )
  clearTimeout(id);

  setloading(false)

  setShowErrors(false)


  let  actualUserDataInJson = await users.json()

  if (users.status === 401) {
    setOfflineError(false)

  }
  if (users.ok) {
    // const actualUserDataInJson = await users.json
  
    setShowErrors(false)
    setOpenNotification(true);

    setloading(false)
    setOfflineError(false)

// return redirect('/signin')
    // localStorage.setItem("jwt", actualUserDataInJson.jwt);
    // console.log(actualUserDataInJson)

  } else {
    setErroraData(actualUserDataInJson.errors)
    setShowErrors(true)
    setloading(false)
    setOpenNotification(false);

  }
} catch (error) {
  console.log(error.name === 'AbortError');
  setloading(false);
  setOpenNotification(false);

  setOfflineError(true)
  setOfflineError(true);


  setTimeout(() => {
    setOfflineError(false)
  }, 8000);
}
}










const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
  components: {
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',  // Background color for the entire DataGrid
          color: 'black',  // Text color for the entire DataGrid
        },
        columnHeaders: {
          backgroundColor: 'lightgray',  // Background color for the header
          color: 'black',  // Text color for the header
        },
        cell: {
          backgroundColor: 'white',  // Background color for the cells
          color: 'black',  // Text color for the cells
        },
        footerContainer: {
          backgroundColor: 'white',  // Background color for the footer
          color: 'black',  // Text color for the footer
        },
      },
    },
  },
});




const darkTheme = createTheme({
  palette: {
      mode: 'dark',
    },
    components: {
      MuiTable: {
        styleOverrides: {
          root: {
            backgroundColor:'black',  // Background color for the entire DataGrid
            color: 'white',  // Text color for the entire DataGrid
          },
          columnHeaders: {
            backgroundColor: 'black',  // Background color for the header
            color: 'white',  // Text color for the header
          },
          cell: {
            backgroundColor: 'black',  // Background color for the cells
            color: 'white',  // Text color for the cells
          },
          footerContainer: {
            backgroundColor: 'white',  // Background color for the footer
            color: 'white',  // Text color for the footer
          },
        },
      },
    },
 
});




  return (
    <main>
<SignupNotification  openSignupNotification={ openSignupNotification} handleClose={handleClose} />
          <ThemeProvider theme={materialuitheme}>

      <Suspense fallback={<div className='flex justify-center items-center '>{ <UiLoader/> }</div>}>
      < LocalizeDate  >
      <CableProvider>
        
        
      <ApplicationSettings>
 <ApplicationContext.Provider value={{isSeen, setIsSeen,isPassword, setPassword,
   email, setEmail, passwordConfirmation, setPasswordConfirmation, errorData, showErrors, handleSignUp, loading,
   isExpanded, setIsExpanded, isExpanded1, setIsExpanded1, isExpanded2, setIsExpanded2,
   isExpanded3, setIsExpanded3, isExpanded4, setIsExpanded4, isExpanded5, setIsExpanded5, seeSidebar, setSeeSideBar,
   logout,handleLogout , user, setCurrentUser, theme, setTheme,  handleThemeSwitch
   , setOfflineError, offlineError, open, setOpen, username, setUsername, setPreferDarkMode , preferDarkMode,
   isExpanded6, setIsExpanded6, isExpanded7, setIsExpanded7, isExpanded8, setIsExpanded8, client,
   materialuitheme, setMaterialuiTheme
    }}>

{/* <GeneralSettings> */}
{/* <RouterProvider router={router} /> */}
{/* </GeneralSettings> */}

<Routes>
{domain === 'aitechs'  ?  (
  <Route index path='/'  element={<Signup/>}/>
): null}

{/* <Route index path='/'  element={<Signup/>}/> */}


      <Route  path='/reset-password' element={<ResetPassword/>}/>
      <Route  path='/hotspot-page' element={<HotspotPage/>}/>
      <Route  path='/hotspot-login' element={<HotspotLogin/>}/>
      <Route  path='/hotspot-pricing' element={< HotspotPricing />}/>
    <Route path='/system-admin-login' element={<SystemAdminLogin/>}/>
    <Route path='/sms-sent' element={<SmsSent/>}/>   

<Route element={<ProtectAuthSystemAdmin  />}>
    <Route path='/system-admin-dashboard' element={<DashboardSytemAdmin/>}/> 


    </Route>  

  
{/* 
<Route path='/admin-dashboard' element={<PrivateRoutes>
  <AdminDashboard/>
</PrivateRoutes>}>
</Route> */}
<Route element={<ProtectAuth />}>
{/* <ProtectAuth> <Layout/> </ProtectAuth> */}
<Route  path='/admin'  element={ 
      <Layout/> 
}>

  
<Route path='/admin/date' element={<DatePicker/>}/>
<Route 
 path='/admin/admin-dashboard' element={  <AdminDashboard/>
}/>
<Route/>
<Route path='/admin/side-bar' element={<Sidebar/>}/> 
<Route path='/admin/profile' element={<AdminProfile/>}/>
<Route path='/admin/pppoe-packages' element={< PPPOEpackages/>}/>
<Route path='/admin/pppoe-subscribers' element={< PPPOEsubscribers/>}/>
<Route path='/admin/fixed-payments' element={<FixedPayments/>}/>
<Route path='/admin/edit-package' element={<EditPackage/>}/>
<Route path='/admin/pppoe-subscriptions' element={<PPPOEsubscriptions/>}/>
<Route path='/admin/hotspot-payments' element={<HotspotPayments/>}/>
<Route  path='/admin/hotspot-package' element={<HotspotPackage/>}/>
<Route  path='/admin/hotspot-subscriptions' element={<HotspotSubscriptions/>}/>
<Route path='/admin/sms' element={<Sms/>}/>
<Route path='/admin/zones' element={<Zones/>}/>
<Route path='/admin/nodes' element={<Nodes/>}/>
<Route path='/admin/user' element={<User/>}/>
<Route path='/admin/user-group' element={<UserGroup/>}/>
<Route path='/admin/analytics' element={<Analytics/>}/>
<Route path='/admin/hotspot_anlytics' element={<Hotspotanalytics/>}/>
<Route path='/admin/settings' element={<Settings/>}/>
<Route path='/admin/date' element={<DatePicker/>}></Route>
<Route path='/admin/nas' element={<Nas/>}/>
<Route path='/admin/passkeys' element={<PasskeyList/>}/>
</Route>

</Route >

      <Route  path='/signin' element={<InputOTPWithSeparator/>}/>
      <Route  path='/passkey-signin' element={<PasskeySignin/>}/>
      
     <Route path="*" element={<NotFound />}/>
</Routes>

</ApplicationContext.Provider>
</ ApplicationSettings>

      </CableProvider>
</ LocalizeDate  >
</Suspense>
</ThemeProvider>
    </main>
  )
}

export default App





