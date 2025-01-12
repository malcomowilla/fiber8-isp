import {Link} from 'react-router-dom'
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
    <div className='text-center 
    text-red text-6xl 
    font-light text-blue-700 tracking-wider mt-[300px]'>
       PAGE NOT FOUND
      
        </div>
<div className='flex items-center justify-center mt-10'>
<Button onClick ={()=> navigate(-1)}>Go Back
</Button>

</div>

<Lottie className='relative z-50' options={defaultOptions} height={400} width={400} />
</>
  )
}

export default NotFound