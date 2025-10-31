import * as React from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { motion,} from 'framer-motion';
import {

  InputAdornment,
 
} from '@mui/material';

import { IoGitNetwork } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { TbLockPassword } from "react-icons/tb";
import { FaUserEdit } from "react-icons/fa";


function EditNas({ open, handleClose, handleSubmit, nasformData, setnasFormData, isloading , editingRouter}) {
  const { name, username, ip_address, password } = nasformData;
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('lg');

  const onChange = (e) => {
    setnasFormData({ ...nasformData, [e.target.id]: e.target.value });
  };

  return (
    <React.Fragment>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogTitle sx={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
            <p className='font-thin'>  {editingRouter ? 'Edit Router' : 'Add Router'}</p>
          </DialogTitle>
        </motion.div>

        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Box
              noValidate
              component="form"
              sx={{
                m: 1,
                width: '80ch',
              }}
            >
              <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
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
className="myTextField"
label= { <p className='dark:text-black text-black'>Nas IP Address</p>}
id="ip_address"
value={ip_address}
onChange={onChange}
fullWidth
InputProps={{
  startAdornment: (
    <InputAdornment position="start">
      <IoGitNetwork className="text-black dark:text-black" />
    </InputAdornment>
  ),
}}
        />
                </motion.div>

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
                    value={name}
                    onChange={onChange}
                    label= { <p className='dark:text-black text-black'>Name</p>}

                    fullWidth
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
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
                    className="myTextField"
                    id="password"
                    value={password}
                    onChange={onChange}
                    label= { <p className='dark:text-black text-black'>Nas Password</p>}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          < TbLockPassword className="text-black dark:text-black" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </motion.div>
              </Stack>
            </Box>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Box
                noValidate
                component="form"
                sx={{
                  width: '40ch',
                  mt: 2,
                }}
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
                  className="myTextField"
                  id="username"
                  value={username}
                  onChange={onChange}
                  label="Nas Username"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        < FaUserEdit className="text-black dark:text-black" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </motion.div>

            <DialogActions sx={{ mt: 2 }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* <Button
                  onClick={handleClose}
                  startIcon={<CloseIcon />}
                  variant="outlined"
                  color="error"
                  sx={{ borderRadius: '8px' }}
                >
                  Cancel
                </Button> */}


              </motion.div>

              <motion.div
              className='flex gap-2'
               
              >

<motion.button 
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
className={`  font-medium p-4
         text-white rounded-lg transition-all
             hover:bg-red-500 bg-red-500`}
             onClick={ (e)=> {
              e.preventDefault()
               handleClose()
             } }>
        Cancel
      </motion.button>
      <motion.div
       whileHover={{ scale: 1.05 }}
       whileTap={{ scale: 0.95 }}
      >


        <motion.button
        type='submit'
        whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
className={`  font-medium p-4
         text-white rounded-lg transition-all
             hover:bg-green-600 bg-green-500`}
            
        >
          {editingRouter ? 'Update' : 'Save'}
        </motion.button>
                {/* <LoadingButton
                  type="submit"
                  variant="contained"
                  startIcon={<AutorenewIcon />}
                  loading={isloading}
                  color="success"
                  sx={{ borderRadius: '8px', background: '#4CAF50' }}
                >
                  Save
                </LoadingButton> */}
                </motion.div>
              </motion.div>
            </DialogActions>
          </form>



        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default EditNas;