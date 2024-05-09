
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
// import {ResetPassword} from './Auth/ResetPassword'
import {useState, useEffect, lazy, Suspense} from 'react'
import {ApplicationContext} from './context/ApplicationContext'
import UiLoader from './uiloader/UiLoader'
// import Signup from './Auth/Signup'
// import NotFound from './404/NotFound'
// import {InputOTPWithSeparator} from './Auth/InputOTPWithSeparator'
// import PrivateRoutes  from './private_routes/PrivateRoutes'
import AdminDashboard from './admindashboard/AdminDashboard'
// import Sidebar from './sidebar/Sidebar'
// import Layout from './layout/Layout'
import {CableProvider} from './context/CableContext'
import { redirect } from "react-router-dom";

 import PPPOEpackages from './packages/PPPOEpackages'
 import HotspotPackage from './packages/HotspotPackage'
 import HotspotSubscriptions from './subscriptions/HotspotSubscriptions'
import EditPackage from './edit/EditPackage'
import PPPOEsubscribers from './subscribers/PPPOEsubscribers'
import FixedPayments from './payments/FixedPayments'
import PPPOEsubscriptions from './subscriptions/PPPOEsubscriptions'
import Zones from './zones/Zones'
import Nodes from './Node/Nodes'
import User from './user/User'
import UserGroup from './user/UserGroup'
import Nas from './NAS_IDENTIFIER/Nas'
import Analytics from './analytics/Analytics'
import Settings from './settings/Settings'
import {DatePicker} from './date-picker/Date'
import LocalizeDate from './date-picker/LocalizeDate'
import Sms from './sms/Sms'
import ProtectAuth from './Auth/ProtectAuth'
import HotspotPayments from './payments/HotspotPayments'
import { createTheme, ThemeProvider } from '@mui/material/styles';


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


// const AdminDashboard = lazy(()=> import ('./admindashboard/AdminDashboard')
// )
const Sidebar = lazy(()=> import ('./sidebar/Sidebar')
 )
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route index path='/'  element={<Signup/>}/>
      <Route  path='/reset-password' element={<ResetPassword/>}/>

{/* 
<Route path='/admin-dashboard' element={<PrivateRoutes>
  <AdminDashboard/>
</PrivateRoutes>}>
</Route> */}

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
<Route path='/admin/settings' element={<Settings/>}/>
<Route path='/admin/date' element={<DatePicker/>}></Route>
<Route path='/admin/nas' element={<Nas/>}/>
</Route>



      <Route  path='/signin' element={<InputOTPWithSeparator/>}/>
      
     <Route path="*" element={<NotFound />}/>

      </>
      

  )
)

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
 if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  setTheme('dark')
 } else {
  setTheme('light')
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
  setTheme(theme === 'dark' ? 'light' : 'dark')
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
    setEmail('')
    setPassword('')
    setPasswordConfirmation('')
    setShowErrors(false)
    setloading(false)
    setOfflineError(false)
    setUsername('')
return redirect('/signin')
    // localStorage.setItem("jwt", actualUserDataInJson.jwt);
    // console.log(actualUserDataInJson)

  } else {
    setErroraData(actualUserDataInJson.errors)
    setShowErrors(true)
    setloading(false)

  }
} catch (error) {
  console.log(error.name === 'AbortError');
  setloading(false);

  setOfflineError(true)

}
}


  return (
    <main>

          <ThemeProvider theme={ defaultMaterialTheme}>

      <Suspense fallback={<div className='flex justify-center items-center '>{ <UiLoader/> }</div>}>
      < LocalizeDate  >
      <CableProvider>

 <ApplicationContext.Provider value={{isSeen, setIsSeen,isPassword, setPassword,
   email, setEmail, passwordConfirmation, setPasswordConfirmation, errorData, showErrors, handleSignUp, loading,
   isExpanded, setIsExpanded, isExpanded1, setIsExpanded1, isExpanded2, setIsExpanded2,
   isExpanded3, setIsExpanded3, isExpanded4, setIsExpanded4, isExpanded5, setIsExpanded5, seeSidebar, setSeeSideBar,
   logout,handleLogout , user, setCurrentUser, theme, setTheme,  handleThemeSwitch
   , setOfflineError, offlineError, open, setOpen, username, setUsername, setPreferDarkMode , preferDarkMode,
   isExpanded6, setIsExpanded6, isExpanded7, setIsExpanded7, isExpanded8, setIsExpanded8, client}}>


<RouterProvider router={router} />
</ApplicationContext.Provider>
      </CableProvider>
</ LocalizeDate  >
</Suspense>
</ThemeProvider>
    </main>
  )
}

export default App





