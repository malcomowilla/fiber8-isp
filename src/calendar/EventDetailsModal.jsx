import {
  Modal,
  Box,
  Typography,
  Button,
  Stack,
  Divider,
  Chip,
} from '@mui/material';
import { Edit, Delete, Close, CalendarToday, Schedule, } from '@mui/icons-material';
import dayjs from 'dayjs';
import { IconButton } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: '500px' },
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

const EventDetailsModal = ({ open, onClose, event, onEdit, onDelete }) => {
  if (!event) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h2">
            Event Details
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Stack spacing={3}>
          <Box>
            <Chip
              label={event.title}
              sx={{
                backgroundColor: event.color || '#3174ad',
                color: 'white',
                fontSize: '1rem',
                height: 'auto',
                padding: '8px 12px'
              }}
            />
          </Box>

          {event.description && (
            <Typography variant="body1" paragraph>
              {event.description}
            </Typography>
          )}

          <Stack spacing={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarToday color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {dayjs(event.start).format('MMMM D, YYYY')}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Schedule color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {dayjs(event.start).format('h:mm A')} - {dayjs(event.end).format('h:mm A')}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              startIcon={<Delete />}
              onClick={onDelete}
              color="error"
            >
              Delete
            </Button>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={onEdit}
            >
              Edit
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default EventDetailsModal;