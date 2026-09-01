import MaterialTable from "material-table";
import { useState, useCallback, useEffect, useMemo } from 'react';
import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Box, Paper, Grid, Typography, ToggleButtonGroup, ToggleButton,
  Tabs, Tab, IconButton, TextField, InputAdornment, Chip, Avatar, Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDebounce } from 'use-debounce';
import { toast, ToastContainer } from 'react-toastify';
import toaster, { Toaster } from 'react-hot-toast';
import TicketForm from './TicketForm';
import TicketSubmit from './TicketSubmit';
import DeleteTicket from './DeleteTicket';

const STATUS_META = {
  Open: { color: '#DC2626', bg: '#FEE2E2', icon: LockOpenIcon },
  'In Progress': { color: '#D97706', bg: '#FEF3C7', icon: PendingActionsIcon },
  Pending: { color: '#6B7280', bg: '#F3F4F6', icon: PendingActionsIcon },
  Resolved: { color: '#15803D', bg: '#DCFCE7', icon: TaskAltIcon },
};

const PRIORITY_META = {
  Urgent: '#DC2626',
  Medium: '#D97706',
  Low: '#15803D',
};

const StatCard = ({ label, value, icon: Icon, tint }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.25,
      borderRadius: 3,
      border: '1px solid',
      borderColor: 'divider',
      display: 'flex',
      alignItems: 'center',
      gap: 2,
    }}
  >
    <Box
      sx={{
        width: 44, height: 44, borderRadius: 2.5,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        bgcolor: tint, color: '#fff', flexShrink: 0,
      }}
    >
      <Icon fontSize="small" />
    </Box>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.1 }}>{value}</Typography>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
    </Box>
  </Paper>
);

