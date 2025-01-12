import { useContext} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert"

export function AlertDestructive4() {

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
<p  className='text-red-600 text-lg font-mono'> {errorData['username']}</p>
      </AlertDescription>
    </Alert>


    </>
  )
}
