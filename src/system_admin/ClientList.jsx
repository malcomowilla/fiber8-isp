
import React, {useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Card, CardContent, Typography, Button, TextField, InputAdornment } from '@mui/material';
import { IoPeople } from "react-icons/io5";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MaterialTable from "material-table";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Clients</h2>
      <TextField
        variant="outlined"
        className='myTextField'
        placeholder="Search for customers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IoPeople />
            </InputAdornment>
          ),
        }}
        sx={{ marginBottom: 2, width: '100%',
          '& label.Mui-focused': { color: 'gray' },
          '& .MuiOutlinedInput-root': {
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "black",
              borderWidth: '3px'
            }
          }
         }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filteredClients.map(client => (
          <Card key={client.id} sx={{ display: 'flex', justifyContent: 'space-between', padding: 2 }}>
            <CardContent>
              <Typography variant="h6">{client.company_name}</Typography>
              <Typography color="textSecondary">{client.active ? 'Active' : 'Blocked'}</Typography>
            </CardContent>
            <Button variant="contained" color="success" onClick={() => handleBlock(client.id)}>
              Block
            </Button>
          </Card>
        ))}
      </Box>

      <MaterialTable
        columns={[
          { title: "Location", field: "location" },
          { title: "Customer Name", field: "name" },
          { title: "Phone Number", field: "phone_number" },
          { title: "Date Registered", field: "date_registered" },
          { title: "Customer Code", field: "customer_code" },
          {
            title: "Collection Request",
            field: "confirm_request",
            render: rowData => rowData.confirm_request ? <CheckCircleIcon style={{ color: 'green' }} /> : <CancelIcon style={{ color: 'red' }} />
          },
          {
            title: "Action",
            field: "Action",
            render: rowData => (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" color="primary">Edit</Button>
                <Button variant="outlined" color="error">Delete</Button>
              </Box>
            )
          }
        ]}
        data={filteredClients}
        title="Clients"
        options={{
          paging: true,
          pageSizeOptions: [5, 10, 20, 25, 50, 100],
          pageSize: 10,
          search: false,
          exportButton: true,
          headerStyle: {
            fontFamily: 'bold',
            textTransform: 'uppercase'
          },
        }}
      />
    </motion.div>
  );
};

export default ClientList;






