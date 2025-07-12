
import Stack from '@mui/material/Stack';






const Stats = ({handleClose}) => {
  return (
    <div>
    <div>
        <p className='font-extrabold'>Subscriber Stats</p>
        <p>NAS ID</p>
        <p>Device IP</p>
        <p>MAC Address</p>
        <p>Redials</p>
    <p>Last Redial</p>
    </div>


    <Stack direction={{ xs: 'column', sm: 'row'}}sx={{marginTop: 10}}  spacing={{xs: 1, sm: 2, md: 4}}>

{/* <Button color='error' variant='outlined'  startIcon={<CloseIcon/>}  onClick={handleClose}>Cancel</Button> */}

<button   onClick={handleClose} className='bg-red-600 text-white rounded-3xl px-4 py-2
          transform hover:scale-110 transition duration-500 hover:bg-red-200  
          text-lg ' >

            Cancel
          </button>

{/* <LoadingButton  variant='outlined' startIcon={<AutorenewIcon/>}  loading={false} color='success'>Save</LoadingButton> */}
<button className='bg-black text-white rounded-3xl px-4 py-2
          transform hover:scale-110 transition duration-500 hover:bg-green-500
          text-lg' type="submit">

            Save
          </button>
</Stack>

    </div>
  )
}

export default Stats
