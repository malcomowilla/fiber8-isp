
import {
 
  Route,
  Routes
} from "react-router-dom";

import {useState, useEffect, lazy, Suspense, useCallback} from 'react'
import {ApplicationContext} from './context/ApplicationContext'

const AdminDashboard = lazy(()=> import ('./admindashboard/AdminDashboard'))

import {CableProvider} from './context/CableContext'


const PPPOEpackages = lazy(()=> import('./packages/PPPOEpackages'))
const HotspotPackage = lazy(()=> import('./packages/HotspotPackage'))
const AdminProfile = lazy(() => import('./profile/AdminProfile.jsx'))
 

const HotspotSubscriptions = lazy(()=> import('./subscriptions/HotspotSubscriptions'))

const EditPackage = lazy(()=> import('./edit/EditPackage'))
const PPPOEsubscribers = lazy(()=> import('./subscribers/PPPOEsubscribers'))

const FixedPayments = lazy(()=> import('./payments/FixedPayments'))

const PPPOEsubscriptions = lazy(()=> import('./subscriptions/PPPOEsubscriptions'))

const Zones = lazy(()=> import('./zones/Zones'))

const Nodes = lazy(()=> import('./Node/Nodes'))

const User = lazy(()=> import('./user/User'))

const UserGroup = lazy(()=> import('./user/UserGroup'))
const Nas = lazy(()=> import('./NAS_IDENTIFIER/Nas'))
const HotspotPricing = lazy(()=> import('./pricing/HotspotPricing.jsx'))


const Analytics = lazy(()=> import('./analytics/Analytics'))
const Hotspotanalytics = lazy(()=> import('./analytics/HotspotAnalytics'))
const Settings = lazy(()=> import('./settings/Settings'))
import {DatePicker} from './date-picker/Date'
import LocalizeDate from './date-picker/LocalizeDate'
const Sms = lazy(()=> import('./sms/Sms'))
const HotspotSettings = lazy(()=> import('./settings/HotspotSettings'));
import ProtectAuth from './Auth/ProtectAuth'
import HotspotPayments from './payments/HotspotPayments'
import { createTheme, ThemeProvider } from '@mui/material/styles';
const SignupNotification = lazy(()=> import('./notification/SignupNotification'))
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
import { Helmet,  } from 'react-helmet-async';
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
const Invoice = lazy(() => import('./invoice/Invoice'))
const InvoicePage = lazy(() => import('./invoice/InvoicePage'))
const UserLicense = lazy(() => import('./license/UserLicense'))
const PePeaPreview = lazy(() => import('./hotspot_page/PePeaPreview'))
const SubscribersOnline = lazy(() => import('./subscribers/SubscribersOnline'))
const SubscribersOffline = lazy(() => import('./subscribers/SubscribersOffline'))
const FinanceStats = lazy(() => import('./admindashboard/FinanceStats.jsx'))
const PreventDDoS = lazy(() => import('./Ddos/PreventDDoS'))
const OpenTickets = lazy(() => import('./tickets/OpenTickets'))
const SolvedTickets = lazy(() => import('./tickets/SolvedTickets'))
const UrgentTickets = lazy(() => import('./tickets/UrgentTickets'))
const RedirectIfAuthenticated = lazy(() => import('./Auth/RedirectIfAuthenticated'))
const Equipment = lazy(() => import('./equipment/Equipment'))
const CallCenterInterface = lazy(() => import('./call_center/CallCenterInterface'))
const Devices = lazy(() => import('./devices/Devices'))
const OnuDetails = lazy(() => import('./devices/OnuDetails'))
const EditSubscriber = lazy(() => import('./subscribers/EditSubscriber'))
const  CreateSubscriber = lazy(() => import('./subscribers/CreateSubscriber'))
const RadiusSettings = lazy(() => import('./NAS_IDENTIFIER/RadiusSettings.jsx'))
import { useLocation } from 'react-router-dom';
import TourGuide from './guide/TourGuide';
const License = lazy(() => import('./license/license'))
const Map = lazy(() => import('./map/Map'))
const HotspotMarketing = lazy(() => import('./hotspot_marketing/HotspotMarketing'))
const AddSettings = lazy(() => import('./hotspot_marketing/AddSettings'))
const ClientWidget = lazy(() => import('./client_portal/ClientWidget.jsx'))
const CustomerPayment = lazy(() => import('./client_portal/CustomerPayment.jsx'))
import { 
   RefreshCw,
  BarChart3, TrendingDown, Download, Upload
} from 'lucide-react';
const FinancialDashboard = lazy(() => import('./finance/FinancialDashboard.jsx'))
const PaymentAnalytics = lazy(() => import('./subscribers/PaymentAnaytics'))
const UnpaidInvoice = lazy(() => import('./invoice/UnpaidInvoice'))
const TemplateAssignment = lazy(() => import('./hotspot_templates/TemplateAssignment.jsx'))
const HotspotRewardsDashboard = lazy(() => import('./hotspot_page/HotspotRewardDashboard.jsx'))
const ResellerCommissionDashboard = lazy(() => import('./reseller/ResellerCommisionDashboard.jsx'))
const MpesaDisbursementForm = lazy(() => import('./disbursement/MpesaDisbursementForm.jsx'))
const SubscriberInvoicePage = lazy(() => import('./subscribers/SubscriberInvoicePage'))
const PartnerPortal = lazy(() => import('./partner/PartnerPortal.jsx'))
const PayoutManagement = lazy(() => import('./partner/PayoutManagement.jsx'))
const PartnersManagement = lazy(() => import('./partner/PartnersManagement.jsx'))
const PpPoePayments = lazy(() => import('./payments/PpPoePayments.jsx'))
const AccessPoint = lazy(() => import('./access_point/AccessPoint.jsx'))
const HotspotSignIn = lazy(() => import('./hotspot_page/HotspotSignIn.jsx'))
const PartnerLogin = lazy(() => import('./partner/PartnerLogin.jsx'))



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
const handleClose = () => {
  setOpenNotification(false);
};



