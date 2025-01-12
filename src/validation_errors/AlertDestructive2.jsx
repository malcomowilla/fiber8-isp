import { useContext} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert"

export function AlertDestructive2() {

  const {   errorData
  } = useContext(ApplicationContext);
    
  return (
    <>
    <div className='mt-[20px]'>
    <Alert variant="destructive">
      <AlertDescription>
        
     
<p className='text-red-600 text-lg font-mono'> {errorData['password_confirmation']}</p>

      </AlertDescription>
    </Alert>
    </div>
    


    </>
  )
}
