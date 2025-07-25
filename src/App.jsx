
import {
 
  Route,
  Routes
} from "react-router-dom";


import {useState, useEffect, lazy, Suspense, useCallback} from 'react'
import {ApplicationContext} from './context/ApplicationContext'
import UiLoader from './uiloader/UiLoader'

const AdminDashboard = lazy(()=> import ('./admindashboard/AdminDashboard'))

import {CableProvider} from './context/CableContext'

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
const HotspotSettings = lazy(()=> import('./settings/HotspotSettings'))

import ProtectAuth from './Auth/ProtectAuth'
import HotspotPayments from './payments/HotspotPayments'
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import SignupNotification from './notification/SignupNotification'
const SignupNotification = lazy(()=> import('./notification/SignupNotification'))
// import HotspotLogin from './hotspot_page/HotspotLogin'
const HotspotLogin = lazy(()=> import('./hotspot_page/HotspotLogin'))
const PasskeySignin = lazy(()=> import('./Auth/PasskeySignin'))
const DashboardSytemAdmin = lazy(()=> import('./system_admin/DashBoardSystemAdmin'))
const IpPoolTable = lazy(() => import('./ip_pool/IpPoolTable'))

const ResetPassword = lazy(()=> import('./Auth/ResetPassword')
) 


const Signup = lazy(()=> import('./Auth/Signup')
)

const InputOTPWithSeparator = lazy(()=> import('./Auth/InputOTPWithSeparator')
)

const NotFound = lazy(()=> import('./404/NotFound')
)

const RouterStatistics = lazy(() => import('./analytics/RouterStatistics'))
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
 const HotspotTrial = lazy(()=> import('./hotspot_page/HotspotTrial'))
 const EmailSent = lazy(()=> import('./system_admin/EmailSent'))
 const HowDidYouHear = lazy(()=> import('./how/HowDidYouHear'))

 const UploadSubscriber = lazy(() => import('./upload_subscriber/UploadSubscriber') )
 const IpPool = lazy(() => import('./ip_pool/IpPool') )
const TodayRegisteredSubscribers = lazy(() => import('./subscribers/TodayRegisteredSubscribers') )
const ThisWeekRegisteredSubscribers = lazy(() => import('./subscribers/ThisWeekRegisteredSubscribers') )
const ThisMonthRegisteredSubscribers = lazy(() => import('./subscribers/ThisMonthRegisteredSubscribers') )

const CustomerTickets = lazy(() => import('./tickets/CustomerTickets') )
const AccountLocked = lazy(()=> import('./account_locked/AccountLocked'))
const Calendar = lazy(() => import('./calendar/Calendar'))
import {Helmet} from "react-helmet";
import {useApplicationSettings} from './settings/ApplicationSettings'


 const PPPoEPackages = lazy(() => import('./wifi_page/PPPoEPackages') )
const HotspotTemplates = lazy(() => import('./hotspot_templates/HotspotTemplates') )
const HotspotDashboard = lazy(() => import('./hotspot_page/HotspotDashboard.jsx') )
import ClientLogin from './client_portal/ClientLogin'
import ClientPortal from './client_portal/ClientPortal'
import NetworkComponents from './settings/NetworkComponents'
import ConfirmResetPassword from './Auth/ConfirmResetPassword'
import PasswordResetEmailSent from './Auth/PasswordResetEmailSent'
import SendSms from './sms/SendSms'
import  AllMessages from './sms/AllMessages'
import BulkMessage from './sms/BulkMessage'
import WireguardConfigForm from './wireguard/WireguardConfigForm'
import IpNetworks from './wireguard/IpNetworks'
import ServiceExpired from './service_expired/ServiceExpired'
import LicenseExpired from './license_expired/LicenseExpired'
const GoogleAuthenticatorSetup = lazy(() => import('./Auth/GoogleAuth'))
const TwoFactorAuthVerification = lazy(() => import('./Auth/TwoFactorAuth'))
const ContactUs = lazy(() => import('./contact_us/ContactUs'))
const ClientLead = lazy(() => import('./client_lead/ClientLead'))
import {onMessage, messaging,} from './firebase/firebase';
const PrivateNetwork = lazy(() => import('./network/PrivateNetwork'))
const ProtectAuthClient = lazy(() => import('./Auth/ProtectAuthClient'))
const QrCodeDisplay = lazy(() => import('./qr_code/QrCodeDisplay'))
const RouterDetails = lazy(() => import('./router_details/RouterDetails'))
import { block } from 'million/react';



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

