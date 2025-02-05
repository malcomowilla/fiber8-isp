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

function EditNas({ open, handleClose, handleSubmit, nasformData, setnasFormData, isloading }) {
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
            <p className='font-thin'>Edit Device</p>
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
                    label="IP Address"
                    id="ip_address"
                    value={ip_address}
                    onChange={onChange}
                    fullWidth
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
                    className="myTextField"
                    id="name"
                    value={name}
                    onChange={onChange}
                    label="Name"
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
                    label="Password"
                    fullWidth
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
                  label="Username"
                  fullWidth
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LoadingButton
                  type="submit"
                  variant="contained"
                  startIcon={<AutorenewIcon />}
                  loading={isloading}
                  color="success"
                  sx={{ borderRadius: '8px', background: '#4CAF50' }}
                >
                  Save
                </LoadingButton>
              </motion.div>
            </DialogActions>
          </form>



<button   className={`flex-1 px-6 py-3.5 font-medium 
         text-gray-700 rounded-2xl transition-all
             hover:bg-red-500 bg-red-500`}
             onClick={handleClose}>
        Cancel
      </button>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default EditNas;