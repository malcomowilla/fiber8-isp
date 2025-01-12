
import { useContext} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'
import {Profile} from '../profile/Profile'
import {useState, useEffect} from 'react'
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import EastSharpIcon from '@mui/icons-material/EastSharp';





// handleThemeSwitch



const Header = () => {
  
const {  handleThemeSwitch
} = useContext(ApplicationContext);
  const [user, setUser] = useState(null);
  const [icon, setIcon] = useState()

  // const token = localStorage.getItem("jwt");

// useEffect( () => {

  
//   const fetchUserData = async () => {
//     const response = await fetch('/api/me', {
//       method: 'GET',
//       // headers: {
//       //   Authorization: `Bearer ${token}`,

//       // },
//       credentials: 'include', // Include cookies in the request

//     })
// const data = await response.json()
// if (response.ok) {
// setUser(data['username']) 
// }
//   }

//   fetchUserData()
  
// }, []);


const {seeSidebar, setSeeSideBar, setPreferDarkMode, preferDarkMode


} = useContext(ApplicationContext); 
  return (
    <div className={`flex  dark:text-white text-black cursor-pointer  w-full  p-10 h-20   
    
    justify-between`}>
      {/* <div className='hidden'>
      <ion-icon  onClick={()=> setSeeSideBar(!seeSidebar)} className='menu-black'  name="menu" size='large'></ion-icon>

      </div> */}


      <div   style={{ cursor: 'pointer',}}  onClick={()=> setSeeSideBar(!seeSidebar)} className='transition-all 
      duration-500    '>
        
      {seeSidebar ?   <EastSharpIcon />  : <ArrowBackSharpIcon  />}

</div>









{/* <p> Hello {user}</p> */}
<div className='flex flex-row gap-x-4 justify-between'>
 
<div onClick={()=> setPreferDarkMode(!preferDarkMode)}>
<div onClick={handleThemeSwitch}>
<ion-icon onClick={()=>setIcon(!icon)}  name={icon ? 'moon-outline' : 'sunny'} size='large'></ion-icon>
</div>
</div>

      <div>
      <Profile/>

      </div>
        
      </div>
</div>

      
  )
}

export default Header
