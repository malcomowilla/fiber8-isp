import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { FaTimes } from "react-icons/fa";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import TextField from '@mui/material/TextField';

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


const SendVoucher = ({open, setOpen, voucher}) => {
  
  return (
    <div>
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
            //    value={voucherForm.phone}
            //   onChange={(e)=> setVoucherForm({...voucherForm, phone: e.target.value})}
              // type='number'
              className='myTextField' 
              sx={{
            mt:2
              }}
              label='Phone Number'  fullWidth />
        </Box>
      </Modal>
    </div>
  );
}


export default SendVoucher  