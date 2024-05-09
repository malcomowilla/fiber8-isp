import {Outlet} from 'react-router-dom'
import Sidebar from '../sidebar/Sidebar'
import Header from '../header/Header'

import { useContext} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'



// ${seeSidebar ? 'w-[240]  ' : 'w-[1px] overflow-hidden'
        
        
        
        
// }


const Layout = () => {


const {seeSidebar, theme


} = useContext(ApplicationContext);
  
  return (
<>
    <Header/>

    <div className={`h-screen  overflow-y-scroll p-4 transition-all duration-500   overflow-x-hidden
     ease-in-out ${seeSidebar ? '' : 'sm:ml-64'} `}>

<div className={`p-4 border-2 border-dashed border-gray-800 h-[1800px]`}>
      {/* <div className='flex flex-row w-screen'>
    
      </div> */}


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
