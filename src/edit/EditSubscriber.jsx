import * as React from 'react';
// import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
// import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
// import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SubscriberDetails from '../details/SubscriberDetails';
import Subscriptions from '../details/Subscriptions';
import Devices from '../details/Devices';
import Stats from '../details/Stats';
import Invoice from '../details/Invoice';
import Receipt from '../details/Receipt';
import Address from '../details/Address';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import {useState, useEffect} from 'react'

import {
  Tabs,
  useMediaQuery,
  useTheme,
} from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const EditSubscriber = ({handleClose, open, formData , createSubscriber,
  setShowClientStatsAndSubscriptions, showClientStatsAndSUbscriptions,
   handleChangeForm, packageNamee, setFormData, isloading,
  
  
   onlyShowSubscription,setOnlyShowSubscription

  
  }) => {
  const [value, setValue] = React.useState('1');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };



  return (
    // <React.Fragment>
    //   <div className='oveflow-scroll'>
    //     <Dialog
    //       fullScreen
    //       open={open}
    //       onClose={handleClose}
    //       TransitionComponent={Transition}
       
    //     >
    //       <Toolbar>
    //         <Typography sx={{ ml: 2, flex: 1, padding: '40px' }} variant="h6" component="div">
    //           <Box sx={{ width: '100%', typography: 'body1', marginTop: 5 }}>
    //             <TabContext value={value}>
    //               <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
    //                 <TabList onChange={handleChange} aria-label="lab API tabs example" indicatorColor="secondary" textColor='gray'>
    //                   <Tab label="SUBSCRIBER DETAILS" value="1" />
    //                   <Tab label="ADDRESS" value="2" />
    //                   <Tab label="DEVICES" value="3" />
    //                   <Tab label="INVOICE" value="4" />
    //                   <Tab label="RECEIPT" value="5" />
    //                   <Tab label="STATS" value="6" />
    //                   <Tab label="SUBSCRIPTIONS" value="7" />
    //                 </TabList>
    //               </Box>
    //               <TabPanel value="1">
    //                 <SubscriberDetails 
    //                   isloading={isloading} 
    //                   handleClose={handleClose} 
    //                   formData={formData}  
    //                   createSubscriber={createSubscriber}   
    //                   packageNamee={packageNamee} 
    //                   setFormData={setFormData} 
    //                   handleChangeForm={handleChangeForm}
    //                 />
    //               </TabPanel>
    //               <TabPanel value="2"><Address handleClose={handleClose}/></TabPanel>
    //               <TabPanel value="3"><Devices handleClose={handleClose}/></TabPanel>
    //               <TabPanel value="4"><Invoice handleClose={handleClose}/></TabPanel>
    //               <TabPanel value="5"><Receipt handleClose={handleClose}/></TabPanel>
    //               <TabPanel value="6"><Stats handleClose={handleClose}/></TabPanel>
    //               <TabPanel value="7"><Subscriptions handleClose={handleClose}/></TabPanel>
    //             </TabContext>
    //           </Box>
    //         </Typography>
    //       </Toolbar>
    //     </Dialog>
    //   </div>
    // </React.Fragment>


    

<Dialog
  open={open}
  onClose={handleClose}
  TransitionComponent={Transition}
  fullScreen={isMobile} // Full screen on mobile
  fullWidth
  maxWidth="md"
  sx={{
    
    '& .MuiDialog-paper': {
      width: '100%', // Ensures full width
      maxHeight: '90vh', // Prevents overflow
      padding: isMobile ? '16px' : '24px',
    },
  }}
>
  <Toolbar className="flex flex-col md:flex-row items-start md:items-center">
    <Typography
    sx={{
      mt: 10,
    }}
      className="w-full"
      variant="h6"
      component="div"
    >
      <Box className="w-full">
        <TabContext value={value}>
          <Box className="border-b border-gray-300">
            <TabList
             sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "green", // Set custom indicator color
              },
            }}
              onChange={handleChange}
              aria-label="lab API tabs example"
              textColor="gray"
              variant={isMobile ? 'scrollable' : 'standard'}
              scrollButtons="auto"
            >
              <Tab label="SUBSCRIBER DETAILS" value="1" />
              {onlyShowSubscription  && <>{showClientStatsAndSUbscriptions ? <Tab label="ADDRESS" value="2" /> : null} </>}


            {onlyShowSubscription && <>{showClientStatsAndSUbscriptions && <Tab label="LIVE DATA" value="11" />}</>}

{onlyShowSubscription && <>{showClientStatsAndSUbscriptions && <Tab label="INVOICE" value="4" />}</>}


{onlyShowSubscription && <>{showClientStatsAndSUbscriptions && <Tab label="STATS" value="6" />}</>}

            {showClientStatsAndSUbscriptions && <Tab label="SUBSCRIPTIONS" value="7" />}
            {onlyShowSubscription && <>{showClientStatsAndSUbscriptions && <Tab label="COMUNICATIONS" value="8" />}</>}
            {onlyShowSubscription && <>{showClientStatsAndSUbscriptions && <Tab label="ACTIVITY LOGS" value="9" />}</>}
             {onlyShowSubscription && <>{showClientStatsAndSUbscriptions && <Tab label="PAYMENT HISTORY" value="10" />}</>}



              
            </TabList>
          </Box>
          <TabPanel value="1">
            <SubscriberDetails
              isloading={isloading}
              handleClose={handleClose}
              formData={formData}
              createSubscriber={createSubscriber}
              packageNamee={packageNamee}
              setFormData={setFormData}
              handleChangeForm={handleChangeForm}
            />
          </TabPanel>
          <TabPanel value="2"><Address handleClose={handleClose}/></TabPanel>
          <TabPanel value="3"><Devices handleClose={handleClose}/></TabPanel>
          <TabPanel value="4"><Invoice handleClose={handleClose}/></TabPanel>
          <TabPanel value="5"><Receipt handleClose={handleClose}/></TabPanel>
          <TabPanel value="6"><Stats handleClose={handleClose}/></TabPanel>
          <TabPanel value="7"><Subscriptions
           handleClose={handleClose}
           
           isloading={isloading}
           formData={formData}
           createSubscriber={createSubscriber}
           packageNamee={packageNamee}
           setFormData={setFormData}
           handleChangeForm={handleChangeForm}
           
           /></TabPanel>
        </TabContext>
      </Box>
    </Typography>
  </Toolbar>
</Dialog>

  );
}

export default EditSubscriber;
