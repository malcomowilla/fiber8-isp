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


      const initialValueNas={
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
  return (
    <GeneralSettingsContext.Provider  value={{settingsformData, handleChange, setFormData, isloading, setisloading,
     nasformData, setnasFormData,initialValueNas, welcomeMessage, setWelcomeMessage, welcome, setWelcome, tableDataNas, setTableData}}  >
    {children}
   </GeneralSettingsContext.Provider>
  )
}

export default ApplicationSettings
export const useApplicationSettings = (()=> useContext(GeneralSettingsContext ))














