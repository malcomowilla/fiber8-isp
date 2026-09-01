import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Paper, Typography, Chip, TextField, Button, Stack,
  ToggleButtonGroup, ToggleButton, CircularProgress
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import toast, { Toaster } from 'react-hot-toast';

const STATUS_OPTIONS = ['In Progress', 'Pending', 'Resolved'];

const TechnicianTicketUpdate = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [ticket, setTicketInfo] = useState(null);
  const [status, setStatus] = useState('');
  const [remark, setRemark] = useState('');
  const [error, setError] = useState('');

  const subdomain = window.location.hostname.split('.')[0];

  const fetchTicket = useCallback(async () => {
    try {
      const res = await fetch(`/api/technician/tickets/${token}`, { headers: { 'X-Subdomain': subdomain } });
      const data = await res.json();
      if (res.ok) {
        setTicketInfo(data);
        setStatus(data.status);
      } else {
        setError(data.error || 'Ticket not found');
      }
    } catch (e) {
      setError('Could not load this ticket. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [token, subdomain]);

  useEffect(() => { fetchTicket(); }, [fetchTicket]);

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/technician/tickets/${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
        body: JSON.stringify({ ticket_update: { status, remark } }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Update sent');
        setRemark('');
        fetchTicket();
      } else {
        toast.error(data.error || 'Failed to update ticket');
      }
    } catch (e) {
      toast.error('Failed to update ticket');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Link no longer works</Typography>
        <Typography variant="body2" color="text.secondary">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', p: 2 }}>
      <Toaster />
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>#{ticket.ticket_number}</Typography>
          <Chip label={ticket.status} size="small" sx={{ fontWeight: 700 }} />
        </Stack>
        <Typography variant="caption" color="text.secondary">{ticket.ticket_category} · {ticket.priority} priority</Typography>
        <Typography variant="body2" sx={{ mt: 1.5 }}>{ticket.issue_description}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Customer: {ticket.customer}
        </Typography>
      </Paper>

      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Update status</Typography>
        <ToggleButtonGroup value={status} exclusive fullWidth onChange={(e, v) => v && setStatus(v)} sx={{ mb: 2 }}>
          {STATUS_OPTIONS.map((s) => <ToggleButton key={s} value={s}>{s}</ToggleButton>)}
        </ToggleButtonGroup>
        <TextField
          fullWidth multiline rows={3} label="Remarks / progress notes"
          placeholder="What did you find, what did you do, what's next?"
          value={remark} onChange={(e) => setRemark(e.target.value)}
        />
        <Button
          fullWidth variant="contained" sx={{ mt: 2, bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }}
          startIcon={<CheckCircleIcon />} disabled={submitting || !status}
          onClick={submit}
        >
          {submitting ? 'Sending...' : 'Send update'}
        </Button>
      </Paper>

      {ticket.updates?.length > 0 && (
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>History</Typography>
          <Stack spacing={1.5}>
            {ticket.updates.map((u, i) => (
              <Box key={i}>
                <Typography variant="body2"><b>{u.status}</b></Typography>
                {u.remark && <Typography variant="body2" color="text.secondary">{u.remark}</Typography>}
                <Typography variant="caption" color="text.secondary">{new Date(u.created_at).toLocaleString()}</Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

export default TechnicianTicketUpdate;