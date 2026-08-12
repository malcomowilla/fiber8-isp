import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Backdrop, IconButton, Tooltip, Chip, Paper } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Lottie from 'react-lottie';
import LoadingAnimation from '../loader/loading_animation.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MaterialTable from 'material-table';
import toaster, { Toaster } from 'react-hot-toast';
import DeleteClient from './DeleteClient';
import DeleteIcon from '@mui/icons-material/Delete';
import EditClient from './EditClient';
import EditIcon from '@mui/icons-material/Edit';
import AddClient from './AddClient';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { AccountBalanceWallet } from '@mui/icons-material';

function useIsDarkMode() {
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
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

const InviteClient = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone_number: '',
    userName: '',
    domainSubdomain: '',
    emailApiKey: '',
    senderEmail: '',
    smtpPassword: '',
    smtpHost: '',
    smtpUsername: '',
    plan: '',
    hotspot_plan: '',
    password: '',
    company_name: '',
    wallet_admin: false,
  });

  const [errors, setErrors] = useState({
    email: '',
    phone_number: '',
    username: '',
    plan: '',
    company_name: '',
  });

  const [loading, setLoading] = useState(false);
  const [openLoad, setOpenLoad] = useState(false);
  const [clients, setClients] = useState([]);
  const [fetchingClients, setFetchingClients] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [row_data, setRowData] = useState({});
  const [plans, setPlans] = useState([]);
  const [hotspot_plans, setHotspotPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentHotspotPlan, setCurrentHotspotPlan] = useState(null);
  const [addClient, setAddClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const isDark = useIsDarkMode();

  const tableTheme = useMemo(
    () =>
      createTheme({
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
        typography: { fontFamily: 'inherit' },
      }),
    [isDark]
  );

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleCloseAddClient = () => setAddClient(false);
  const handleAddClient = () => setAddClient(true);

  const subdomain = window.location.hostname.split('.')[0];

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/pp_poe_plans', { method: 'GET' });
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      } else {
        toast.error('Failed to fetch plans');
      }
    } catch (error) {
      toast.error('Error loading plans');
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchClients();
  }, []);

  const fetchHotspotPlans = async () => {
    try {
      const response = await fetch('/api/hotspot_plans', { method: 'GET' });
      if (response.ok) {
        const data = await response.json();
        setHotspotPlans(data);
      } else {
        toast.error('Failed to fetch plans');
      }
    } catch (error) {
      toast.error('Error loading plans');
    }
  };

  useEffect(() => {
    fetchHotspotPlans();
  }, []);

  const fetchClients = async () => {
    setFetchingClients(true);
    try {
      const response = await fetch('/api/get_all_clients', {
        method: 'GET',
        headers: { 'X-Subdomain': subdomain },
      });
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      } else {
        toast.error('Failed to fetch clients');
      }
    } catch (error) {
      toast.error('Error loading clients');
    } finally {
      setFetchingClients(false);
    }
  };

  const [currentPlan, setCurrentPlan] = useState(null);

  const flattenedData = clients
    ? clients.flatMap((client) =>
        client.users.map((admin) => ({
          ...admin,
          subdomain: client.subdomain,
          plan: currentPlan,
          hotspot_plan: currentHotspotPlan,
        }))
      )
    : [];

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return flattenedData;
    const lower = searchTerm.toLowerCase();
    return flattenedData.filter(
      (row) =>
        row.subdomain?.toLowerCase().includes(lower) ||
        row.username?.toLowerCase().includes(lower) ||
        row.email?.toLowerCase().includes(lower) ||
        row.phone_number?.toLowerCase().includes(lower)
    );
  }, [flattenedData, searchTerm]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', phone_number: '', username: '', plan: '' };

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }
    if (!formData.username.trim()) {
      newErrors.company_name = 'Company Name is required';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
      isValid = false;
    } else if (!phoneRegex.test(formData.phone_number)) {
      newErrors.phone_number = 'Please enter a valid phone number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();

    if (!formData.id) {
      if (!validateForm()) {
        toast.error('Please fill in all required fields correctly');
        return;
      }
    }

    setLoading(true);
    setOpenLoad(true);

    try {
      const method = formData.id ? 'PATCH' : 'POST';
      const url = formData.id ? `/api/update_client/${formData.id}` : '/api/invite_client_super_admins';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
        body: JSON.stringify({ ...formData, plan: formData.plan, wallet_admin: formData.wallet_admin }),
      });

      const newData = await response.json();
      if (response.ok) {
        setAddClient(false);
        if (formData.id) {
          handleCloseModal();
          toaster.success('Client updated successfully', { duration: 5000, icon: '✅' });
          setClients((prevClients) =>
            prevClients.map((client) => ({
              ...client,
              users: client.users.map((user) => (user.id === formData.id ? newData : user)),
            }))
          );
        } else {
          toaster.success('Client added successfully', { duration: 5000, icon: '✅' });
          fetchClients();
        }
        setFormData({
          email: '',
          phone_number: '',
          user_name: '',
          company_name: '',
          domainSubdomain: '',
          emailApiKey: '',
          senderEmail: '',
          smtpPassword: '',
          password: '',
          smtpHost: '',
          smtpUsername: '',
          plan: '',
        });
      } else {
        setAddClient(false);
        toaster.error('Something went wrong, please try again', { duration: 5000, position: 'top-center' });
      }
    } catch (error) {
      toaster.error('Something went wrong, please try again', { duration: 5000, position: 'top-center' });
    } finally {
      setLoading(false);
      setOpenLoad(false);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingAnimation,
    rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
  };

  const handleRowClick = (event, rowData) => {
    setFormData(rowData);
  };

  // Deletes the admin + their entire account (routers, subscribers, invoices, etc.)
  // on the backend. Backend route: DELETE /api/delete_client/:id -> SystemAdminsController#destroy_client
  const deleteClient = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/delete_client/${id}`, {
        method: 'DELETE',
        headers: { 'X-Subdomain': subdomain },
      });
      if (response.ok) {
        setIsOpenDelete(false);
        // Remove the deleted admin's parent account entirely from `clients`
        // (flattenedData is derived from clients, not a separate source of truth —
        // filtering it directly and storing it back into `clients` would corrupt
        // the nested { subdomain, users: [...] } shape the rest of this component expects).
        setClients((prevClients) =>
          prevClients
            .map((client) => ({
              ...client,
              users: client.users.filter((user) => user.id !== id),
            }))
            .filter((client) => client.users.length > 0)
        );
        toaster.success('Client deleted successfully', { duration: 5000, icon: '✅' });
      } else {
        setIsOpenDelete(false);
        toaster.error('Failed to delete client', { duration: 5000, position: 'top-center' });
      }
    } catch (error) {
      setIsOpenDelete(false);
      toaster.error('Failed to delete client', { duration: 5000, position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  const getCurreentHotspotPlan = useCallback(async () => {
    try {
      const response = await fetch('/api/current_hotspot_plan', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentHotspotPlan(data.hotspot_plans);
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    getCurreentHotspotPlan();
  }, [getCurreentHotspotPlan]);

  const getCurrentPlan = useCallback(async () => {
    try {
      const response = await fetch('/api/current_plan', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentPlan(data.ppoe_plans);
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    getCurrentPlan();
  }, [getCurrentPlan]);

  const DeleteButton = ({ id }) => (
    <Tooltip title="Delete client">
      <IconButton
        size="small"
        onClick={() => {
          setRowData({ id });
          setIsOpenDelete(true);
        }}
        className="!text-red-500 hover:!bg-red-50 dark:hover:!bg-red-500/10"
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );

  const EditButton = () => (
    <Tooltip title="Edit client">
      <IconButton
        size="small"
        onClick={handleOpenModal}
        className="!text-emerald-600 dark:!text-emerald-400 hover:!bg-emerald-50 dark:hover:!bg-emerald-500/10"
      >
        <EditIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );

  return (
    <div className="font-sans">
      <AddClient
        open={addClient}
        onClose={handleCloseAddClient}
        formData={formData}
        handleChange={handleChange}
        handleInvite={handleInvite}
        fetchingClients={fetchingClients}
        setFetchingClients={setFetchingClients}
        clients={clients}
        setClients={setClients}
        errors={errors}
      />

      <EditClient
        open={isModalOpen}
        onClose={handleCloseModal}
        formData={formData}
        handleChange={handleChange}
        setFormData={setFormData}
        handleInvite={handleInvite}
      />

      <Toaster />
      <DeleteClient
        id={row_data.id}
        isloading={loading}
        deleteClient={deleteClient}
        isOpenDelete={isOpenDelete}
        setIsOpenDelete={setIsOpenDelete}
      />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} closeOnClick draggable pauseOnHover />

      {loading && (
        <Backdrop open={openLoad} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Lottie className="relative z-50" options={defaultOptions} height={400} width={400} />
        </Backdrop>
      )}

      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Clients</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            ISP accounts with access to this platform
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddClient}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2.5 transition-colors"
        >
          <AddCircleIcon fontSize="small" />
          Add client
        </button>
      </div>

      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full sm:w-80 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg
            focus:ring-emerald-500 focus:border-emerald-500 p-2.5
            dark:bg-slate-800 dark:border-slate-700 dark:placeholder-slate-400 dark:text-white
            dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
          placeholder="Search by company, name, email, or phone..."
        />
      </div>

      <ThemeProvider theme={tableTheme}>
        <MaterialTable
          onRowClick={handleRowClick}
          columns={[
            { title: 'Company Name', field: 'subdomain' },
            { title: 'User Name', field: 'username' },
            { title: 'Email', field: 'email' },
            { title: 'Role', field: 'role' },
            { title: 'Phone Number', field: 'phone_number' },
            { title: 'Locked Account', field: 'locked_account' },
            {
              title: 'Wallet Admin',
              field: 'wallet_admin',
              render: (rowData) =>
                rowData.wallet_admin ? (
                  <Chip label="Yes" size="small" color="success" icon={<AccountBalanceWallet />} />
                ) : (
                  <Chip label="No" size="small" variant="outlined" />
                ),
            },
            {
              title: 'Action',
              field: 'Action',
              sorting: false,
              render: (rowData) => (
                <div className="flex items-center gap-1">
                  <DeleteButton id={rowData.id} />
                  <EditButton />
                </div>
              ),
            },
          ]}
          data={filteredData}
          title="Clients"
          options={{
            paging: true,
            pageSizeOptions: [5, 10, 20],
            pageSize: 10,
            search: false,
            exportButton: true,
            headerStyle: {
              fontWeight: 700,
              textTransform: 'uppercase',
              fontSize: '12px',
              backgroundColor: isDark ? '#2a2a2a' : '#f8fafc',
              color: isDark ? '#f1f1f1' : '#1a1a1a',
            },
            rowStyle: (rowData, index) => ({
              backgroundColor: isDark ? (index % 2 === 0 ? '#1e1e1e' : '#262626') : index % 2 === 0 ? '#ffffff' : '#fafafa',
              color: isDark ? '#f1f1f1' : '#1a1a1a',
            }),
          }}
          components={{ Container: (props) => <Paper {...props} elevation={0} className="!rounded-2xl !border !border-slate-200 dark:!border-slate-800" /> }}
        />
      </ThemeProvider>
    </div>
  );
};

export default InviteClient;