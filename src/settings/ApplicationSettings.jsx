import { useState, createContext, useContext, useEffect, useCallback } from "react"


const GeneralSettingsContext = createContext(null)


const ApplicationSettings = ({children}) => {

    const initialValue = {
        check_update_username: false,
        check_update_password: false,
        prefix: '',
        minimum_digits: '',
        welcome_back_message: false,
        router_name: '',
        use_radius: false
    
      }


      const initialValueAdminSettings = {
        enable_2fa_for_admin_email: false,
        enable_2fa_for_admin_sms: false,
        send_password_via_sms: false,
        send_password_via_email: false,
        enable_2fa_for_admin_passkeys: false,
        check_is_inactive: false,
        checkinactiveminutes: '',
        checkinactivehrs: '',
        checkinactivedays: ''
      }


      const initialValueNas = {
        username:'',
        password: '',
        ip_address:'',
        name: ''
        }

        const subscriber_settings = {
          prefix: '',
          minimum_digits: '',
          use_autogenerated_number_as_ppoe_username: false,
          use_autogenerated_number_as_ppoe_password: false,
          notify_user_account_created: false,
          send_reminder_sms_expiring_subscriptions: false,
          account_number_starting_value: 0


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
      const [subscriberSettings, setSubscriberSettings] = useState(subscriber_settings)
      const [adminSettings, setAdminSettings] = useState(initialValueAdminSettings)
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


      const [formData, setFormDataSystemAdmin] = useState({
        password: '',
        phone_number: '',
        email: ''
      })
      const [templateStates, setTemplateStates] = useState({
        clean: false,
        default_template: false,
        sleekspot: false,
        attractive: false,
        flat: false,
        minimal: false,
        simple: false,
        default: false,
        sleek: false, 
      });

      
      // const [settingsformData, setFormData] = useState(() => {
      //   const storedFormData =   localStorage.setItem("checkedtrueData", JSON.stringify(initialValue.check_update_password));
        
      //   return storedFormData ? JSON.parse(storedFormData) : initialValue;
      // });



      const handleChangeSubscriberSettings = (e) => {
        const { type, name, checked, value } = e.target;

        // const captlalName = value.charAt(0).toUpperCase() + value.slice(1)
        const capitalizedName = value.toUpperCase() 

        setSubscriberSettings((prevFormData) => ({
          ...prevFormData,
          [name]: type === "checkbox" ? checked : capitalizedName,
        }));


      }

      const handleChangeAdminSettings = (e) => {
        const { type, name, checked, value } = e.target;

        // const captlalName = value.charAt(0).toUpperCase() + value.slice(1)
        const capitalizedName = value.toUpperCase()
        setAdminSettings((prevFormData) => ({
          ...prevFormData,
          [name]: type === "checkbox" ? checked : capitalizedName,
        }));
      }

    const [isloading, setisloading] = useState(false)
    
const [loginWithPasskey, setLoginWithPasskey] = useState(false)
const [useEmailAuthentication, setUseEmailAuthentication] = useState(false)
const [usePhoneNumberAuthentication, setUsePhoneNumberAuthentication] = useState(false)

//   const handleChange = (e) => {
//     const {type, name, checked, value} = e.target
//  setFormData({...settingsformData, [name]:  type === 'checkbox'  ? checked :  value  })
 
 
//    }

const subdomain = window.location.hostname.split('.')[0];
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
  "Content-Type"  : 'application/json',
  'X-Subdomain': subdomain,
},


})
const newData = await response.json()
if (response.ok) {

// const check_password =  checkedData.check_update_password
// const check_username = checkedData.check_update_username
// console.log('check username', check_username)
// const welcome_back_message = storedData.welcome_back_message

const {prefix, minimum_digits, check_update_password, check_update_username,
  welcome_back_message, router_name} = newData[0]
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
    document.title = subdomain

    try {
      const response = await fetch('/api/currently_logged_in_user', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
      const newData = await response.json()
      if (response) {
        console.log('fetched current user', newData)
        const {username, email, id, created_at, updated_at} = newData
        setCurrentUser(newData)
        setCurrentUsername(username)
        setCurentEmail(email)
        console.log('current user', newData)
      }else{
        setCurrentUser(null) 
      }
    } catch (error) {
      setCurrentUser(null) 
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
      const response = await fetch('/api/current_system_admin', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
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
      const response = await fetch('/api/router_settings', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
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
     currentSystemAdmin, fetchCurrentSystemAdmin,formData, setFormDataSystemAdmin,
     useEmailAuthentication, setUseEmailAuthentication, usePhoneNumberAuthentication, setUsePhoneNumberAuthentication,
     loginWithPasskey, setLoginWithPasskey,handleChangeSubscriberSettings,
     subscriberSettings,setSubscriberSettings,
     handleChangeAdminSettings, adminSettings, setAdminSettings,
     templateStates, setTemplateStates,
     
     companySettings, setCompanySettings}}  >
    {children}
   </GeneralSettingsContext.Provider>
  )
}

export default ApplicationSettings
export const useApplicationSettings = (()=> useContext(GeneralSettingsContext ))














