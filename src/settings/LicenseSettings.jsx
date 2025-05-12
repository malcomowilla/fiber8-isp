


import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    Divider,
    Alert,
    Switch,
    FormControlLabel,
    CircularProgress

  } from '@mui/material';
  import {
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    Settings as SettingsIcon,
    CalendarToday as CalendarIcon,
    Lock as LicenseIcon,
    Phone as PhoneIcon,
    Notifications as NotificationsIcon
  } from '@mui/icons-material';
  import { useState, useEffect, useCallback } from 'react';
  import { useFormik } from 'formik';
  import * as Yup from 'yup';
  import toast, { Toaster } from 'react-hot-toast';

  
  const LicenseSettings = () => {
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    
  
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const [initialValues, setInitialValues] = useState({
      warningDays: 2,
      phoneNotification: false,
      phoneNumber: '',
    });

    const subdomain = window.location.hostname.split('.')[0];

  
const fetchSettings = useCallback(
  async() => {
    try {
        const res = await fetch('/api/license_settings', {
          headers: {
            'X-Subdomain': subdomain,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch settings');
        const data = await res.json();
if (res.ok) {
    setInitialValues({
        warningDays: data[0].expiry_warning_days ?? 2,
        phoneNotification: data[0].phone_notification ?? false,
        phoneNumber: data[0].phone_number ?? '',
      });
}
      

        // setInitialValues({
        // warningDays: data[0].expiry_warning_days ?? 2,
        //   phoneNotification: data[0].phone_notification ?? false,
        //   phoneNumber: data.phone_number[0] ?? '',
        // });
      } catch (err) {
        console.error('Error loading settings:', err);
        // toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
  },
  [subdomain],
)


    useEffect(() => {
  
      fetchSettings();
    }, [fetchSettings]);

  
    const formik = useFormik({
      enableReinitialize: true,
      initialValues,


      validationSchema: Yup.object({
        warningDays: Yup.number()
          .min(1, 'Must be at least 1 day')
          .max(30, 'Cannot be more than 30 days')
          .required('Required'),
        phoneNumber: Yup.string().when('phoneNotification', {
          is: true,
          then: () =>
            Yup.string()
              .matches(/^[0-9]+$/, 'Must be only digits')
              .min(10, 'Must be at least 10 digits')
              .max(15, 'Must be 15 digits or less')
              .required('Phone number is required when notifications are enabled'),
          otherwise: () => Yup.string().notRequired(),
        }),
      }),
      onSubmit: async (values) => {
        try {
          setSubmitLoading(true);
          setError(null);
  
          const payload = {
            expiry_warning_days: values.warningDays,
            phone_notification: values.phoneNotification,
            phone_number: values.phoneNumber
          };
  
          const response = await fetch('/api/license_settings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Subdomain': subdomain
            },
            body: JSON.stringify(payload),
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to save settings');
          }
  
          toast.success('Settings saved successfully!');
          // Refresh data after successful save
          const updatedData = await response.json();
          setInitialValues({
            warningDays: updatedData.expiry_warning_days,
            phoneNotification: updatedData.phone_notification,
            phoneNumber: updatedData.phone_number,
          });
        } catch (err) {
          console.error('Save error:', err);
          setError(err.message);
          toast.error(err.message);
        } finally {
          setSubmitLoading(false);
        }
      },
    });
  
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      );
    }
    return (

        <>
        <Toaster />
      <Card sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <LicenseIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h5" component="h1">
              License Settings
            </Typography>
          </Box>
  
          <Divider sx={{ my: 2 }} />
  
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" mb={2}>
                  <WarningIcon color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">Expiration Warning</Typography>
                </Box>
  
                <Typography variant="body1" paragraph>
                  Set how many days before license expiration users should be notified.
                </Typography>
  
                <Box display="flex" alignItems="center" mt={3}>
                  <CalendarIcon color="action" sx={{ mr: 2 }} />
                  <TextField
                  className='myTextField'
                    name="warningDays"
                    label="Warning Days"
                    type="number"
                    value={formik.values.warningDays}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.warningDays && Boolean(formik.errors.warningDays)}
                    helperText={formik.touched.warningDays && formik.errors.warningDays}
                    inputProps={{ min: 1, max: 30 }}
                    sx={{ width: 120 }}
                  />
                </Box>
              </Grid>
  
              <Grid item xs={12} md={6}>
                <Box bgcolor="grey.100" p={2} borderRadius={1}>
                  <Typography variant="subtitle1" gutterBottom>
                    <Box display="flex" alignItems="center">
                      <SettingsIcon color="info" sx={{ mr: 1 }} />
                      <p className='dark:text-black'>Current Settings</p>
                    </Box>
                  </Typography>
                  <Typography variant="body2">
                  <p className='dark:text-black'>  Users will receive warnings <strong>
                        {formik.values.warningDays} day{formik.values.warningDays !== 1 ? 's' : ''}
                        </strong> before license expiration.</p>
                  </Typography>
                  {formik.values.phoneNotification && (
                    <Typography variant="body2" mt={1}>
                      <p className='dark:text-black'>SMS notifications will be sent to: </p> <strong>{formik.values.phoneNumber}</strong>
                    </Typography>
                  )}
                </Box>
              </Grid>
  
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" alignItems="center" mb={2}>
                  <NotificationsIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">Notification Settings</Typography>
                </Box>
  
                <FormControlLabel
                  control={
                    <Switch
                      name="phoneNotification"
                      checked={formik.values.phoneNotification}
                      onChange={formik.handleChange}
                      color="primary"
                    />
                  }
                  label="Enable SMS notifications"
                />
  
                {formik.values.phoneNotification && (
                  <Box display="flex" alignItems="center" mt={2}>
                    <PhoneIcon color="action" sx={{ mr: 2 }} />
                    <TextField
                    className='myTextField'
                      name="phoneNumber"
                      label="Phone Number"
                      value={formik.values.phoneNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                      helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                      placeholder="e.g., 254712345678"
                      sx={{ width: 250 }}
                    />
                  </Box>
                )}
              </Grid>
            </Grid>
  
            <Box mt={4} display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<CheckCircleIcon />}
                sx={{ minWidth: 120 }}
              >
                Save Settings
              </Button>
            </Box>
          </form>
  
          {saved && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Settings saved successfully!
            </Alert>
          )}
        </CardContent>
      </Card>

      </>
    );
  };
  
  export default LicenseSettings;