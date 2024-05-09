
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SubscriberDetails from '../details/SubscriberDetails'
import Subscriptions from '../details/Subscriptions'
import Devices from '../details/Devices'
import Stats from '../details/Stats'
import Invoice from '../details/Invoice'
import Receipt from '../details/Receipt'
import Address from '../details/Address'
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });




//   textColor='gray'  indicatorColor="secondary"



const EditSubscriber = ({handleClose, open}) => {
  const [value, setValue] = React.useState('1');

    const [selectedTab, setSelectedTab] = React.useState('SUBSCRIBER DETAILS')
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };
  
  return (
    <React.Fragment>
    <div className='overflow-hidden'>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
          <Toolbar>
            {/* <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton> */}
            <Typography sx={{ ml: 2, flex: 1 , padding: '40px'}} variant="h6" component="div">
            <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example" indicatorColor="secondary" textColor='gray'>
            <Tab   label="SUBSCRIBER DETAILS" value="1" />
            <Tab label="ADDRESS" value="2" />
            <Tab label="DEVICES" value="3" />
            <Tab label="INVOICE" value="4" />
            <Tab label="RECEIPT" value="5" />
            <Tab label="STATS" value="6" />
            <Tab label="SUBSCRIPTIONS" value="7" />


          </TabList>
        </Box>
        <TabPanel value="1"><SubscriberDetails handleClose={handleClose}/></TabPanel>
        <TabPanel value="2"><Address/></TabPanel>
        <TabPanel value="3"><Devices/></TabPanel>
        <TabPanel value="4"><Invoice/></TabPanel>
        <TabPanel value="5"><Receipt/></TabPanel>

        <TabPanel value="6"><Stats/></TabPanel>
        <TabPanel value="7"><Subscriptions/></TabPanel>
        </TabContext>

    </Box>

            </Typography>
           
          </Toolbar>

        

        <TabContext>

        <List>
         
        </List>
        </TabContext>

      </Dialog>

      </div>
    </React.Fragment>
  )
}

export default EditSubscriber








