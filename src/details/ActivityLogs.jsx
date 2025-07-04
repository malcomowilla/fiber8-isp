import React from 'react';
import MaterialTable from 'material-table';
import { ThemeProvider, createTheme } from '@mui/material';

const ActivityLogs = () => {
  const defaultMaterialTheme = createTheme();

  const columns = [
    {
      title: 'Action',
      field: 'action',
      cellStyle: {
        fontWeight: 500,
        color: '#424242'
      },
      headerStyle: {
        fontWeight: 'bold'
      }
    },
    {
      title: 'Description',
      field: 'description',
      cellStyle: {
        color: '#616161'
      }
    },
    {
      title: 'User',
      field: 'user',
      cellStyle: {
        color: '#1565c0',
        fontWeight: 500
      }
    },
    {
      title: 'Date',
      field: 'date',
      type: 'datetime',
      cellStyle: {
        color: '#616161',
        fontStyle: 'italic'
      },
      headerStyle: {
        fontWeight: 'bold'
      }
    }
  ];

  const data = [
    {
      action: 'Login',
      description: 'User logged into the system',
      user: 'john.doe@example.com',
      date: '2023-06-15T09:30:00'
    },
    {
      action: 'File Upload',
      description: 'Uploaded quarterly report.pdf',
      user: 'jane.smith@example.com',
      date: '2023-06-15T10:15:00'
    },
    {
      action: 'Settings Update',
      description: 'Changed notification preferences',
      user: 'admin@example.com',
      date: '2023-06-15T11:45:00'
    }
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <ThemeProvider theme={defaultMaterialTheme}>
        <MaterialTable
          title="Activity Logs"
          columns={columns}
          data={data}
          options={{
            pageSize: 10,
            pageSizeOptions: [10, 20, 50],
            sorting: true,
            search: true,
            searchFieldAlignment: 'left',
            headerStyle: {
              backgroundColor: '#f5f5f5',
              color: '#424242',
              fontWeight: 'bold'
            },
            rowStyle: {
              backgroundColor: '#fff',
              '&:hover': {
                backgroundColor: '#f5f5f5'
              }
            }
          }}
          localization={{
            toolbar: {
              searchPlaceholder: 'Search logs...',
              searchTooltip: 'Search'
            },
            pagination: {
              labelRowsSelect: 'rows',
              labelDisplayedRows: '{from}-{to} of {count}'
            }
          }}
        />
      </ThemeProvider>
    </div>
  );
};

export default ActivityLogs;