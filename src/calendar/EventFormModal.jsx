import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: '600px' },
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

const EventFormModal = ({ open, onClose, event, onSubmit, isEdit }) => {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    start: event?.start || new Date(),
    end: event?.end || dayjs().add(1, 'hour').toDate(),
    description: event?.description || '',
    color: event?.color || '#3174ad'
  });

  const colors = [
    { value: '#3174ad', label: 'Blue' },
    { value: '#4caf50', label: 'Green' },
    { value: '#f44336', label: 'Red' },
    { value: '#ff9800', label: 'Orange' },
    { value: '#9c27b0', label: 'Purple' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" mb={2}>
          {isEdit ? 'Edit Event' : 'Create New Event'}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Event Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <DateTimePicker
                label="Start Date & Time"
                value={dayjs(formData.start)}
                onChange={(newValue) => 
                  setFormData(prev => ({ ...prev, start: newValue.toDate() }))
                }
                slotProps={{ textField: { fullWidth: true } }}
              />

              <DateTimePicker
                label="End Date & Time"
                value={dayjs(formData.end)}
                onChange={(newValue) => 
                  setFormData(prev => ({ ...prev, end: newValue.toDate() }))
                }
                minDateTime={dayjs(formData.start)}
                slotProps={{ textField: { fullWidth: true } }}
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />

              <FormControl fullWidth>
                <InputLabel>Color</InputLabel>
                <Select
                  value={formData.color}
                  onChange={handleChange}
                  name="color"
                  renderValue={(selected) => (
                    <Chip
                      sx={{ backgroundColor: selected, color: 'white' }}
                      label={colors.find(c => c.value === selected)?.label}
                    />
                  )}
                >
                  {colors.map((color) => (
                    <MenuItem key={color.value} value={color.value}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor: color.value,
                          mr: 2,
                          borderRadius: '4px'
                        }}
                      />
                      {color.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained">
                  {isEdit ? 'Update Event' : 'Create Event'}
                </Button>
              </Stack>
            </Stack>
          </LocalizationProvider>
        </form>
      </Box>
    </Modal>
  );
};

export default EventFormModal;