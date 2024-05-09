
import { useContext} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'
import {Profile} from '../profile/Profile'
import {useState, useEffect} from 'react'


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
    <div className='flex text-gray-200   bg-stone-600 w-screen  p-10 h-20 justify-between'>
        <ion-icon  onClick={()=> setSeeSideBar(!seeSidebar)} className='menu-black'  name="menu"></ion-icon>


{/* <p> Hello {user}</p> */}
<div className='flex flex-row gap-4'>
<div onClick={()=> setPreferDarkMode(!preferDarkMode)}>
<div onClick={handleThemeSwitch}>
<ion-icon onClick={()=>setIcon(!icon)}  name={icon ? 'moon-outline' : 'sunny'} size='small'></ion-icon>
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
