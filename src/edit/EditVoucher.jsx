import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import dayjs from "dayjs";
import TextField from '@mui/material/TextField';
import { FaSave, FaPaperPlane } from "react-icons/fa"; // Import icons
import { motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";
import { FaUsers } from "react-icons/fa"; // Import user icon

import { Autocomplete,  } from '@mui/material';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useMemo } from 'react';




function EditVoucher({ open, handleClose,voucherForm, handleChangeVoucher,
    createVoucher, setVoucherForm, editVoucher,loading  
 }) {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("lg");
  const [age, setAge] = React.useState("");
  const [dateTimeValue, setDateTimeValue] = useState(dayjs(new Date()));
  const [newDate, setNewDate] = React.useState(null);
  const [pppoePackages, setPppoePackages] = useState([]); // State to store PPPoE packages


  const [isSave, setIsSave] = useState(true);

  // Toggle between "Save" and "Send" every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSave((prev) => !prev);
    }, 5000); // Switch every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);


  const subdomain = window.location.hostname.split('.')[0]





function useIsDarkMode() {
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const root = document.documentElement;

    const update = () => setIsDark(root.classList.contains('dark'));
    update();

    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return isDark;
}




const isDark = useIsDarkMode();

const tableTheme = useMemo(() => createTheme({
  palette: {
    mode: isDark ? 'dark' : 'light',
    background: {
      paper: isDark ? '#1e1e1e' : '#ffffff',
      default: isDark ? '#1e1e1e' : '#ffffff',
    },
    text: {
      primary: isDark ? '#f1f1f1' : '#1a1a1a',
      secondary: isDark ? '#a3a3a3' : '#6b7280',
    },
  },
}), [isDark]);










  const fetchHotspotPackages =useCallback(
    async() => {
      
      try {
        const response = await fetch("/api/hotspot_packages", {
          method: "GET",
          headers: {
            "X-Subdomain": subdomain,
          },
        }); 
        if (response.ok) {
          const data = await response.json();
          setPppoePackages(data); 
        } else {
          console.error("Failed to fetch PPPoE packages");
        }
      } catch (error) {
        console.error("Error fetching PPPoE packages:", error);
      }

    },
    [],
  )
  



  // Fetch PPPoE packages from the backend
  useEffect(() => {
  

    fetchHotspotPackages();
  }, [fetchHotspotPackages]);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  useEffect(() => {
    // Calculate the date and time 30 days from the current date and time
    const thirtyDaysFromNow = dayjs(new Date()).add(30, "day");
    setNewDate(thirtyDaysFromNow);
  }, []);

  return (
      <ThemeProvider theme={tableTheme}>
    
    <React.Fragment>


      <Dialog fullWidth={fullWidth} maxWidth={maxWidth} open={open} onClose={handleClose}>
      <form onSubmit={createVoucher}>

        <DialogTitle>
          
          <p className="font-sans
">Add Voucher</p>
          
          </DialogTitle>


        <DialogContent>

       
          <div className="">
            <FormControl
              fullWidth
              sx={{
                
                m: 1,
                "& label.Mui-focused": {
                  color: "black",
                  fontSize: "20px",
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                    borderWidth: "3px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "black",
                    fontSize: "20px",
                  },
                },
              }}
            >
             <Autocomplete
             className='myTextField font-sans
'
  options={pppoePackages}
  getOptionLabel={(option) => `${option.name} - ${option.speed || 'unlimited'} Mbps`}
  value={pppoePackages.find(pkg => pkg.name === voucherForm.package) || null}
  onChange={(event, newValue) => {
    handleChangeVoucher({
      target: {
        name: "package",
        value: newValue ? newValue.name : ""
      }
    });
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Package"
      variant="outlined"
    />
  )}
  renderOption={(props, option) => (
    <MenuItem {...props} key={option.id}>
      {option.name} - {option.speed} Mbps
    </MenuItem>
  )}
  isOptionEqualToValue={(option, value) => option.name === value.name}
/>
{/* 
              <TextField
              name='phone'
               value={voucherForm.phone}
              onChange={(e)=> setVoucherForm({...voucherForm, phone: e.target.value})}
              // type='number'
              className='myTextField' 
              sx={{
            mt:2
              }}
              label='Phone Number'  fullWidth /> */}
            </FormControl>
          </div>

          <div className="flex gap-3 mt-4 font-sans
">
              <TextField
                label="Number Of Vouchers"
                // value={voucherForm.number_of_vouchers}
                value={voucherForm.number_of_vouchers ?? '1'}
                // name='number_of_vouchers'
                onChange={(e)=> setVoucherForm({...voucherForm, number_of_vouchers: e.target.value})}
                // id="number_of_vouchers"
                sx={{
                  "& label.Mui-focused": {
                    color: "black",
                  },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "black",
                      borderWidth: "3px",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
                className="myTextField"
                type="number"
                placeholder="Number of shared users..."
                fullWidth
                // InputProps={{
                //   startAdornment: (
                //     <FaUsers className="mr-2 text-gray-500" /> // Add user icon
                //   ),
                // }}
              ></TextField>
            </div>
        </DialogContent>
        <DialogActions>
          <button

          
            className="bg-red-300 hover:bg-red-800 rounded-lg
             hover:scale-105 hover:text-white text-black
             flex flex-row gap-x-2
             transition-transform 
             duration-200 p-2 font-sans
"
            onClick={ (e) => {
e.preventDefault()
              handleClose()
            }
              
              }
          >
             <FaExclamationTriangle />
            Cancel

           
          </button>





          <motion.button
      type="submit"
      className="flex items-center justify-center gap-2 bg-green-500 cursor-pointer rounded-lg hover:scale-105
       hover:text-white text-black transition-transform duration-200 p-2"
      whileHover={{ scale: 1.05 }} // Hover animation
      whileTap={{ scale: 0.95 }} // Tap animation
      key={isSave ? "save" : "send"} // Key prop for animation reset
     
      transition={{ duration: 0.3 }} // Animation duration
    >
      {editVoucher ? <p className='text-white font-sans
'>Update Voucher</p> : <p className="font-sans
">Add Voucher</p>}
 {loading && (
  <span className="w-4 h-4 border-2 border-blue-300 mt-1 border-t-blue-500 rounded-full
         animate-spin" ></span>
 )}

    </motion.button>
        </DialogActions>
        </form>

      </Dialog>

    </React.Fragment>
    </ThemeProvider>
  );
}

export default EditVoucher;