
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
import Box from "@mui/material/Box";

import TextField from '@mui/material/TextField';
import { FaSave, FaPaperPlane } from "react-icons/fa"; // Import icons
import { motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";
import { FaUsers } from "react-icons/fa"; // Import user icon
import { LuCalendar1 } from "react-icons/lu";
import Autocomplete from '@mui/material/Autocomplete';







function CompensationVoucher({ open, handleClose,voucherForm, handleChangeVoucher,
    createVoucher, setVoucherForm
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

const options=['days', 'hours', 'minutes']
const [validity_period_units, setValidity_period_units] = useState(options[2])


  const fetchPppoePackages =useCallback(
    async() => {
      
      try {
        const response = await fetch("/api/hotspot_packages", {
          method: "GET",
          headers: {
            "X-Subdomain": subdomain,
          },
        }); // Replace with your API endpoint
        if (response.ok) {
          const data = await response.json();
          setPppoePackages(data); // Set the fetched packages to state
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
  

    fetchPppoePackages();
  }, [fetchPppoePackages]);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  useEffect(() => {
    // Calculate the date and time 30 days from the current date and time
    const thirtyDaysFromNow = dayjs(new Date()).add(30, "day");
    setNewDate(thirtyDaysFromNow);
  }, []);

  return (
    <React.Fragment>


      <Dialog fullWidth={fullWidth} maxWidth={maxWidth} open={open} onClose={handleClose}>
      <form onSubmit={createVoucher}>

        <DialogTitle>Compensate Vouchers</DialogTitle>


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
              <InputLabel >Package</InputLabel>
              <Select
                // labelId="demo-simple-select-autowidth-label"
                name="package"
                autoWidth
                label="Package"
                value={voucherForm.package}
                onChange={(e)=>handleChangeVoucher(e)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {/* Map through the fetched PPPoE packages */}
                {pppoePackages.map((pkg) => (
                  <MenuItem key={pkg.id}  value={pkg.name}>
                    {pkg.name} - {pkg.speed} Mbps
                  </MenuItem>
                ))}
              </Select>

             
            </FormControl>
          </div>


<div className='flex'>
   <Box
                sx={{
                  "& > :not(style)": { m: 1, width: "80ch" },
                }}
              >
                <TextField
                  label="Compensate Duration"
                  sx={{
                    "& label.Mui-focused": {
                      color: "black",
                      fontSize: "16px",
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
                  id="validity"
                  // value={validity}
                  InputProps={{
                    startAdornment: <LuCalendar1 className="mr-2" />,
                  }}
                  // onChange={handleChangeHotspotPackage}
                  placeholder="validity-period..."
                  type="number"
                ></TextField>
              </Box>



               <FormControl
                sx={{
                  "& > :not(style)": { m: 1, width: "50ch" },
                  "& label.Mui-focused": {
                    color: "black",
                    fontSize: "16px",
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
              >
               
               <Autocomplete
               className='myTextField'
  id="validity_period_units"
  options={options}
  value={validity_period_units}
  // onChange={(event, newValue) => {
  //   setHotspotPackage({
  //     ...hotspotPackage,
  //     validity_period_units: newValue,
  //   });
  // }}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Compensate Duration Units"
      variant="outlined"
    />
  )}
  sx={{ width: '100%' }}
/>
              </FormControl>

</div>

         
        </DialogContent>
        <DialogActions>
          <button

          
            className="bg-red-300 hover:bg-red-800 rounded-lg
             hover:scale-105 hover:text-white text-black
             flex flex-row gap-x-2
             transition-transform 
             duration-200 p-2"
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
      className="flex items-center justify-center gap-2 bg-green-500 cursor-pointer rounded-lg hover:scale-105 hover:text-white text-black transition-transform duration-200 p-2"
      whileHover={{ scale: 1.05 }} // Hover animation
      whileTap={{ scale: 0.95 }} // Tap animation
      key={isSave ? "save" : "send"} // Key prop for animation reset
      initial={{ opacity: 0, y: 10 }} // Initial animation state
      animate={{ opacity: 1, y: 0 }} // Animate in
      exit={{ opacity: 0, y: -10 }} // Animate out
      transition={{ duration: 0.3 }} // Animation duration
    >
      {isSave ? (
        <>
          <FaSave className="w-5 h-5" /> {/* Save icon */}
          <span>Save</span>
        </>
      ) : (
        <>
          <FaPaperPlane className="w-5 h-5" /> {/* Send icon */}
          <span>Send</span>
        </>
      )}
    </motion.button>
        </DialogActions>
        </form>

      </Dialog>

    </React.Fragment>
  );
}

export default CompensationVoucher;




