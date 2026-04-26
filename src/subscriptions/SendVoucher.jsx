import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { FaTimes } from "react-icons/fa";

import TextField from '@mui/material/TextField';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '',
  boxShadow: 24,
  borderRadius: 3,
  p: 4,
};


const SendVoucher = ({open, setOpen, voucher, useLimit, expiration}) => {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const sendVoucher = async(e) => {

    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`/api/send_voucher?voucher=${voucher}&phone=${phone}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': window.location.hostname.split('.')[0],
        },
        body: JSON.stringify({
          phone: phone,
          voucher: voucher,
          shared_users: useLimit,
          expiration: expiration
        })
      })
      const newData = await response.json()
      if (response.ok) {
        setLoading(false)
        setTimeout(() => {
          
          setOpen(false)
        }, 2000);
        toast.success('Voucher sent successfully', {
          position: "top-center",
          duration: 4000,
        })

      } else {
        setLoading(false)
        toast.error('Failed to send voucher', {
          position: "top-center",
          duration: 4000,
        })
        console.log('failed to send voucher')
          setTimeout(() => {
          
          setOpen(false)
        }, 2000);
      }
    } catch (error) {
        setLoading(false)
        setTimeout(() => {
          
          setOpen(false)
        }, 2000);


        toast.error('Failed to send voucher server error', {
          position: "top-center",
          duration: 4000,
        })
    }
  }
  return (
    <div>
      <Toaster />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
                    <FaTimes className='text-black absolute right-4 top-4 text-2xl cursor-pointer'
          onClick={() => setOpen(false)}
          />

          <Typography id="modal-modal-title" variant="h6" component="h2">
            <p className='font-bold'>Send Voucher {voucher} to phone number</p>
          </Typography>

           <TextField
              name='phone'
              value={phone}
              onChange={(e)=> setPhone(e.target.value)}
            //    value={voucherForm.phone}
            //   onChange={(e)=> setVoucherForm({...voucherForm, phone: e.target.value})}
              // type='number'
              className='myTextField' 
              sx={{
            mt:2
              }}
              label='Phone Number'  fullWidth />

              <button 
              onClick={sendVoucher}
              className='bg-green-500 text-white rounded-lg
               px-4 py-2 font-bold flex gap-2
              mt-3
              '
             >
                {loading ? 'Sending Voucher....' : 'Send Voucher'}
              </button>
        </Box>
      </Modal>
    </div>
  );
}


export default SendVoucher  