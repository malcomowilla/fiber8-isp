import * as React from "react";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";

function EditVoucher({ open, handleClose,voucherForm, handleChangeVoucher,
    createVoucher
 }) {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("lg");
  const [age, setAge] = React.useState("");
  const [dateTimeValue, setDateTimeValue] = useState(dayjs(new Date()));
  const [newDate, setNewDate] = React.useState(null);
  const [pppoePackages, setPppoePackages] = useState([]); // State to store PPPoE packages

  // Fetch PPPoE packages from the backend
  useEffect(() => {
    const fetchPppoePackages = async () => {
      try {
        const response = await fetch("/api/hotspot_packages"); // Replace with your API endpoint
        if (response.ok) {
          const data = await response.json();
          setPppoePackages(data); // Set the fetched packages to state
        } else {
          console.error("Failed to fetch PPPoE packages");
        }
      } catch (error) {
        console.error("Error fetching PPPoE packages:", error);
      }
    };

    fetchPppoePackages();
  }, []);

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

        <DialogTitle>Add Voucher</DialogTitle>


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
        </DialogContent>
        <DialogActions>
          <button
            className="bg-red-300 hover:bg-red-800 rounded-lg
             hover:scale-105 hover:text-white text-black transition-transform 
             duration-200 p-2"
            onClick={ (e) => {
e.preventDefault()
              handleClose()
            }
              
              }
          >
            Cancel
          </button>





          <button
          type='submit'
            className="bg-green-500
            cursor-pointer
            rounded-lg hover:scale-105 hover:text-white
             text-black transition-transform duration-200 p-2"
          >
            Save
          </button>
        </DialogActions>
        </form>

      </Dialog>

    </React.Fragment>
  );
}

export default EditVoucher;