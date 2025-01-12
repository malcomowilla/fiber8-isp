import {Outlet} from 'react-router-dom'
import Sidebar from '../sidebar/Sidebar'
import Header from '../header/Header'

import { useContext, useState, useEffect} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'
import { Button } from "@/components/ui/button"
import { ReloadIcon } from "@radix-ui/react-icons"



// ${seeSidebar ? 'w-[240]  ' : 'w-[1px] overflow-hidden'
        
        
        
        
// }


const Layout = () => {


const {seeSidebar, theme


} = useContext(ApplicationContext);
  const [seeButton, setSeeButton] = useState(false)
const [loading, setloading] = useState(false)

  const refreshPage = ()=> {
    window.location.reload(false);
    setloading(true)
  }
  useEffect(() => {
   setSeeButton(true)
  }, [seeButton]);
  return (
<>
    <Header/>

    <div className={`h-screen  overflow-y-scroll p-4 transition-ml duration-500   overflow-x-hidden
     ease-in-out ${seeSidebar ? '' : 'sm:ml-64'} `}>

<div className={`p-4  h-[1000px]  `}>
     
{seeButton && <Button onClick={refreshPage}>Reload Page

</Button>}



<div className='flex flex-col p-4 font-mono  '>
<Sidebar/>
</div>

  
      <div className=''>
<Outlet/>
      </div>
      </div>
      </div>
      </>
  )
}

export default Layout
