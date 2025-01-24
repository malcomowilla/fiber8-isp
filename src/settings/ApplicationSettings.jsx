import { useState, createContext, useContext, useEffect, useCallback } from "react"


const GeneralSettingsContext = createContext(null)


const ApplicationSettings = ({children}) => {

    const initialValue = {
        check_update_username: false,
        check_update_password: false,
        prefix: '',
        minimum_digits: '',
        welcome_back_message: false,
        router_name: ''
    
      }


      const initialValueNas = {
        username:'',
        password: '',
        ip_address:'',
        name: ''
        }


        const  [nasformData, setnasFormData] = useState(initialValueNas)
        const [welcomeMessage, setWelcomeMessage] =  useState('')
const [welcome, setWelcome] = useState(false)
      const [settingsformData, setFormData]= useState(initialValue)
      const [tableDataNas, setTableData] = useState([])
      const [currentUser, setCurrentUser] = useState('')
      const [currentEmail, setCurentEmail] = useState('')
      const [currentSystemAdmin, setCurrentSystemAdmin] = useState('')
      const [currentUsername, setCurrentUsername] = useState('')
      const [companySettings, setCompanySettings] = useState({
        company_name: '',
  contact_info: '',
  email_info: '',
  logo: null, 
  logo_preview: null ,
  agent_email: '',
  customer_support_email: '',
  customer_support_phone_number: '',

      })

      // const [settingsformData, setFormData] = useState(() => {
      //   const storedFormData =   localStorage.setItem("checkedtrueData", JSON.stringify(initialValue.check_update_password));
        
      //   return storedFormData ? JSON.parse(storedFormData) : initialValue;
      // });

    const [isloading, setisloading] = useState(false)
    


//   const handleChange = (e) => {
//     const {type, name, checked, value} = e.target
//  setFormData({...settingsformData, [name]:  type === 'checkbox'  ? checked :  value  })
 
 
//    }


const fetchSubscriberUpdatedSettings = useCallback(async () => {
  const storedData = JSON.parse(localStorage.getItem("checkedtrueData2"));

const requestParams = {
check_update_password:storedData.check_update_password ,
check_update_username: storedData.check_update_username,
welcome_back_message: storedData.welcome_back_message,
router_name: storedData.router_name
};

try {
const response = await fetch(`/api/get_general_settings?${new URLSearchParams(requestParams)}`, {
method: 'GET',
headers: {
  "Content-Type"  : 'application/json'
},


})
const newData = await response.json()
if (response.ok) {

// const check_password =  checkedData.check_update_password
// const check_username = checkedData.check_update_username
// console.log('check username', check_username)
// const welcome_back_message = storedData.welcome_back_message

const {prefix, minimum_digits, check_update_password, check_update_username,welcome_back_message, router_name} = newData[0]
setFormData({...settingsformData, prefix,  minimum_digits, check_update_password, check_update_username, 
   welcome_back_message,
router_name
})

} else {
console.log('failed to fetch')
}
} catch (error) {
console.log(error)

}
}, []) 



const fetchCurrentUser = useCallback(
  async() => {
    try {
      const response = await fetch('/api/currently_logged_in_user')
      const newData = await response.json()
      if (response) {
        console.log('fetched current user', newData)
        const {username, email, id, created_at, updated_at} = newData
        setCurrentUser(newData)
        setCurrentUsername(username)
        setCurentEmail(email)
        console.log('current user', newData)
      }
    } catch (error) {
      
    }
  },
  [],
)



useEffect(() => {
  fetchCurrentUser()
}, [fetchCurrentUser]);












const fetchCurrentSystemAdmin = useCallback(
  async() => {
    try {
      const response = await fetch('/api/current_system_admin')
      const newData = await response.json()
      if (response) {
        console.log('fetched current user', newData)
        const {user_name, email, id, created_at, updated_at, phone_number} = newData
        setCurrentSystemAdmin(newData)
        console.log('current user', newData)
      }
    } catch (error) {
      console.log(error)
    }
  },
  [],
)



useEffect(() => {
  fetchCurrentSystemAdmin()
}, [fetchCurrentSystemAdmin]);
// useEffect(() => {
  
//  const fetchCurrentUser = async() => {
//   try {
//     const response = await fetch('/api/currently_logged_in_user')
//     const newData = await response.json()
//     if (response) {
//       console.log('fetched current user', newData)
//       const {username, email, id, created_at, updated_at} = newData
//       setCurrentUser(email)
//       setCurrentUsername(username)
//       setCurentEmail(email)
//       console.log('current user', newData)
//     }
//   } catch (error) {
    
//   }
//  }
//  fetchCurrentUser()
// }, []);



useEffect(() => {
  const fetchRouters =  async() => {


    try {
      const response = await fetch('/api/router_settings')
const newData = await response.json()
      if (response) {
        console.log('fetched router settings', newData)
        const {router_name} = newData[0]
        setFormData({...settingsformData, router_name})
      } else {
        console.log('failed to fetch router settings')
      }
    } catch (error) {
      console.log(error)
    }
  }
  fetchRouters()
}, []);












 useEffect(() => {
  
  fetchSubscriberUpdatedSettings()
 }, [fetchSubscriberUpdatedSettings, setFormData]);

const handleChange = (e) => {
  const { type, name, checked, value } = e.target;
  setFormData((prevFormData) => ({
    ...prevFormData,
    [name]: type === "checkbox" ? checked : value,
  }));
};


// const fetchCurrentUser = async() => {
//   try {
//     const response = await fetch('/api/currently_logged_in_user')
//     const newData = await response.json()
//     if (response) {
//       console.log('fetched current user', newData)
//       const {username, email} = newData
//       setCurrentUser(newData)
//       setCurrentUsername(username)
//       setCurentEmail(email)
//       console.log('current user', newData)
//     }
//   } catch (error) {
    
//   }
//  }
  return (
    <GeneralSettingsContext.Provider  value={{settingsformData, handleChange, setFormData, isloading,
       setisloading,
     nasformData, setnasFormData,initialValueNas, welcomeMessage, setWelcomeMessage, welcome, 
     setWelcome, tableDataNas, setTableData,currentUser, setCurrentUser,
     currentUsername, currentEmail, fetchCurrentUser,setCurrentSystemAdmin,
     currentSystemAdmin, fetchCurrentSystemAdmin,
     
     companySettings, setCompanySettings}}  >
    {children}
   </GeneralSettingsContext.Provider>
  )
}

export default ApplicationSettings
export const useApplicationSettings = (()=> useContext(GeneralSettingsContext ))














