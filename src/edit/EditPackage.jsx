import {Link} from 'react-router-dom'
const EditPackage = () => {
  return (
    <div className="flex h-screen items-center justify-center   mb-32 w-screen ">
  <div className="grid bg-white rounded-lg shadow-xl w-11/12 md:w-9/12 lg:w-1/2">
    <div className="flex justify-center py-4">
      <div className="flex  rounded-full md:p-4 p-2 border-2 ">
<img src="/images/fiber8logo2.png" alt="" />
      </div>
    </div>

    <div className="flex justify-center">
      <div className="flex">
        <h1 className="text-gray-600 font-bold md:text-2xl text-xl">Edit Package</h1>
      </div>
    </div>


<form>
    <div className="grid grid-cols-1 mt-5 mx-7">
      <label className="uppercase md:text-sm text-xs text-gray-500 text-light  font-semibold">Package Name</label>
      <input className="py-2 px-3 rounded-lg border-2 border-red-300 mt-1 
      focus:outline-none uppercase focus:ring-2 focus:ring-red-600 focus:border-transparent" type="text"  />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 mt-5 mx-7">
      <div className="grid grid-cols-1">
        <label className="uppercase md:text-sm text-xs text-gray-500 text-light font-semibold">Download Speed</label>
        <input className="py-2 px-3 rounded-lg border-2 border-red-300 mt-1 focus:outline-none 
        focus:ring-2 focus:ring-red-600 focus:border-transparent" type="text"  />
      </div>
      <div className="grid grid-cols-1">
        <label className="uppercase md:text-sm text-xs text-gray-500 text-light font-semibold">Upload Speed</label>
        <input className="py-2 px-3 rounded-lg border-2 border-red-300 mt-1 focus:outline-none 
        focus:ring-2 focus:ring-red-600 focus:border-transparent" type="text"  />
      </div>
    </div>

    <div className="grid md:grid-cols-2 mt-5 mx-7 gap-4 ">
      {/* <label className="uppercase md:text-sm text-xs text-gray-500 text-light font-semibold">Selection</label>
      <select className="py-2 px-3 rounded-lg border-2 border-red-300 mt-1 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent">
        <option>Option 1</option>
        <option>Option 2</option>
        <option>Option 3</option>
      </select> */}
      

      <div className='grid grid-cols-1'>
      <label className="uppercase md:text-sm text-xs text-gray-500 text-light font-semibold">Validity</label>

      <input type='number' 
      className="py-2 px-3 rounded-lg border-2 border-red-300 mt-1 focus:outline-none
       focus:ring-2 focus:ring-red-600 focus:border-transparent" placeholder="Another Input" />


      </div>
     
       <div className='grid grid-cols-1 '>

       <select className="py-2 px-3 rounded-lg border-2 border-red-300 mt-1 focus:outline-none focus:ring-2 
  focus:ring-red-600 f
 ocus:border-transparent">
        <option>Days</option>
        <option>Months</option>
      </select> 

       </div>
 
    </div>

    <div className="grid grid-cols-1 mt-5 mx-7">
      <label className="uppercase md:text-sm text-xs text-gray-500 text-light font-semibold">Price</label>
      <input type='number' 
      className="py-2 px-3 rounded-lg border-2 border-red-300 mt-1 focus:outline-none
       focus:ring-2 focus:ring-red-600 focus:border-transparent" placeholder="Another Input" />




    </div>

    

    <div className='flex items-center justify-center  md:gap-8 gap-4 pt-5 pb-5'>
    <Link to='/layout/pppoe-packages'>   <button className='w-auto bg-gray-500 hover:bg-gray-700 rounded-lg shadow-xl
     font-medium text-white px-4 py-2'>Cancel</button></Link>
      <button type='submit'  className='w-auto bg-red-500 hover:bg-red-700
       rounded-lg shadow-xl font-medium text-white px-4 py-2'>
        Create</button>
    </div>
    </form>

  </div>
</div>
  )
}

export default EditPackage
