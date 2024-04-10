import {Link} from 'react-router-dom'
import {Button} from '../components/ui/button'







const NotFound = () => {
  return (
    <>
    <div className='text-center 
    text-red text-6xl 
    font-light text-red-700 tracking-wider mt-[300px]'>
       Unasaka Kitu Hujaget Rudi Nyoma Bro
      
        </div>
<div className='flex items-center justify-center mt-10'>
<Link to='/'>
<Button>Rudi
</Button>
</Link>

</div>



<div className='flex justify-center items-center w-full'>
<img src="/images/fiber8logo1.png" alt="" />
</div>
</>
  )
}

export default NotFound