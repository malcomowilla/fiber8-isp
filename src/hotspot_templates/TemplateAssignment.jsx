import React, { useState, useCallback, useEffect } from 'react';
import MaterialTable from 'material-table';
import { 
  IconButton, 
  Chip,
  Paper,
  Typography,
  Box,
  Button, 
  Divider, 
  Grid,
  Modal,
  TextField,
  Autocomplete,
  CircularProgress,
  Tooltip,
  Card,
  CardContent,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Payment as PaymentIcon,
  Description as DescriptionIcon,
  LocationOn as LocationIcon,
  Assignment as AssignmentIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import toast, { Toaster } from 'react-hot-toast';




const TemplateAssignment = () => {
  const [templates, setTemplates] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [rowLocation, setRowLocation] = useState('');
  
  const subdomain = window.location.hostname.split('.')[0];

const handleRowClick = (event, rowData) => {
  setRowLocation(rowData.location)
   
  }




const hotspot_templates = [
  {name: 'sleekspot', type: 'Sleekspot Template', },
  {name: 'default_template', type: 'Default Template'},
  {name: 'attractive', type: 'Attractive Template'},
  {name: 'flat', type: 'Flat Design Template'},
  {name: 'minimal', type: 'Minimal Template'},
  {name: 'simple', type: 'Simple Template'},
  {name: 'clean', type: 'Clean Template'},
  {name: 'pepea', type: 'Pepea Template'},
  {name: 'premium', type: 'Premium Template'},
]



  // Fetch templates from API
  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/template_locations', {
        headers: { 
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain 
        },
      });
      const data = await response.json();
      
      if (response.ok) {
        // Transform API data to table format
        const transformedTemplates = transformTemplateData(data);
        setTemplates(transformedTemplates);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  }, [subdomain]);

  // Fetch locations (nodes) from API
  const fetchLocations = useCallback(async () => {
    try {
      const response = await fetch('/api/nodes', {
        headers: { 'X-Subdomain': subdomain },
      });
      const data = await response.json();
      
      if (response.ok) {
        setLocations(data.map(location => ({
          id: location.id,
          name: location.name || `Location ${location.id}`,
          type: location.type || 'Node',

          
          address: location.address || ''
        })));
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  }, [subdomain]);

  // Transform API data to table format
  const transformTemplateData = (apiData) => {
    // Handle both array and object response formats
    if (Array.isArray(apiData)) {
      return apiData.map(item => ({
        id: item.id || item.template_id,
        name: item.name || item.template_name || 'Unnamed Template',
        type: item.type || 'Hotspot',
        description: item.description || 'No description available',
        location: item.location || [],
        created_at: item.created_at || new Date().toISOString(),
        status: item.active ? 'Active' : 'Inactive'
      }));
    }
    
    // Handle object with multiple template types
    if (typeof apiData === 'object' && apiData !== null) {
      const templateTypes = [
        { key: 'sleekspot', name: 'Sleekspot Template' },
        { key: 'default_template', name: 'Default Template' },
        { key: 'attractive', name: 'Attractive Template' },
        { key: 'flat', name: 'Flat Design Template' },
        { key: 'minimal', name: 'Minimal Template' },
        { key: 'simple', name: 'Simple Template' },
        { key: 'clean', name: 'Clean Template' },
        { key: 'pepea', name: 'Pepea Template' },
        { key: 'premium', name: 'Premium Template' }
      ];
      
      return templateTypes
        .filter(type => apiData[type.key])
        .map(type => ({
          id: type.key,
          name: type.name,
          location: apiData[type.key].location || [],
          type: 'Hotspot',
          description: `Hotspot template configuration`,
          assignedLocations: apiData[type.key].location || [],
          created_at: apiData[type.key].created_at || new Date().toISOString(),
          status: 'Active'
        }));
    }
    
    return [];
  };

  useEffect(() => {
    fetchLocations();
    fetchTemplates();
  }, [fetchLocations, fetchTemplates]);

  // Handle opening modal for template assignment
  const handleOpenModal = (template) => {
    setSelectedTemplate(template);
    
    // Get currently assigned locations
    const assigned = locations.filter(location => 
      template.assignedLocations?.includes(location.id)
    );
    
    setSelectedLocations(assigned);
    setModalOpen(true);
  };

  const nameOfSelectedLOcation = selectedLocations.map(location => location.name).join(', ');
  console.log('name of selected location', nameOfSelectedLOcation)
  // Handle saving location assignments
  const handleSaveAssignments = async () => {
    if (!selectedTemplate) return;
    
    setSaving(true);
    try {
      const locationIds = selectedLocations.map(loc => loc.id);
      
      // API call to update template with locations
      const response = await fetch(`/api/hotspot_locations/${selectedTemplate.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
        body: JSON.stringify({
          selected_locations: nameOfSelectedLOcation
        })
      });

      if (response.ok) {
        // Update local state
        setTemplates(prev => prev.map(t => 
          t.id === selectedTemplate.id 
            ? { ...t, assignedLocations: locationIds }
            : t
        ));
        
        setModalOpen(false);
        toast.success('Template assignments saved successfully!', {
          position: 'top-right',
          duration: 4000,
        });
      }else{
        toast.error('Failed to save template assignments', {
          position: 'top-right',
          duration: 4000,
        });
      }
    } catch (error) {
      console.error('Error saving assignments:', error);
      toast.error('Failed to save template assignments internal server error', {
        position: 'top-right',
        duration: 4000,
      });
    } finally {
      setSaving(false);
    }
  };

  // Filter templates based on search and type
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || template.type === filterType;
    return matchesSearch && matchesType;
  });

  // Get location names for display
  const getLocationNames = (locationIds) => {
    return locationIds
      .map(id => {
        const location = locations.find(loc => loc.id === id);
        return location ? location.name : `Location ${id}`;
      })
      .join(', ');
  };

  // Columns for Material Table
  const columns = [
    {
      title: 'Template Name',
      field: 'name',
      render: (rowData) => (
        <Box>
          <Typography variant="subtitle2" fontWeight="medium">
            {rowData.name}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {rowData.description}
          </Typography>
        </Box>
      )
    },
    {
      title: 'Type',
      field: 'type',
      render: (rowData) => (
        <Chip
          label={rowData.type}
          size="small"
          color="primary"
          variant="outlined"
        />
      )
    },
    {
      title: 'Assigned Locations',
      field: 'location',
      render: (rowData) => {
        return (
          <Box>
            {rowData.location}
            {/* <Typography variant="body2">
              {count} location{count !== 1 ? 's' : ''}
            </Typography>
            {count > 0 && (
              <Typography variant="caption" color="textSecondary" noWrap>
                {getLocationNames(rowData.assignedLocations)}
              </Typography>
              
            )} */}
          </Box>
        );
      }
    },
    {
      title: 'Status',
      field: 'status',
      render: (rowData) => (
        <Chip
          label={rowData.status}
          size="small"
          color={rowData.status === 'Active' ? 'success' : 'default'}
          variant="filled"
        />
      )
    },
    {
      title: 'Actions',
      field: 'actions',
      render: (rowData) => (
        <Box>
          <Tooltip title="Assign Locations">
            <IconButton 
              size="small" 
              color="primary"
              onClick={() => handleOpenModal(rowData)}
            >
              <AssignmentIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Template">
            <IconButton size="small" color="secondary">
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Toaster />
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            Template Assignment
          </Typography>
          {/* <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="medium"
          >
            Add New Template
          </Button> */}
        </Box>
        
        <Typography variant="body1" color="textSecondary">
          Assign hotspot templates to different locations.
           
        </Typography>
      </Box>

      {/* Search and Filter Section */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              className='myTextField'
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Type</InputLabel>
              <Select
                value={filterType}
                label="Filter by Type"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="Hotspot">Hotspot</MenuItem>
                <MenuItem value="Premium">Premium</MenuItem>
                <MenuItem value="Basic">Basic</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
               color="success"
              startIcon={<FilterIcon />}
              onClick={() => {/* Add filter logic */}}
            >
              Filters
            </Button>
            <Button
              variant="outlined"
              color="success"
              startIcon={<DescriptionIcon />}
              onClick={() => {/* Add export logic */}}
            >
              Export
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AssignmentIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">{templates.length}</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Total Templates
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">{locations.length}</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Total Locations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  {templates.filter(t => t.assignedLocations?.length > 0).length}
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Templates in Use
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PaymentIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  {templates.filter(t => t.status === 'Active').length}
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Active Templates
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Material Table */}
      <Box sx={{ maxWidth: '100%' }}>
        <MaterialTable
          onRowClick={handleRowClick}
          title={
            <Typography variant="h6" fontWeight="medium">
              Hotspot Templates
            </Typography>
          }
          columns={columns}
          data={filteredTemplates}
          isLoading={loading}
          options={{
            search: false,
            actionsColumnIndex: -1,
            pageSize: 10,
            pageSizeOptions: [5, 10, 20],
            sorting: true,
            draggable: false,
            padding: 'dense',
            toolbar: false,
            headerStyle: {
              backgroundColor: '#f5f5f5',
              fontWeight: 'bold',
            },
            rowStyle: {
              fontSize: '0.875rem',
            }
          }}
          components={{
            Container: props => <Paper {...props} elevation={1} />,
          }}
          localization={{
            body: {
              emptyDataSourceMessage: 'No templates found'
            },
            pagination: {
              labelRowsSelect: 'rows',
              labelDisplayedRows: '{from}-{to} of {count}'
            }
          }}
        />
      </Box>

      {/* Assignment Modal */}
      <Modal
        open={modalOpen}
        onClose={() => !saving && setModalOpen(false)}
        aria-labelledby="assign-locations-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 600, md: 700 },
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 0
        }}>
          {/* Modal Header */}
          <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider',
             bgcolor: 'green', color: 'white' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Assign Locations
              </Typography>
              <IconButton 
                onClick={() => !saving && setModalOpen(false)}
                sx={{ color: 'white' }}
                disabled={saving}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
              {selectedTemplate?.name}
            </Typography>
          </Box>

          {/* Modal Content */}
          <Box sx={{ p: 3 }}>
            <Typography variant="body1" paragraph>
              Select locations where this hotspot template should be applied:
            </Typography>

            {/* Location Selection */}
            <Autocomplete
              multiple
              options={locations}
              value={locations.filter(location => rowLocation.includes(location.name))}
              onChange={(event, newValue) => {
                setSelectedLocations(newValue);
              }}
              getOptionLabel={(option) => `${option.name} (${option.type})`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className='myTextField'
                  label="Search and select locations"
                  placeholder="Type to search..."
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <SearchIcon color="action" sx={{ mr: 1 }} />
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.name}
                    size="small"
                    color="primary"
                    variant="outlined"
                    {...getTagProps({ index })}
                    key={option.id}
                    onDelete={() => {
                      setSelectedLocations(selectedLocations.filter(loc => loc.id !== option.id));
                    }}
                  />
                ))
              }
              disabled={saving}
            />

            {/* Selected Locations Preview */}
            {selectedLocations.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom color="textSecondary">
                  Selected Locations ({selectedLocations.length}):
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, maxHeight: 200, overflow: 'auto' }}>
                  <Grid container spacing={1}>
                    {selectedLocations.map(location => (
                      <Grid item xs={12} sm={6} key={location.id}>
                        <Paper 
                          variant="outlined" 
                          sx={{ 
                            p: 1.5, 
                            display: 'flex', 
                            alignItems: 'center',
                            bgcolor: 'background.default'
                          }}
                        >
                          <LocationIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" fontWeight="medium">
                              {location.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {location.type}
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedLocations(selectedLocations.filter(loc => loc.id !== location.id));
                            }}
                            disabled={saving}
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Box>
            )}

            {/* Empty State */}
            {selectedLocations.length === 0 && (
              <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', mt: 3 }}>
                <LocationIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body1" color="textSecondary">
                  No locations selected
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Start typing above to search and select locations
                </Typography>
              </Paper>
            )}
          </Box>

          {/* Modal Footer */}
          <Box sx={{ 
            p: 2, 
            borderTop: 1, 
            borderColor: 'divider',
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="caption" color="textSecondary">
              {selectedLocations.length} location{selectedLocations.length !== 1 ? 's' : ''} selected
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setModalOpen(false)}
                disabled={saving}
                startIcon={<CloseIcon />}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleSaveAssignments}
                disabled={saving || !selectedTemplate}
                startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
              >
                {saving ? 'Saving...' : 'Save Assignments'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Paper>
  );
};

export default TemplateAssignment;