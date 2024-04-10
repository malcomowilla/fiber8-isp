import { useContext} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'
import { Navigate } from "react-router-dom";

const PrivateRoutes = ({children}) => {
    const {   user
    } = useContext(ApplicationContext);
     

    if (user) {
        return children
    }
  return <Navigate to='/' replace={true}/>
}

export default PrivateRoutes
