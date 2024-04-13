
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import {ResetPassword} from './Auth/ResetPassword'
import {useState, useEffect} from 'react'
import {ApplicationContext} from './context/ApplicationContext'
import Signup from './Auth/Signup'
import NotFound from './404/NotFound'
import {InputOTPWithSeparator} from './Auth/InputOTPWithSeparator'
// import PrivateRoutes  from './private_routes/PrivateRoutes'
import AdminDashboard from './admindashboard/AdminDashboard'
import Sidebar from './sidebar/Sidebar'
import Layout from './layout/Layout'
 import PPPOEpackages from './packages/PPPOEpackages'
import EditPackage from './edit/EditPackage'
import PPPOEsubscribers from './subscribers/PPPOEsubscribers'
import FixedPayments from './payments/FixedPayments'
import PPPOEsubscriptions from './subscriptions/PPPOEsubscriptions'
import {DatePicker} from './date-picker/Date'
import LocalizeDate from './date-picker/LocalizeDate'
import ProtectAuth from './Auth/ProtectAuth'
import HotspotPayments from './payments/HotspotPayments'
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
<Route  path='/layout'  element={ 
      <Layout/> 
}>

  
<Route path='/layout/date' element={<DatePicker/>}/>
<Route 
 path='/layout/admin-dashboard' element={  <AdminDashboard/>
}/>
<Route/>
<Route path='/layout/side-bar' element={<Sidebar/>}/> 
<Route path='/layout/pppoe-packages' element={< PPPOEpackages/>}/>
<Route path='/layout/pppoe-subscribers' element={< PPPOEsubscribers/>}/>
<Route path='/layout/fixed-payments' element={<FixedPayments/>}/>
<Route path='/layout/edit-package' element={<EditPackage/>}/>
<Route path='/layout/pppoe-subscriptions' element={<PPPOEsubscriptions/>}/>
<Route path='/layout/hotspot-payments' element={<HotspotPayments/>}/>

</Route>



      <Route  path='/signin' element={<InputOTPWithSeparator/>}/>
      
     <Route path="*" element={<NotFound />}/>

      </>
      

  )
)

const App = () => {

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

const formData = {
  password_confirmation: passwordConfirmation,
    email: email,
    password: isPassword,
    username: username
}

const [isExpanded, setIsExpanded] = useState(false)
const [isExpanded1, setIsExpanded1] = useState(false)
const [isExpanded2, setIsExpanded2] = useState(false)
const [isExpanded3, setIsExpanded3] = useState(false)
const [isExpanded4, setIsExpanded4] = useState(false)
const [isExpanded5, setIsExpanded5] = useState(false)

const isLogedIn = window.localStorage.getItem('user')
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
      < LocalizeDate  >
 <ApplicationContext.Provider value={{isSeen, setIsSeen,isPassword, setPassword,
   email, setEmail, passwordConfirmation, setPasswordConfirmation, errorData, showErrors, handleSignUp, loading,
   isExpanded, setIsExpanded, isExpanded1, setIsExpanded1, isExpanded2, setIsExpanded2,
   isExpanded3, setIsExpanded3, isExpanded4, setIsExpanded4, isExpanded5, setIsExpanded5, seeSidebar, setSeeSideBar,
   logout,handleLogout , user, setCurrentUser, theme, setTheme,  handleThemeSwitch
   , setOfflineError, offlineError, open, setOpen, username, setUsername}}>


<RouterProvider router={router} />
</ApplicationContext.Provider>
</ LocalizeDate  >
    </main>
  )
}

export default App





