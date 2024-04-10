

import { useContext} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert"

export function AlertDestructive() {
  // errorData


const {   errorData
} = useContext(ApplicationContext);
  
  return (
    <>
    <Alert variant="destructive">
      <AlertDescription>
        
     
{/* 
{errorData.map ((error, index)=> {
return  <p key={index}>{error}</p>
})} */}

<p>Oops! {errorData['password']}</p>
      </AlertDescription>
    </Alert>


    </>
  )
}