const subdomain = window.location.hostname.split('.')[0]



const {companySettings, setCompanySettings,
   showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
      showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
       showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
        showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,

} = useApplicationSettings()
const {logo_preview} = companySettings
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
  
    setShowErrors(false)
    setOpenNotification(true);

    setloading(false)
    setOfflineError(false)

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






const handleGetCompanySettings = useCallback(
  async() => {
    try {
      const response = await fetch('/api/allow_get_company_settings', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
      const newData = await response.json()
      if (response.ok) {
        const { contact_info, company_name, email_info, logo_url,
          customer_support_phone_number,agent_email ,customer_support_email
         } = newData
         console.log(logo_url)

        setCompanySettings((prevData)=> ({...prevData, 
          contact_info, company_name, email_info,
          customer_support_phone_number,agent_email ,customer_support_email,
        
          logo_preview: logo_url
        }))

        console.log('company settings fetched', newData)
      }else{
        console.log('failed to fetch company settings')
      }
    } catch (error) {
 console.log(error)   
    }
  },
  [],
)

useEffect(() => {
  
  handleGetCompanySettings()
  
}, [handleGetCompanySettings])

const hostname = window.location.hostname;




   onMessage(messaging, (payload) => {
    const { title, body, image} = payload.notification;
    if (title|| body || image) {
      const audio = new Audio('/751326__robinhood76__13129-mystery-cash-bonus.wav')
      audio.play();
    }
    if (Notification.permission === 'granted') {
    
      new Notification(title, {

        
      body,
        icon: image, // Use the image URL as the icon
      });

     
    }
    
    console.log('Message received:', payload);
  });

  return (
    <main>



<Helmet>
                <meta charSet="utf-8" />
                <link rel="icon" type="image/svg+xml" href={logo_preview} 
                onError={(e) => { e.target.src = "/images/aitechs.png"; }}
                />

            </Helmet>



<SignupNotification  openSignupNotification={openSignupNotification} handleClose={handleClose} />
          <ThemeProvider theme={materialuitheme}>

      <Suspense fallback={<div className='flex justify-center items-center '>{ <UiLoader/> }</div>}>
      <LocalizeDate>
      <CableProvider>
        
        
 <ApplicationContext.Provider value={{isSeen, setIsSeen,isPassword, setPassword,
   email, setEmail, passwordConfirmation, setPasswordConfirmation, errorData, showErrors, handleSignUp, loading,
   isExpanded, setIsExpanded, isExpanded1, setIsExpanded1, isExpanded2, setIsExpanded2,
   isExpanded3, setIsExpanded3, isExpanded4, setIsExpanded4, isExpanded5, setIsExpanded5, seeSidebar, setSeeSideBar,
   logout,handleLogout , user, setCurrentUser, theme, setTheme,  handleThemeSwitch
   , setOfflineError, offlineError, open, setOpen, username, setUsername, setPreferDarkMode , preferDarkMode,
   isExpanded6, setIsExpanded6, isExpanded7, setIsExpanded7, isExpanded8, setIsExpanded8, client,
   materialuitheme, setMaterialuiTheme
    }}>


<div>
<Routes>
{/* 
<Route index path='/' element={<PPPoEPackages/>}/>

hostname.endsWith('.aitechs.co.ke')
  
{domain === 'localhost'  ?  (
  <Route index path='/'  element={<Signup/>}/>
): null}    */}


{/* aitechs.co.ke */}

{hostname === 'aitechs.co.ke' ? (
      <Route index path="/" element={<Signup />} />
    ) : hostname.endsWith('.aitechs.co.ke') ? (
      <Route index path="/" element={<PPPoEPackages />} />
    ) : null}

{/* <Route index path='/'  element={<Signup/>}/> */}


      <Route  path='/reset-password' element={<ResetPassword/>}/>
      <Route path='/confirm-reset-password' element={<ConfirmResetPassword />}/>
      <Route path='/reset-password-email-sent' element={<PasswordResetEmailSent />}/>
      <Route  path='/hotspot-page' element={<HotspotPage/>}/>
      <Route  path='/hotspot-login' element={<HotspotLogin/>}/>
      <Route  path='/hotspot-trial' element={< HotspotTrial />}/>
      <Route  path='/hotspot-pricing' element={< HotspotPricing />}/>
    <Route path='/system-admin-login' element={<SystemAdminLogin/>}/>
    <Route path='/sms-sent' element={<SmsSent/>}/>
    <Route path='/email-sent' element={<EmailSent/>}/>
    <Route path='/how-did-you-hear' element={<HowDidYouHear/>}/>
    <Route path='/account-locked' element={<AccountLocked/>}/>
    <Route path='/service-expired' element={<ServiceExpired/>}/>
    <Route  path='/license-expired' element={<LicenseExpired/>}/>
    <Route path='/two-factor-auth' element={<TwoFactorAuthVerification/>}/>
    <Route path='/contact-us' element={<ContactUs/>}/>

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
<Route path='/admin/router-stats' element={<RouterStatistics/>}/>
<Route path='/admin/send-sms' element={<SendSms/>}/>
<Route path='/admin/profile' element={<AdminProfile/>}/>
<Route path='/admin/pppoe-packages' element={< PPPOEpackages/>}/>
<Route path='/admin/pppoe-subscribers' element={< PPPOEsubscribers/>}/>
<Route path='/admin/today-subscribers' element={<TodayRegisteredSubscribers/>}/>

<Route path='/admin/this-month-subscribers' element={<ThisMonthRegisteredSubscribers/>}/>


<Route path='/admin/this-week-subscribers' element={<ThisWeekRegisteredSubscribers/>}/>
<Route path='/admin/fixed-payments' element={<FixedPayments/>}/>
<Route path='/admin/edit-package' element={<EditPackage/>}/>
<Route path='/admin/pppoe-subscriptions' element={<PPPOEsubscriptions/>}/>
<Route path='/admin/hotspot-payments' element={<HotspotPayments/>}/>
<Route  path='/admin/hotspot-package' element={<HotspotPackage/>}/>
<Route  path='/admin/hotspot-templates' element={<HotspotTemplates/>}/>
<Route  path='/admin/hotspot-subscriptions' element={<HotspotSubscriptions/>}/>
<Route path='/admin/sms' element={<Sms/>}/>
<Route path='/admin/hotspot-dashboard' element={<HotspotDashboard/>}/>
<Route path='/admin/upload-subscriber' element={<UploadSubscriber />}/>
<Route path='/admin/zones' element={<Zones/>}/>
<Route path='/admin/nodes' element={<Nodes/>}/>
<Route path='/admin/user' element={<User/>}/>
<Route path='/admin/scheduler' element={<Calendar/>}/>
<Route path='/admin/user-group' element={<UserGroup/>}/>
<Route path='/admin/analytics' element={<Analytics/>}/>
<Route path='/admin/hotspot_anlytics' element={<Hotspotanalytics/>}/>
<Route path='/admin/settings' element={<Settings/>}/>
<Route path='/admin/date' element={<DatePicker/>}></Route>
<Route path='/admin/nas' element={<Nas/>}/>
<Route path='/admin/router_details' element={<RouterDetails/>}/>
<Route path='/admin/passkeys' element={<PasskeyList/>}/>
<Route path='/admin/ip-pool' element={<IpPool/>}/>
<Route path='/admin/hotspot_settings' element={<HotspotSettings/>}/>
<Route path='/admin/customer-tickets' element={<CustomerTickets/>}/>
<Route path='/admin/ip-pool-table' element={<IpPoolTable/>}/>
<Route path='/admin/network-components' element={<NetworkComponents/>}/>
<Route path='/admin/messages' element={<AllMessages/>}/>
<Route path='/admin/bulk-messages' element={<BulkMessage/>}/>
<Route path='/admin/networks-wireguard-config' element={<WireguardConfigForm/>}/>
<Route path='/admin/ip_networks' element={<IpNetworks/>}/>
<Route path='/admin/google-authenticator' element={<GoogleAuthenticatorSetup/>}/>
<Route path='/admin/client-leads' element={<ClientLead/>}/>
<Route path='/admin/private-network' element={<PrivateNetwork/>}/>
</Route>

</Route >

      <Route  path='/signin' element={<InputOTPWithSeparator/>}/>
      <Route  path='/passkey-signin' element={<PasskeySignin/>}/>
      <Route  path='/client-login' element={<ClientLogin/>}/>
      <Route path='/qr-code-display' element={<QrCodeDisplay/>}/>

<Route element={<ProtectAuthClient />}>
    <Route path='/client-portal' element={<ClientPortal/>}/> 
    </Route>  


      
     <Route path="*" element={<NotFound />}/>
</Routes>
</div>
</ApplicationContext.Provider>

      </CableProvider>
</ LocalizeDate  >
</Suspense>
</ThemeProvider>
{/* <footer>
      <p>{APP_DESCRIPTION} - Version {APP_VERSION}</p>
    </footer> */}
    </main>
  )
}

export default App





