import {
    Github,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Settings,
    User,
    UserPlus,
  } from "lucide-react"
  
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  
  import {useNavigate} from 'react-router-dom'

  import { useContext} from 'react'
  import {ApplicationContext} from '../context/ApplicationContext'
  import {Link} from 'react-router-dom'
  import { GoPasskeyFill } from "react-icons/go";
  import {useApplicationSettings} from '../settings/ApplicationSettings'
  import { IoPersonOutline } from "react-icons/io5";
  import { TbPasswordFingerprint } from "react-icons/tb";
import toast, { Toaster } from 'react-hot-toast';



  const subdomain = window.location.hostname.split('.')[0]

  export function Profile() {
    const {openDropDown, setOpenDropDown} = useApplicationSettings()

    const navigate = useNavigate()

    const { setCurrentUser, user
    } = useContext(ApplicationContext);

const handleLogout = async () => {
    try {
        const response = await fetch('/api/logout', {
          method: "DELETE",
          credentials: 'include', // Include cookies in the request
          headers: {
            'X-Subdomain': subdomain,
          },

        },
        
        

        );

        const newData = await response.json()
if (response.status === 401) {
  toast.error(newData.error, {
    position: "top-center",
    duration: 4000,
  })
   setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/signin'
         }, 1900);
}

        if (response.status === 402) {
          setTimeout(() => {
            navigate('/license-expired')
           }, 1800);
          
        }

        if (response.ok) {

          setCurrentUser(null)
          navigate('/signin');
          
console.log(user)
        } else {
          throw new Error('Logout failed');
        }
      } catch (error) {
        console.error('Error logging out:', error);
       }
  }





    return (
      <>
      <Toaster />
      <DropdownMenu open={openDropDown} onOpenChange={setOpenDropDown}>
        <DropdownMenuTrigger asChild>

        <ion-icon name="people-outline" size='large' onClick={()=> setOpenDropDown(!openDropDown)}></ion-icon>
        {/* <IoPersonOutline className='w-10 h-10 text-black' onClick={()=> setOpenDropDown(!openDropDown)}/> */}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 mr-20">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>

            <DropdownMenuItem>
              
              <User className="mr-2 h-4 w-4" />
              <Link to='/admin/profile'>
              <span>Profile</span>
              </Link>

              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
             
            </DropdownMenuItem>
            




            <DropdownMenuItem className='cursor-pointer'>
              
              <TbPasswordFingerprint className="mr-2 h-4 w-4" />
              <Link to='/admin/google-authenticator'>
              <span>setup auth</span>
              </Link>

              <DropdownMenuShortcut>⇧⌘SA</DropdownMenuShortcut>
             
            </DropdownMenuItem>

            <DropdownMenuItem className='cursor-pointer'>
              
              <GoPasskeyFill className="mr-2 h-4 w-4" />
              <Link to='/admin/passkeys'>
              <span>PassKey</span>
              </Link>

              <DropdownMenuShortcut>⇧⌘PK</DropdownMenuShortcut>
             
            </DropdownMenuItem>


            <DropdownMenuItem className='cursor-pointer'>
              <Settings className="mr-2 h-4 w-4 cursor-pointer" />
              <Link to='/admin/settings'><span >Settings</span></Link>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
           
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <UserPlus className="mr-2 h-4 w-4" />
                <span>Invite users</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Email</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Message</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>More...</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
        
          
         
          <DropdownMenuSeparator />

          <DropdownMenuItem className='cursor-pointer' onClick={handleLogout}>
            <LogOut   className="mr-2 h-4 w-4 " />
            <span  >Log out</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>

          </DropdownMenuItem>


        </DropdownMenuContent>
      </DropdownMenu>
      </>
    )
  }
  