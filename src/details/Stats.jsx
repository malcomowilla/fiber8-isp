
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import LoadingButton from '@mui/lab/LoadingButton';
import CloseIcon from '@mui/icons-material/Close';







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

<Button color='error' variant='outlined'  startIcon={<CloseIcon/>}  onClick={handleClose}>Cancel</Button>
<LoadingButton  variant='outlined' startIcon={<AutorenewIcon/>}  loading={false} color='success'>Save</LoadingButton>
</Stack>

    </div>
  )
}

export default Stats
