import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Modal,
  Typography,
} from '@mui/material';

import { IoGitNetwork } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { TbLockPassword } from "react-icons/tb";
import { FaUserEdit } from "react-icons/fa";









const EditUserGroups = ({
    open, handleClose,userGroups, handleChangeUserGroups,
    createUserGroups, setUserGroups, name
}) => {


    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState("lg");

  return (
    <Dialog fullWidth={fullWidth} maxWidth={maxWidth} open={open} onClose={handleClose}>
        <form onSubmit={createUserGroups}>
  <DialogContent>
    <Box sx={{ minHeight: '100px', display: 'flex', flexDirection: 'column' }}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <TextField
          sx={{
            '& label.Mui-focused': {
              color: '#333',
              fontSize: '16px',
            },
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#333',
                borderWidth: '2px',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CiUser className="text-black dark:text-black" />
              </InputAdornment>
            ),
          }}
          className="myTextField"
          id="name"
          value={name.name}
          onChange={handleChangeUserGroups}
          label={<p className="dark:text-black text-black">Name</p>}
          fullWidth
        />
      </motion.div>
    </Box>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}  color="error">Cancel</Button>
    <Button  type='submit' variant="contained" color="success">
      Save
    </Button>
  </DialogActions>
  </form>
</Dialog>
  )
}

export default EditUserGroups