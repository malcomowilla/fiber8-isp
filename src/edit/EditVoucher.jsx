import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import { Autocomplete } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wifi, Users, Loader2, Plus } from "lucide-react";

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#10b981",
      borderWidth: "2px",
    },
  },
  "& label.Mui-focused": { color: "#10b981" },
};

function EditVoucher({
  open,
  handleClose,
  voucherForm,
  handleChangeVoucher,
  createVoucher,
  setVoucherForm,
  editVoucher,
  loading,
}) {
  const [pppoePackages, setPppoePackages] = useState([]);
  const subdomain = window.location.hostname.split(".")[0];

  const fetchHotspotPackages = useCallback(async () => {
    try {
      const response = await fetch("/api/hotspot_packages", {
        headers: { "X-Subdomain": subdomain },
      });
      if (response.ok) {
        const data = await response.json();
        setPppoePackages(data);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  }, []);

  useEffect(() => {
    fetchHotspotPackages();
  }, [fetchHotspotPackages]);

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        },
      }}
    >
      <form onSubmit={createVoucher}>
        {/* Header */}
        <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 px-6 py-5 font-sans">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Wifi className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg leading-tight">
                {editVoucher ? "Update Voucher" : "New Voucher"}
              </p>
              <p className="text-white/70 text-xs">
                {editVoucher ? "Modify voucher details" : "Create a hotspot access voucher"}
              </p>
            </div>
          </div>
        </div>

        <DialogContent className="!p-6 !pt-6 font-sans">
          <div className="flex flex-col gap-5">
            <Autocomplete
              options={pppoePackages}
              getOptionLabel={(option) => `${option.name} - ${option.speed || "unlimited"} Mbps`}
              value={pppoePackages.find((pkg) => pkg.name === voucherForm.package) || null}
              onChange={(event, newValue) => {
                handleChangeVoucher({
                  target: { name: "package", value: newValue ? newValue.name : "" },
                });
              }}
              isOptionEqualToValue={(option, value) => option.name === value.name}
              renderInput={(params) => (
                <TextField {...params} label="Package" variant="outlined" sx={textFieldSx} />
              )}
            />

            <TextField
              label="Number of Vouchers"
              value={voucherForm.number_of_vouchers ?? "1"}
              onChange={(e) => setVoucherForm({ ...voucherForm, number_of_vouchers: e.target.value })}
              type="number"
              placeholder="1"
              fullWidth
              sx={textFieldSx}
              InputProps={{
                startAdornment: <Users className="w-4 h-4 text-gray-400 mr-2" />,
              }}
            />
          </div>
        </DialogContent>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6 pt-2 font-sans">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40"
          >
            Cancel
          </button>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/20 disabled:opacity-70 min-w-[150px]"
          >
            <AnimatePresence mode="wait" initial={false}>
              {loading ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {editVoucher ? "Updating..." : "Creating..."}
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  {editVoucher ? <Wifi className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {editVoucher ? "Update Voucher" : "Add Voucher"}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </form>
    </Dialog>
  );
}

export default EditVoucher;