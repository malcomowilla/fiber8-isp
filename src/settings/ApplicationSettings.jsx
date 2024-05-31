import { useState, createContext, useContext, useEffect } from "react"


const GeneralSettingsContext = createContext(null)


const ApplicationSettings = ({children}) => {

    const initialValue = {
        check_update_username: false,
        check_update_password: false,
        prefix: '',
        minimum_digits: '',
      
    
      }


      const initialValueNas={
        username:'',
        password: '',
        ip_address:'',
        name: ''
        }
        const  [nasformData, setnasFormData] = useState(initialValue)
        
      const [settingsformData, setFormData]= useState(initialValue)
      // const [settingsformData, setFormData] = useState(() => {
      //   const storedFormData =   localStorage.setItem("checkedtrueData", JSON.stringify(initialValue.check_update_password));
        
      //   return storedFormData ? JSON.parse(storedFormData) : initialValue;
      // });

    const [isloading, setisloading] = useState(false)
    


//   const handleChange = (e) => {
//     const {type, name, checked, value} = e.target
//  setFormData({...settingsformData, [name]:  type === 'checkbox'  ? checked :  value  })
 
 
//    }

const handleChange = (e) => {
  const { type, name, checked, value } = e.target;
  setFormData((prevFormData) => ({
    ...prevFormData,
    [name]: type === "checkbox" ? checked : value,
  }));
};
  return (
    <GeneralSettingsContext.Provider  value={{settingsformData, handleChange, setFormData, isloading, setisloading,
     nasformData, setnasFormData,initialValueNas}}  >
    {children}
   </GeneralSettingsContext.Provider>
  )
}

export default ApplicationSettings
export const useApplicationSettings = (()=> useContext(GeneralSettingsContext ))