const {company_name} = companySettings
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
    credentials: 'include', 
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
          backgroundColor: 'white',  
          color: 'black',  
        },
        columnHeaders: {
          backgroundColor: 'lightgray',  
          color: 'black',  
        },
        cell: {
          backgroundColor: 'white',  
          color: 'black',  
        },
        footerContainer: {
          backgroundColor: 'white',  
          color: 'black',  
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
            backgroundColor: 'black',  
            color: 'white', 
          },
          cell: {
            backgroundColor: 'black',  
            color: 'white',  
          },
          footerContainer: {
            backgroundColor: 'white',  
            color: 'white', 
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

        setCompanySettings((prevData)=> ({...prevData, 
          contact_info, company_name, email_info,
          customer_support_phone_number,agent_email ,customer_support_email,
        
          logo_preview: logo_url
        }))

      }else{
      }
    } catch (error) {


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
        icon: image, 
      });

     
    }
    
  });

  const location = useLocation();


  useEffect(() => {
    const pageTitle = location.pathname.split("/")[2] || `${company_name || 'Aitechs'} | ${location.pathname.split("/")[1]}` || `Aitechs | ${location.pathname.split("/")[1]}`;
    document.title = pageTitle;
  }, [location]);



  const host_url = import.meta.env.VITE_SYSTEM_ADMIN_HOST 




  const shouldShowAdminRoutes = () => {
    const { hostname } = window.location;
    const domainParts = hostname.split('.');
    
    if (domainParts.length < 3) return false; 
    
    const firstChar = domainParts[0].charAt(0).toLowerCase();
    return firstChar === 's';
  };

  const showAdmin = shouldShowAdminRoutes();

  return (
    <main>

<TourGuide />

<Helmet>
                <meta charSet="utf-8" />

                <link rel="icon" type="image/svg+xml" href={logo_preview} 
                onError={(e) => { e.target.src = "/images/aitechs.png"; }}
                />

            </Helmet>



<SignupNotification  openSignupNotification={openSignupNotification} handleClose={handleClose} />
          <ThemeProvider theme={materialuitheme}>

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



{hostname === 'aitechs.co.ke' ? (
      <Route index path="/" element={<Signup />} />
    ) : hostname.endsWith('.aitechs.co.ke') ? (
      <Route index path="/" element={<PPPoEPackages />} />
    ) : null} 



    



      <Route  path='/reset-password' element={<ResetPassword/>}/>
      <Route path='/confirm-reset-password' element={<ConfirmResetPassword />}/>
      <Route path='/reset-password-email-sent' element={<PasswordResetEmailSent />}/>
      <Route  path='/hotspot-page' element={<HotspotPage/>}/>
      <Route  path='/hotspot-login' element={<HotspotLogin/>}/>
      <Route  path='/hotspot-trial' element={< HotspotTrial />}/>
      <Route  path='/hotspot-pricing' element={< HotspotPricing />}/>


    {/* <Route path='/system-admin-login' element={<SystemAdminLogin/>}/> */}


{showAdmin && (
        <Route path="/system-admin-login" element={<SystemAdminLogin />} />
      )}

    <Route path='/sms-sent' element={<SmsSent/>}/>
    <Route path='/email-sent' element={<EmailSent/>}/>
    <Route path='/how-did-you-hear' element={<HowDidYouHear/>}/>
    <Route path='/account-locked' element={<AccountLocked/>}/>
    <Route path='/service-expired' element={<ServiceExpired/>}/>
    <Route  path='/license-expired' element={<LicenseExpired/>}/>
    <Route path='/two-factor-auth' element={<TwoFactorAuthVerification/>}/>
    <Route  path='/pepea' element={<PePeaPreview/>}/>
    <Route path='/contact-us' element={<ContactUs/>}/>
    

<Route element={<ProtectAuthSystemAdmin  />}>


     {showAdmin && (
        <Route path="/system-admin-dashboard" element={<DashboardSytemAdmin />} />
    )}


{/* 
     {hostname === 'localhost' ? (
        <Route path="/system-admin-dashboard" element={<DashboardSytemAdmin />} />
      ) : null} */}
    </Route>  



  
{/* 
<Route path='/admin-dashboard' element={<PrivateRoutes>
  <AdminDashboard/>
</PrivateRoutes>}>
</Route> */}
<Route element={<ProtectAuth />}>

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

<Route  path='/admin/map' element={<Map/>}/>


<Route exact path='/admin/license' element={
   <Suspense fallback={  <RefreshCw className='animate-spin text-blue-500 w-12 
    h-12 mx-auto ' />
}>
  <License/>
  
  </Suspense>
  }/>


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
<Route path='/admin/hotspot-marketing-dashboard' element={<HotspotMarketing/>}/>
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
<Route path='/admin/ip-pool' element={<IpPoolTable/>}/>
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
<Route path='/admin/invoice' element={<Invoice/>}/>
<Route path='/admin/subscriber-invoice-page' element={<SubscriberInvoicePage/>}/>
<Route path='/admin/unpaid-invoices' element={<UnpaidInvoice/>}/>
<Route path='/admin/private-network' element={<PrivateNetwork/>}/>
<Route  path='/admin/invoice-page' element={<InvoicePage/>}/>
<Route path='/admin/user-license' element={<UserLicense/>}/>
<Route path='/admin/subscribers-online' element={<SubscribersOnline/>}/>
<Route path='/admin/subscribers-offline' element={<SubscribersOffline/>}/>
<Route path='/admin/finance-stats' element={<FinanceStats/>}/>
<Route path='/admin/prevent-ddos' element={<PreventDDoS/>}/>
<Route path='/admin/open-tickets' element={<OpenTickets/>}/>
<Route path='/admin/solved-tickets' element={<SolvedTickets/>}/>
<Route path='/admin/urgent-tickets' element={<UrgentTickets/>}/>
<Route path='/admin/equipment' element={<Equipment/>}/>
<Route path='/admin/call-center' element={<CallCenterInterface/>}/>
<Route path='/admin/devices' element={<Devices/>}/>
<Route path='/admin/onu-details' element={<OnuDetails/>}/>
<Route path='/admin/subscriber-details' element={<EditSubscriber/>}/>
<Route path='/admin/create-subscriber' element={<CreateSubscriber/>}/>
{/* <Route path='/admin/ticket-stats' element={<TicketStats/>}/>  */}
<Route path='/admin/radius-settings' element={<RadiusSettings/>}/>
<Route path='/admin/add-settings' element={<AddSettings/>}/>
<Route path='/admin/financial-dashboard' element={<FinancialDashboard/>}/>
<Route  path='/admin/subscriber-payment-analytics' element={<PaymentAnalytics/>}/>
<Route  path='/admin/template-assignment' element={<TemplateAssignment/>}/>
      <Route path='/admin/partners-management' element={<PartnersManagement/>}/>
      <Route path='/admin/pppoe-payments' element={<PpPoePayments/>}/>
      <Route path='/admin/access-point' element={<AccessPoint/>}/>



</Route>

</Route >

      {/* <Route element={<RedirectIfAuthenticated />}>
<Route  path='/signin' element={<InputOTPWithSeparator/>}/>

</Route> */}
      
      <Route
  path="/signin"
  element={
    <RedirectIfAuthenticated>
      
      <InputOTPWithSeparator />

      
    </RedirectIfAuthenticated>
  } 
/>

{/* 
<Route path="/" element={
  <PPPoEPackages />
  
  } /> */}

<Route path='/home'  element={<Signup/>}/>

{/* 
<Route path="/" element={
  <RedirectIfAuthenticated>
  <PPPoEPackages />
  </RedirectIfAuthenticated>
  
  } /> */}

      
      <Route  path='/passkey-signin' element={<PasskeySignin/>}/>
      <Route  path='/client-login' element={<ClientLogin/>}/>
      <Route path='/qr-code-display' element={<QrCodeDisplay/>}/>
      <Route path='/hotspot-rewards-dashboard' element={<HotspotRewardsDashboard/>}/>
      <Route path='/reseller-commission-dashboard' element={<ResellerCommissionDashboard/>}/>
      {/* <Route path='/mpesa-disbursement-form' element={<MpesaDisbursementForm/>}/> */}
      <Route path='/partner-portal' element={<PartnerPortal/>}/>
      {/* <Route path='/payout-management' element={<PayoutManagement/>}/> */}

      <Route path='/hotspot-signin' element={<HotspotSignIn/>}/>
      <Route  path='/partner-login' element={<PartnerLogin/>}/>

      



<Route element={<ProtectAuthClient />}>
    <Route path='/client-portal' element={<ClientPortal/>}/> 
    <Route path = '/client-widget' element={<ClientWidget/>}/>
    <Route path='/customer-payment' element={<CustomerPayment/>}/>
    </Route>  


      
     <Route path="*" element={<NotFound />}/>
</Routes>
</div>
</ApplicationContext.Provider>

      </CableProvider>
</ LocalizeDate  >
</ThemeProvider>

    </main>
  )
}

export default App





