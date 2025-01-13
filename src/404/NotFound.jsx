// import {Link} from 'react-router-dom'
import {Button} from '../components/ui/button'
import {useNavigate} from 'react-router-dom'
import NotFoundAnimation from '../loader/not_found_animation.json'
import Lottie from 'react-lottie';





const NotFound = () => {



const defaultOptions = {
  loop: true,
  autoplay: true, 
  animationData: NotFoundAnimation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

  const navigate = useNavigate()
  return (
    <>
<div className='flex flex-col items-center justify-center min-h-screen'>
    <div className=' 
    text-red text-6xl 
    font-light text-blue-700 tracking-wider  animate-bounce'>

       PAGE NOT FOUND
      
        </div>
        
<div className='flex flex-col'>

<Lottie className='' options={defaultOptions} height={400} width={400} />

<Button onClick ={()=> navigate(-1)}>Go Back
</Button>
</div>
</div>
</>
  )
}

export default NotFound