const CustomerTickets = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenTicket, setIsOpenTicket] = useState(false);
  const [agentRole, setAgentRole] = useState([]);
  const [ticket, setTicket] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setloading] = useState(false);
  const [openLoad, setOpenLoad] = useState(false);
  const [isOpenDelete, setisOpenDelete] = useState(false);
  const [phone, setPhone] = useState('');
  const [customer_name, setName] = useState('');
  const [ticketNo, setTicketNo] = useState('');
  const [updatedDate, setUpdatedDate] = useState('');
  const [ticketForm, setTicketForm] = useState({
    customer: '', ticket_category: '', priority: '', agent: '', name: '',
    email: '', phone_number: '', status: '', issue_description: '',
    agent_review: '', agent_response: '', ticket_updates: []
  });

  const [search, setSearch] = useState('');
  const [searchInput] = useDebounce(search, 500);
  const [isSearching, setIsSearching] = useState(false);
  const [seeTicketError, setSeeTicketError] = useState(false);
  const [ticketError, setTicketError] = useState('');
  const [statusTab, setStatusTab] = useState('All');
  const [view, setView] = useState('table');
  const [stats, setStats] = useState({ total: 0, open: 0, resolved: 0, urgent: 0 });

  const subdomain = window.location.hostname.split('.')[0];

  const fetchStats = useCallback(async () => {
    try {
      const [t, o, s, u] = await Promise.all([
        fetch('/api/total_tickets', { headers: { 'X-Subdomain': subdomain } }).then(r => r.json()),
        fetch('/api/open_tickets', { headers: { 'X-Subdomain': subdomain } }).then(r => r.json()),
        fetch('/api/solved_tickets', { headers: { 'X-Subdomain': subdomain } }).then(r => r.json()),
        fetch('/api/high_priority_tickets', { headers: { 'X-Subdomain': subdomain } }).then(r => r.json()),
      ]);
      setStats({
        total: t.total_tickets ?? 0,
        open: o.open_tickets ?? 0,
        resolved: s.solved_tickets ?? 0,
        urgent: u.high_priority_tickets ?? 0,
      });
    } catch (e) { /* stat cards are non-critical */ }
  }, [subdomain]);

  const fetchSubscribers = useCallback(async () => {
    try {
      const response = await fetch('/api/subscribers', { headers: { 'X-Subdomain': subdomain } });
      const newData = await response.json();
      if (response.ok) {
        setCustomers(newData);
      } else {
        if (response.status === 401) {
          toast.error(newData.error, { position: 'top-center', duration: 4000 });
          setTimeout(() => { window.location.href = '/signin' }, 1900);
        }
        toast.error('Failed to get subscribers', { position: 'top-center', duration: 3000 });
      }
    } catch (error) {
      toast.error('Failed to get subscribers, please retry in a moment', { position: 'top-center', duration: 3000 });
    }
  }, [subdomain]);

  useEffect(() => { fetchSubscribers(); fetchStats(); }, [fetchSubscribers, fetchStats]);

  const getAgentsCustomerSupportAndTechnicians = useCallback(async () => {
    try {
      const response = await fetch('/api/get_all_admins', { headers: { 'X-Subdomain': subdomain } });
      const newData = await response.json();
      if (response.ok) setAgentRole(newData);
    } catch (error) { /* noop */ }
  }, [subdomain]);

  useEffect(() => { getAgentsCustomerSupportAndTechnicians(); }, [getAgentsCustomerSupportAndTechnicians]);

  const getTicket = useCallback(async () => {
    try {
      setIsSearching(true);
      const response = await fetch('/api/get_tickets', { headers: { 'X-Subdomain': subdomain } });
      const newData = await response.json();
      if (response.ok) {
        setTicket(newData.filter((t) =>
          search.toLowerCase() === '' ? true : t.ticket_number.toLowerCase().includes(search.toLowerCase())
        ));
      } else if (response.status === 401) {
        toast.error(newData.error, { position: 'top-center', duration: 4000 });
        setTimeout(() => { window.location.href = '/signin' }, 1900);
      }
    } catch (error) {
      toaster.error('Failed to load tickets, please retry in a moment', { position: 'top-right', duration: 3000 });
    } finally {
      setIsSearching(false);
    }
  }, [searchInput, subdomain]);

  useEffect(() => { getTicket(); }, [getTicket]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTicket = async (e) => {
    e.preventDefault();
    try {
      setloading(true);
      setOpenLoad(true);
      const url = ticketForm.id ? `/api/update_ticket/${ticketForm.id}` : '/api/create_ticket';
      const method = ticketForm.id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
        body: JSON.stringify(ticketForm),
      });
      const newData = await response.json();

      if (response.ok) {
        setOpenLoad(false);
        if (ticketForm.id) {
          toaster.success('Ticket updated successfully!', { position: 'top-center', duration: 4000 });
          setTicket(ticket.map((item) => (item.id === ticketForm.id ? newData : item)));
        } else {
          toaster.success('Ticket created successfully!', { position: 'top-center', duration: 4000 });
          setTicket((prev) => [...prev, newData]);
        }
        setIsOpen(false);
        setIsOpenTicket(false);
        fetchStats();
      } else {
        setOpenLoad(false);
        setIsOpen(false);
        setSeeTicketError(true);
        setTicketError(newData.error);
        if (response.status === 401) {
          toast.error(newData.error, { position: 'top-center', duration: 4000 });
          setTimeout(() => { window.location.href = '/signin' }, 1900);
        }
        toaster.error('Error creating ticket', { position: 'top-center', duration: 3000 });
      }
    } catch (error) {
      setSeeTicketError(true);
      toaster.error('Error creating ticket, please retry in a moment', { position: 'top-center', duration: 3000 });
      setOpenLoad(false);
      setIsOpen(false);
    } finally {
      setloading(false);
    }
  };

  const deleteTicket = async (id) => {
    try {
      setloading(true);
      const response = await fetch(`/api/support_tickets/${id}`, {
        method: 'DELETE',
        headers: { 'X-Subdomain': subdomain },
      });
      if (response.ok) {
        setTicket(ticket.filter((t) => t.id !== id));
        toaster.success('Ticket deleted successfully', { position: 'top-right', duration: 4000 });
        fetchStats();
      } else {
        toaster.error('Failed to delete ticket', { position: 'top-right', duration: 4000 });
      }
    } catch (error) {
      toaster.error('Failed to delete ticket, please retry in a moment', { position: 'top-right', duration: 3000 });
    } finally {
      setisOpenDelete(false);
      setloading(false);
    }
  };

  const handleAddButton = () => {
    setIsOpenTicket(true);
    setTicketForm({
      customer: '', ticket_category: '', priority: '', agent: '', name: '',
      email: '', phone_number: '', status: '', issue_description: '',
      agent_review: '', agent_response: '', ticket_updates: []
    });
  };

  const handleRowClick = (event, rowData) => {
    const customerData = customers.find((c) => c.name === rowData.customer);
    setPhone(rowData.phone_number);
    setTicketForm(rowData);
    setName(customerData?.name || rowData.customer);
    setTicketNo(rowData.ticket_number);
    setUpdatedDate(rowData.formatted_date_closed);
    setIsOpen(true);
  };

  const DeleteButton = () => (
    <IconButton size="small" sx={{ color: '#8B0000' }} onClick={() => setisOpenDelete(true)}>
      <DeleteIcon fontSize="small" />
    </IconButton>
  );
  const EditButton = () => (
    <IconButton size="small" sx={{ color: '#15803D' }} onClick={() => setIsOpen(true)}>
      <EditIcon fontSize="small" />
    </IconButton>
  );

  const filteredTickets = useMemo(
    () => statusTab === 'All' ? ticket : ticket.filter((t) => t.status === statusTab),
    [ticket, statusTab]
  );

  const kanbanColumns = ['Open', 'In Progress', 'Pending', 'Resolved'];

  return (
    <>
     <Toaster />
<ToastContainer />
      <TicketForm phone={phone} customer_name={customer_name} ticketNo={ticketNo} loading={loading}
        openLoad={openLoad} handleAddTicket={handleAddTicket} isOpen={isOpen} setIsOpen={setIsOpen}
        agentRole={agentRole} ticketForm={ticketForm} setTicketForm={setTicketForm} handleChange={handleChange}
        updatedDate={updatedDate} seeTicketError={seeTicketError} setSeeTicketError={setSeeTicketError}
        ticketError={ticketError} setTicketError={setTicketError} />

      <TicketSubmit openLoad={openLoad} isloading={loading} handleAddTicket={handleAddTicket}
        handleChange={handleChange} isOpenTicket={isOpenTicket} setIsOpenTicket={setIsOpenTicket}
        customers={customers} agentRole={agentRole} ticketForm={ticketForm} setTicketForm={setTicketForm}
        seeTicketError={seeTicketError} setSeeTicketError={setSeeTicketError}
        ticketError={ticketError} setTicketError={setTicketError} />

      <DeleteTicket deleteTicket={deleteTicket} id={ticketForm.id} isOpenDelete={isOpenDelete}
        setisOpenDelete={setisOpenDelete} isloading={loading} />

      <Box sx={{ p: { xs: 1.5, md: 3 } }}>
        {/* Header */}
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1.5} sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Support Tickets</Typography>
            <Typography variant="body2" color="text.secondary">
              Track issues from open to resolved, with live technician updates.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <IconButton onClick={() => { getTicket(); fetchStats(); }} title="Refresh">
              <RefreshIcon />
            </IconButton>
            <ToggleButtonGroup value={view} exclusive size="small"
              onChange={(e, v) => v && setView(v)}>
              <ToggleButton value="table"><ViewListIcon fontSize="small" /></ToggleButton>
              <ToggleButton value="board"><ViewKanbanIcon fontSize="small" /></ToggleButton>
            </ToggleButtonGroup>
            <Box onClick={handleAddButton} sx={{
              bgcolor: '#15803D', color: '#fff', borderRadius: 2, px: 2.5, py: 1,
              display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer',
              fontSize: 14, fontWeight: 600, '&:hover': { bgcolor: '#166534' }
            }}>
              <AddIcon fontSize="small" /> New Ticket
            </Box>
          </Stack>
        </Stack>

        {/* Stat cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} md={3}>
            <StatCard label="Total tickets" value={stats.total} icon={ConfirmationNumberIcon} tint="#334155" />
          </Grid>
          <Grid item xs={6} md={3}>
            <StatCard label="Open" value={stats.open} icon={LockOpenIcon} tint="#DC2626" />
          </Grid>
          <Grid item xs={6} md={3}>
            <StatCard label="Resolved" value={stats.resolved} icon={TaskAltIcon} tint="#15803D" />
          </Grid>
          <Grid item xs={6} md={3}>
            <StatCard label="Urgent" value={stats.urgent} icon={PriorityHighIcon} tint="#D97706" />
          </Grid>
        </Grid>

        {/* Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }} spacing={1.5} sx={{ mb: 2 }}>
          <Tabs value={statusTab} onChange={(e, v) => setStatusTab(v)} variant="scrollable">
            <Tab label="All" value="All" />
            <Tab label="Open" value="Open" />
            <Tab label="In Progress" value="In Progress" />
            <Tab label="Pending" value="Pending" />
            <Tab label="Resolved" value="Resolved" />
          </Tabs>
          <TextField
            size="small" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ticket number..."
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
            sx={{ minWidth: 260 }}
          />
        </Stack>

        {/* Board view */}
        {view === 'board' ? (
          <Grid container spacing={2}>
            {kanbanColumns.map((col) => {
              const meta = STATUS_META[col];
              const Icon = meta.icon;
              const columnTickets = ticket.filter((t) => t.status === col);
              return (
                <Grid item xs={12} sm={6} md={3} key={col}>
                  <Paper elevation={0} sx={{ p: 1.5, borderRadius: 3, bgcolor: '#FAFAFA', minHeight: 200 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5, px: 0.5 }}>
                      <Icon sx={{ color: meta.color }} fontSize="small" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{col}</Typography>
                      <Chip label={columnTickets.length} size="small" sx={{ ml: 'auto', bgcolor: meta.bg, color: meta.color, fontWeight: 700 }} />
                    </Stack>
                    <Stack spacing={1}>
                      {columnTickets.map((t) => (
                        <Paper key={t.id} elevation={0} onClick={(e) => handleRowClick(e, t)}
                          sx={{ p: 1.5, borderRadius: 2, cursor: 'pointer', border: '1px solid', borderColor: 'divider', '&:hover': { borderColor: meta.color } }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{t.ticket_number}</Typography>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: PRIORITY_META[t.priority] || '#9CA3AF', mt: 0.7 }} />
                          </Stack>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            {t.ticket_category}
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Avatar sx={{ width: 22, height: 22, fontSize: 11, bgcolor: meta.color }}>
                              {(t.customer || '?').charAt(0)}
                            </Avatar>
                            <Typography variant="caption">{t.customer}</Typography>
                          </Stack>
                        </Paper>
                      ))}
                      {columnTickets.length === 0 && (
                        <Typography variant="caption" color="text.secondary" sx={{ px: 0.5 }}>No tickets</Typography>
                      )}
                    </Stack>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
            <MaterialTable
              columns={[
                {
                  title: 'Status', field: 'status', width: 140,
                  render: (rowData) => {
                    const meta = STATUS_META[rowData.status] || {};
                    return (
                      <Chip label={rowData.status} size="small"
                        sx={{ bgcolor: meta.bg, color: meta.color, fontWeight: 700 }} />
                    );
                  },
                },
                {
                  title: 'Customer', field: 'customer',
                  render: (rowData) => (
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <Avatar sx={{ width: 32, height: 32, fontSize: 13, bgcolor: '#334155' }}>
                        {(rowData.customer || '?').split(' ').map((n) => n.charAt(0)).join('')}
                      </Avatar>
                      <Typography variant="body2">{rowData.customer}</Typography>
                    </Stack>
                  ),
                },
                { title: 'Category', field: 'ticket_category' },
                {
                  title: 'Priority', field: 'priority',
                  render: (rowData) => (
                    <Chip label={rowData.priority} size="small" variant="outlined"
                      sx={{ borderColor: PRIORITY_META[rowData.priority], color: PRIORITY_META[rowData.priority], fontWeight: 700 }} />
                  ),
                },
                { title: 'Assigned To', field: 'agent', render: (r) => r.agent || '—' },
                { title: 'Ticket #', field: 'ticket_number' },
                {
                  title: 'Last update', field: 'technician_updated_at',
                  render: (rowData) => {
                    const updates = rowData.ticket_updates || [];
                    const latest = updates[0];
                    return latest
                      ? <Typography variant="caption">{latest.status} · {new Date(latest.created_at).toLocaleString()}</Typography>
                      : <Typography variant="caption" color="text.secondary">No technician updates yet</Typography>;
                  },
                },
                {
                  title: 'Actions', field: 'actions', sorting: false,
                  render: () => <Stack direction="row"><EditButton /><DeleteButton /></Stack>,
                },
              ]}
              actions={[
                { icon: () => <AddIcon />, isFreeAction: true, tooltip: 'Add Ticket', onClick: handleAddButton },
                { icon: () => <GetAppIcon />, isFreeAction: true, tooltip: 'Export' },
              ]}
              title=""
              data={filteredTickets}
              onRowClick={handleRowClick}
              isLoading={isSearching}
              localization={{ body: { emptyDataSourceMessage: 'No tickets found. Create your first ticket to get started.' } }}
              options={{
                sorting: true,
                pageSizeOptions: [10, 25, 50],
                pageSize: 10,
                exportButton: true,
                exportAllData: true,
                search: false,
                showSelectAllCheckbox: false,
                showTextRowsSelected: false,
                emptyRowsWhenPaging: false,
                toolbar: false,
                headerStyle: { fontFamily: 'inherit', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4 },
                rowStyle: { fontFamily: 'inherit' },
              }}
            />
          </Paper>
        )}
      </Box>
    </>
  );
};

export default CustomerTickets;