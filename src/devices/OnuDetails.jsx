
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Tooltip from "@mui/material/Tooltip";
import { motion } from "framer-motion";
import styled from "styled-components";
import SupportAgentIcon from "@mui/icons-material/SupportAgent"; // Import the SupportAgent icon
import TextField from '@mui/material/TextField';
import {useState, useEffect, useCallback, lazy,  } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import Backdrop from '../backdrop/Backdrop'
import { IoHomeOutline } from "react-icons/io5";
import { MdDevices } from "react-icons/md";
import { MdOutlineSecurity } from "react-icons/md";
import { IoWifi } from "react-icons/io5";
import { GiServerRack } from "react-icons/gi";
import { MdDeviceHub } from "react-icons/md";
import { useSearchParams } from 'react-router-dom';
import { FiRefreshCcw } from "react-icons/fi";
import { CircularProgress } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Divider,
    DialogContentText,

  Grid,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

import { VscPulse } from "react-icons/vsc";




const SettingsNotification = lazy(() => import('../notification/SettingsNotification'))


const OnuDetails = () => {

    const [open, setOpen] = useState(false);
    // const navigate = useNavigate()
    const [openNotifactionSettings, setOpenSettings] = useState(false)
      const [rebootConfirmOpen, setRebootConfirmOpen] = useState(false);
    const subdomain = window.location.hostname.split('.')[0]


       const [rebooting, setRebooting] = useState(false);
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id')


  // Reboot device function
  const rebootDevice = async () => {
    setRebooting(true);
    // e.preventDefault()
    try {
      const response = await fetch(`/api/reboot_device/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        }
      });

      if (response.ok) {
        toast.success('Device reboot initiated successfully', {
          position: "top-center",
          duration: 4000,
        });
      } else {
        toast.error('Failed to reboot device', {
          position: "top-center",
          duration: 4000,
        });
      }
    } catch (error) {
      toast.error('Failed to reboot device - server error', {
        position: "top-center",
        duration: 4000,
      });
    } finally {
      setRebooting(false);
      setRebootConfirmOpen(false);
    }
  };
  // Handle reboot confirmation
  const handleRebootClick = () => {
    setRebootConfirmOpen(true);
  };

  const handleRebootConfirm = () => {
    rebootDevice();
  };

  const handleRebootCancel = () => {
    setRebootConfirmOpen(false);
  };


    const [ticketForm, setTicketForm] = useState({
        prefix: '',
        minimum_digits: '',

    })

    

    const standardOptions1 = [
    { value: '11bgn', label: '802.11b/g/n' },
    { value: '11bg', label: '802.11b/g' },
    { value: '11b', label: '802.11b' },
    { value: '11g', label: '802.11g' },
    {value: '11n', label: '802.11n'},
  ];


   const channelWidthOptions1 = [
    { value: '20MHZ', label: '20MHz' },
    { value: '40MHz', label: '40MHz' },
    { value: 'Auto 20MHz', label: 'Auto 20/40MHz' },
   
  ];


   const countryRegulatoryDomainOptions1 = [
    { value: 'KE', label: 'KE-Kenya' },
    { value: 'UG', label: 'UG-Uganda' },
    { value: 'TZ', label: 'TZ-Tanzania' },
    { value: 'ZM', label: 'ZM-Zambia' },
    { value: 'ZW', label: 'ZW-Zimbabwe' },
    { value: 'NA', label: 'NA-Namibia' },
    { value: 'MW', label: 'MW-Malawi' },
    { value: 'LS', label: 'LS-Lesotho' },
    { value: 'BW', label: 'BW-Botswana' },
    { value: 'SZ', label: 'SZ-Swaziland' },
    { value: 'ZW', label: 'ZW-Zimbabwe' },
    { value: 'NA', label: 'NA-Namibia' },
    { value: 'MW', label: 'MW-Malawi' },
    { value: 'LS', label: 'LS-Lesotho' },
    { value: 'SZ', label: 'SZ-Swaziland' },
    { value: 'ZA', label: 'ZA-South Africa' },
    { value: 'MZ', label: 'MZ-Mozambique' },
     { value: 'CN', label: 'CN-China' },
     { value: 'IN', label: 'IN-India' },
     { value: 'ID', label: 'ID-Indonesia' },
     { value: 'JP', label: 'JP-Japan' },
     { value: 'KR', label: 'KR-Korea' },
     { value: 'MY', label: 'MY-Malaysia' },
     { value: 'PH', label: 'PH-Philippines' },
     { value: 'SG', label: 'SG-Singapore' },
      { value: 'BR', label: 'BR-Brazil' },
      { value: 'MX', label: 'MX-Mexico' },
      { value: 'AR', label: 'AR-Argentina' },
      { value: 'CL', label: 'CL-Chile' },
      { value: 'CO', label: 'CO-Colombia' },
      { value: 'EC', label: 'EC-Ecuador' },
      { value: 'PE', label: 'PE-Peru' },
      { value: 'BE', label: 'BE-Belgium' },
  ];


   const txPowerOptions1 = [
    { value: '40MHz', label: '40MHz' },
    { value: 'Auto 20MHz', label: 'Auto 20/40MHz' },
   
  ];


 const channelOptions1 = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: '10', label: '10' },
    { value: '11', label: '11' },
    { value: '12', label: '12' },
    { value: '13', label: '13' },
   
   
  ];


    const wpaEncryptionOptions1 = [
    { value: 'AESEncryption', label: 'AES' },
    { value: 'TKIPEncryption', label: 'TKIP' },

    { value: 'TKIPandAESEncryption', label: 'TKIP + AES' },
    
  ];




    const standardOptions2 = [
    {value: '11n', label: '802.11n'},
        {value: '11a', label: '802.11a'},
        {value: '11an', label: '802.11a/n'},
        {value: '11anac', label: '802.11a/n/ac'},
    //     {value: '11ac', label: '802.11ac'},
    //     {value: '11ad', label: '802.11ad'},
    // { value: '11ax', label: '802.11ax' },
  ];


  const getAlternativeStandardName = (standard) => {
  const standardMap = {
    '11bgn': '802.11b/g/n',
    '11bg': '802.11b/g',
        '11n': '802.11n',
    '11g': '802.11g',
    '11b': '802.11b',
  };

  return standardMap[standard] || standard; // fallback to original if not found
};
    

  
const getAlternativeStandardName2 = (standard) => {
  const standardMap = {
        '11n': '802.11n',

    
    '11a': '802.11a',
    '11an': '802.11a/n',
    '11anac': '802.11a/n/ac',
    // '11ac': '802.11ac',
    // '11ad': '802.11ad',
    // '11ax': '802.11ax'
  };

  return standardMap[standard] || standard; // fallback to original if not found
};

    const {prefix, minimum_digits} = ticketForm


    const handleChange = (e) => {
        const { type, name, checked, value } = e.target;

        // const captlalName = value.charAt(0).toUpperCase() + value.slice(1)
        const capitalizedName = value.toUpperCase()
        setTicketForm((prevFormData) => ({
    ...prevFormData,
    [name]: type === "checkbox" ? checked : capitalizedName,
  }));
    }





const handleCreateTicketSettings = async(e) => {

e.preventDefault()
    try {

        setOpen(true);
        const response = await fetch('/api/ticket_settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Subdomain': subdomain,
            },
            body: JSON.stringify({
            prefix, minimum_digits
            }),
        })
        const newData = await response.json()



        if (response.status === 402) {
          setTimeout(() => {
            window.location.href = '/license-expired';
           }, 1800);
          
        }

        if (response.ok) {
            toast.success('ticket settings saved successfully', {
                position: 'top-center',
                duration: 5000,
               
            })
            setOpenSettings(true)
            setOpen(false)
            setTicketForm({
                prefix: newData.prefix,
                minimum_digits: newData.minimum_digits
            })
        }else{


          if (response.status === 402) {
        setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/license-expired'
         }, 1800);
        
      }
if (response.status === 401) {
  toast.error(newData.error, {
    position: "top-center",
    duration: 4000,
  })
   setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/signin'
         }, 1900);
}
            toast.error('failed to save ticket settings', {
                duration: 3000,
                position: 'top-center',
            })
            setOpenSettings(false);
      setOpen(false);
        }
    } catch (error) {
        setOpenSettings(false);
      setOpen(false);
        toast.error(
            'failed to save ticket settings',
            {
                position: 'top-center',
                duration: 4000,
            }
        )
    }
}





  const Button = styled(motion.button)`
    margin-top: 30px;
    padding: 10px 26px;
    font-size: 0.9rem;
    color: white;
    background: black;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    &:hover {
      background: green;
    }
  `;

  // Animation for the SupportAgent icon
  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: [0, 10, -10, 0], // Wiggle effect
      transition: { duration: 0.5 },
    },
    tap: {
      scale: 0.9,
    },
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleCloseNotifaction = () => {
    setOpenSettings(false);
  };
  // const manufacturer = searchParams.get('manufacturer')
  const [manufacturer, setManufacturer] = useState('')
  // const product_class = searchParams.get('product_class')
  const [product_class, setProductClass] = useState('')
  // const serial_number = searchParams.get('serial_number')
  const [serial_number, setSerialNumber] = useState('')
  // const oui = searchParams.get('oui')
  const [oui, setOui] = useState('')
  // const software_version = searchParams.get('software_version')
  const [software_version, setSoftwareVersion] = useState('')
  // const hardware_version = searchParams.get('hardware_version')
  const [hardware_version, setHardwareVersion] = useState('')
  // const uptime = searchParams.get('uptime')
  const [uptime, setUptime] = useState('')
  // const ram_used = searchParams.get('ram_used')
  const [ram_used, setRamUsed] = useState('')
  // const cpu_used = searchParams.get('cpu_used')
  const [cpu_used, setCpuUsed] = useState('')

  // const dhcp_name = searchParams.get('dhcp_name')
  const [dhcp_name, setDhcpName] = useState('')

  // const dhcp_addressing_type = searchParams.get('dhcp_addressing_type')
  const [dhcp_addressing_type, setDhcpAddressingType] = useState('')
  // const dhcp_connection_status = searchParams.get('dhcp_connection_status')
  const [dhcp_connection_status, setDhcpConnectionStatus] = useState('')
  // const dhcp_uptime = searchParams.get('dhcp_uptime')
const [dhcp_uptime, setDhcpUptime] = useState('')
  // const dhcp_ip = searchParams.get('dhcp_ip')
  const [dhcp_ip, setDhcpIp] = useState('')
  // const dhcp_subnet_mask = searchParams.get('dhcp_subnet_mask')
  const [dhcp_subnet_mask, setDhcpSubnetMask] = useState('')
  // const dhcp_gateway = searchParams.get('dhcp_gateway')
  const [dhcp_gateway, setDhcpGateway] = useState('')
  // const dhcp_dns_servers = searchParams.get('dhcp_dns_servers')
   const [dhcp_dns_servers, setDhcpDnsServers] = useState('')
  // const dhcp_last_connection_error = searchParams.get('dhcp_last_connection_error')
  const [dhcp_last_connection_error, setDhcpLastConnectionError] = useState('')
  // const dhcp_mac_address = searchParams.get('dhcp_mac_address')
  const [dhcp_mac_address, setDhcpMacAddress] = useState('')
  // const dhcp_max_mtu_size = searchParams.get('dhcp_max_mtu_size')
  const [dhcp_max_mtu_size, setDhcpMaxMtuSize] = useState('')
  // const dhcp_nat_enabled = searchParams.get('dhcp_nat_enabled')
  const [dhcp_nat_enabled, setDhcpNatEnabled] = useState('')
  // const dhcp_vlan_id = searchParams.get('dhcp_vlan_id')
  const [dhcp_vlan_id, setDhcpVlanId] = useState()
  // const status = (searchParams.get('status') || '').trim()
  const [status, setStatus] = useState('')
const [refreshing, setRefreshing] = useState(false)
const [ssid1, setSsid1] = useState('')
const [ssid2, setSsid2] = useState('')
const [wlan1_status, setWlan1Status] = useState('')


const [wifi_password1, setWifiPassword1] = useState('')
const [wifi_password2, setWifiPassword2] = useState('')
const [rf_band1, setRfBand1] = useState('')
const [total_associations1, setTotalAssociations1] = useState('')
const [enable1, setEnable1] = useState(false)
const [standard1, setStandard1] = useState(false)
const [radio_enabled1, setRadioEnabled1] = useState(false)
const [ssid_advertisment_enabled1, setSsidAdvertismentEnabled1] = useState(false)
const [wpa_encryption1, setWpaEncryption1] = useState('')
const [channel_width1, setChannelWidth1] = useState('')
const [autochannel1, setAutochannel1] = useState(false)
const [channel, setChannel] = useState('')
const [loading, setLoading] = useState(false)
const [loadingDhcpServer, setLoadingDhcpServer] = useState(false)

const [country_regulatory_domain1, setCountryRegulatoryDomain1] = useState('')
const [tx_power1, setTxPower1] = useState('')
const [lan_ip_interface_address, setLanIpInterfaceAddress] = useState('')
const [lan_ip_interface_net_mask, setLanIpInterfaceNetMask] = useState('')
const [dhcp_server_enable, setDhcpServerEnable] = useState(false)
const [dhcp_ip_pool_min_addr, setDhcpIpPoolMinAddr] = useState('')
const [dhcp_ip_pool_max_addr, setDhcpIpPoolMaxAddr] = useState('')
const [dhcp_server_subnet_mask, setDhcpServerSubnetMask] = useState('')
const [dhcp_server_default_gateway, setDhcpServerDefaultGateway] = useState('')
const [dhcp_server_dns_servers, setDhcpServerDnsServers] = useState('')
const [lease_time, setLeaseTime] = useState('')
const [clients_domain_name, setClientsDomainName] = useState('')
const [reserved_ip_address, setReservedIpAddress] = useState('')


const onu_id = searchParams.get('onu_id')

const changeWirelessLan1 = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    const response = await fetch(`/api/change_wireless_lan1/${onu_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain,
      },
      body: JSON.stringify({
        enable1: enable1,
        rf_band1: rf_band1,
        ssid1: ssid1,
        standard1: standard1,
        wifi_password1: wifi_password1,
        radio_enabled1: radio_enabled1,
        total_associations1: total_associations1,
        ssid_advertisment_enabled1: ssid_advertisment_enabled1,
        wpa_encryption1: wpa_encryption1,
        channel_width1: channel_width1,
        autochannel1: autochannel1,
        channel: channel,
        country_regulatory_domain1: country_regulatory_domain1,
        // tx_power1: tx_power1,
        // authentication_mode1: authentication_mode1,
      })
    });

    // You can handle the response here if needed
    if (!response.ok) {
      setLoading(false);
      toast.error(
        "Failed to update wirelessLAN settings",
        {
          position: "top-right",
          duration: 6000
         
        }
      )
            throw new Error("Failed to update wirelessLAN settings");

    }

    
    const data = await response.json();



    if (response.ok) {
      refreshDevice()
      setLoading(false);
      toast.success('WirelessLAN1 updated successfully', {
        position: "top-center",
        duration: 4000,
      })
    } 
    console.log("WirelessLAN1 updated:", data);
  } catch (error) {
    toast.error('error changing WirelessLAN1 server error', {
      position: "top-center",
      duration: 6000,
    })
    setLoading(false);
    console.error("Error changing WirelessLAN1:", error);
  }
};




function parseDuration(input) {
  const match = input.match(/^(\d+)([smhd])$/);
  if (!match) return null;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const unitMap = { s: 1, m: 60, h: 3600, d: 86400 };
  return value * unitMap[unit];
}




const changeDhcpServerSettings = async (e) => {
  e.preventDefault();
   const parsed = parseDuration(lease_time);
    if (parsed == null) {
            toast.error("Invalid format. Use the format: 1d, 1h, 1m, 1s", {   
              position: "top-center",
              duration: 6000,
              
            })

    } 
  try {
    setLoadingDhcpServer(true);
    const response = await fetch(`/api/change_dhcp_server_settings/${onu_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain,
      },
      body: JSON.stringify({
       
        dhcp_server_enable: dhcp_server_enable,
        dhcp_ip_pool_min_addr: dhcp_ip_pool_min_addr,
        dhcp_ip_pool_max_addr: dhcp_ip_pool_max_addr,
        dhcp_server_subnet_mask: dhcp_server_subnet_mask,
        dhcp_server_default_gateway: dhcp_server_default_gateway,
        dhcp_server_dns_servers: dhcp_server_dns_servers,
        lease_time: parsed,
        clients_domain_name: clients_domain_name,
        reserved_ip_address: reserved_ip_address,
        lan_ip_interface_address: lan_ip_interface_address,
        lan_ip_interface_net_mask: lan_ip_interface_net_mask
      })
    });

    // You can handle the response here if needed
    if (!response.ok) {
      setLoadingDhcpServer(false);
      toast.error(
        "Failed to update DHCP server",
        {
          position: "top-right",
          duration: 6000
         
        }
      )
       throw new Error("Failed to update wirelessLAN settings");

    }

    
    const data = await response.json();



    if (response.ok) {
      refreshDevice()
      setLoadingDhcpServer(false);
      toast.success('DHCP server updated successfully', {
        position: "top-center",
        duration: 4000,
      })
    } 
  } catch (error) {
    toast.error('error changing DHCP, server error', {
      position: "top-center",
      duration: 6000,
    })
    setLoadingDhcpServer(false);
    console.error("Error changing WirelessLAN1:", error);
  }
};


  const getDevice = useCallback(
    async() => {
      

      try {
        const response = await fetch(`/api/get_device/${id}`, {
          headers: {
            'X-Subdomain': subdomain,
          },
       
        })
        if (response.ok) {
          const data = await response.json()
          // setDevice(data)
          console.log('data from get device tr069', data)
          setManufacturer(data.manufacturer)
          setProductClass(data.product_class)
          setSerialNumber(data.serial_number)
          setChannel(data.channel)
          setWifiPassword1(data.wifi_password1)
          setWifiPassword2(data.wifi_password2)
          setSsid1(data.ssid1)
          setWpaEncryption1(data.wpa_encryption1)
          setSsid2(data.ssid2)
          setRfBand1(data.rf_band1)
          setWlan1Status(data.wlan1_status)
          setOui(data.oui)
          setCountryRegulatoryDomain1(data.country_regulatory_domain1)
          setSoftwareVersion(data.software_version)
          setHardwareVersion(data.hardware_version)
          setUptime(data.uptime)
          setRamUsed(data.ram_used)
          setRadioEnabled1(data.radio_enabled1)
          setCpuUsed(data.cpu_used)
          setSsidAdvertismentEnabled1(data.ssid_advertisment_enabled1)
          setDhcpName(data.dhcp_name)
          setChannelWidth1(data.channel_width1)
          setDhcpAddressingType(data.dhcp_addressing_type)
          setDhcpConnectionStatus(data.dhcp_connection_status)
          setDhcpUptime(data.dhcp_uptime)
          setDhcpIp(data.dhcp_ip)
          setEnable1(data.enable1)
          setDhcpSubnetMask(data.dhcp_subnet_mask)
          setDhcpVlanId(data.dhcp_vlan_id)
          setDhcpGateway(data.dhcp_gateway)
          setLanIpInterfaceAddress(data.lan_ip_interface_address)
          setLanIpInterfaceNetMask(data.lan_ip_interface_net_mask)
          setDhcpServerEnable(data.dhcp_server_enable)
          setDhcpIpPoolMinAddr(data.dhcp_ip_pool_min_addr)
          setDhcpIpPoolMaxAddr(data.dhcp_ip_pool_max_addr)
          setDhcpServerSubnetMask(data.dhcp_server_subnet_mask)
          setDhcpServerDefaultGateway(data.dhcp_server_default_gateway)
          setDhcpServerDnsServers(data.dhcp_server_dns_servers)
          setLeaseTime(data.lease_time)
          setClientsDomainName(data.clients_domain_name)
          setReservedIpAddress(data.reserved_ip_address)
          setDhcpDnsServers(data.dhcp_dns_servers)
          setDhcpLastConnectionError(data.dhcp_last_connection_error)
          setDhcpMacAddress(data.dhcp_mac_address)
          setDhcpMaxMtuSize(data.dhcp_max_mtu_size)
          setDhcpNatEnabled(data.dhcp_nat_enabled)
          setStatus(data.status)
          setTotalAssociations1(data.total_associations1)
          setStandard1(data.standard1)
          setAutochannel1(data.autochannel1)



          
        } else {
         toast.error('failed to fetch device', {  
            position: "top-center",
            duration: 4000,
            
          })
        }
      } catch (error) {
         toast.error('failed to fetch device server error', {  
            position: "top-center",
            duration: 4000,
            
          })
      }
    },
    [],
  )
  


  useEffect(() => {
    getDevice()
  
  }, [getDevice]);








const refreshDevice = async() => {
  
  try {
    setRefreshing(true); // Start refreshing animation
    const response = await fetch(`/api/refresh_device/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain,
      }
    })

const data = await response.json()
    if (response.ok) {
      toast.success('Device refreshed successfully', {
        position: "top-center",
        duration: 6000,
        
      })


       setManufacturer(data.manufacturer)
          setProductClass(data.product_class)
          setSerialNumber(data.serial_number)
          setOui(data.oui)
          setSoftwareVersion(data.software_version)
          setHardwareVersion(data.hardware_version)
          setUptime(data.uptime)
           setWifiPassword1(data.wifi_password1)
          setWifiPassword2(data.wifi_password2)
          setSsid1(data.ssid1)
          setSsid2(data.ssid2)
          setWpaEncryption1(data.wpa_encryption1)
          setRfBand1(data.rf_band1)
          setRadioEnabled1(data.radio_enabled1)
          setWlan1Status(data.wlan1_status)
          setRamUsed(data.ram_used)
          setCpuUsed(data.cpu_used)
          setChannelWidth1(data.channel_width1)
          setEnable1(data.enable1)
          setDhcpName(data.dhcp_name)
          setStandard1(data.standard1)
                    setChannel(data.channel)
                      setLanIpInterfaceAddress(data.lan_ip_interface_address)
          setLanIpInterfaceNetMask(data.lan_ip_interface_net_mask)
          setDhcpServerEnable(data.dhcp_server_enable)
          setDhcpIpPoolMinAddr(data.dhcp_ip_pool_min_addr)
          setDhcpIpPoolMaxAddr(data.dhcp_ip_pool_max_addr)
          setDhcpServerSubnetMask(data.dhcp_server_subnet_mask)
          setDhcpServerDefaultGateway(data.dhcp_server_default_gateway)
          setDhcpServerDnsServers(data.dhcp_server_dns_servers)
          setLeaseTime(data.lease_time)
          setClientsDomainName(data.clients_domain_name)
          setReservedIpAddress(data.reserved_ip_address)



          setDhcpAddressingType(data.dhcp_addressing_type)
          setDhcpConnectionStatus(data.dhcp_connection_status)
          setDhcpUptime(data.dhcp_uptime)
          setDhcpIp(data.dhcp_ip)
          setSsidAdvertismentEnabled1(data.ssid_advertisment_enabled1)
          setDhcpSubnetMask(data.dhcp_subnet_mask)
          setDhcpVlanId(data.dhcp_vlan_id)
          setDhcpGateway(data.dhcp_gateway)
          setDhcpDnsServers(data.dhcp_dns_servers)
          setDhcpLastConnectionError(data.dhcp_last_connection_error)
          setDhcpMacAddress(data.dhcp_mac_address)
          setDhcpMaxMtuSize(data.dhcp_max_mtu_size)
          setDhcpNatEnabled(data.dhcp_nat_enabled)
          setStatus(data.status)
          setTotalAssociations1(data.total_associations1)
          setAutochannel1(data.autochannel1)
            setCountryRegulatoryDomain1(data.country_regulatory_domain1)
                    
    } else {
      toast.error('failed to refresh device', {
        position: "top-center",
        duration: 6000,
        
      })
    }
  } catch (error) {
    
    toast.error('failed to refresh device server error', {
        position: "top-center",
        duration: 6000,
        
      })
  } finally {
    setRefreshing(false); // Stop refreshing animation
  }
}
  return (



    <>

<Toaster />

<Backdrop  handleClose={handleClose}  open={open}/>
<SettingsNotification open={openNotifactionSettings} handleClose={handleCloseNotifaction }/>



    <div>
      {status === 'offline' && <div className='bg-red-500 rounded-lg p-2 mb-3'>
         <p className='text-white'>
   Device is offline! showing last recorded values
</p></div>}



<div 
onClick={handleRebootClick}
className='p-4 cursor-pointer bg-red-50 dark:bg-red-900 
                    flex gap-2 items-center justify-center mb-3 rounded-lg'>
                      <VscPulse className='w-6 h-6'/>

                      <span className="text-sm">
                        Reboot Device
                    </span>

</div>



 {/* Reboot Confirmation Dialog */}
      <Dialog
        open={rebootConfirmOpen}
        onClose={handleRebootCancel}
        aria-labelledby="reboot-confirm-title"
        aria-describedby="reboot-confirm-description"
      >
        <DialogTitle id="reboot-confirm-title" className="bg-gray-50 dark:bg-gray-800">
          Confirm Device Reboot
        </DialogTitle>
        <DialogContent className="bg-gray-50 dark:bg-gray-800">
          <DialogContentText id="reboot-confirm-description" className="text-gray-700 dark:text-gray-300">
            Are you sure you want to reboot this device? 
            <br />
            <strong className="text-red-600 dark:text-red-400">
              This will temporarily disconnect the device and any connected users.
            </strong>
            <br /><br />
            Device: {serial_number} ({manufacturer} {product_class})
          </DialogContentText>
        </DialogContent>
        <DialogActions className="bg-gray-50 dark:bg-gray-800">
          <Button 
            onClick={handleRebootCancel} 
            color="primary"
            className="hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => rebootDevice()} 
            color="error" 
            variant="contained"
            autoFocus
            disabled={rebooting}
            className="bg-red-600 hover:bg-red-700"
          >
            {rebooting ? 'Rebooting...' : 'Yes, Reboot Device'}
          </Button>
        </DialogActions>
      </Dialog>

 <div className='p-4 cursor-pointer bg-green-50 dark:bg-green-900 
                    flex gap-2 items-center justify-center mb-3 rounded-lg'
                    onClick={refreshDevice}
                >
                    {refreshing ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        <FiRefreshCcw />
                    )}
                    <span className="text-sm">
                        {refreshing ? 'Refreshing...' : 'Refresh Device'}
                    </span>
                </div>





      <form onSubmit={handleCreateTicketSettings}>
        <Accordion
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
        >
          <AccordionSummary
            expandIcon={
              <ArrowDownwardIcon
                className="dark:text-white text-black"
                sx={{ transition: "transform 0.3s" }}
              />

              
            }
            aria-controls="panel1-content"
            id="panel1-header"
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: "10px",
              color: "black",
            }}
          >

            <Typography variant="h6">
              <motion.div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <motion.div
                  variants={iconVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
<div className='flex gap-2 items-center'>
                  <IoHomeOutline
                   className='dark:text-white'
                  />

   </div>                          

                </motion.div>
                <p className="dark:text-white text-black
                font-bold
                roboto-condensed-light">
                  General
                </p>
              </motion.div>
            </Typography>

          </AccordionSummary>

          <AccordionDetails
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: "10px",
              marginTop: "10px",
              padding: "20px",
            }}
          >
           <div className='flex flex-col  cursor-pointer '>
           <div className='flex gap-[150px] hover:bg-gray-300 p-2 
           dark:text-white
           rounded-lg'>
            <p>Manufacturer</p>
            <p>{manufacturer}</p>

           </div>


           <div className='flex gap-[150px]
            bg-gray-200 rounded-lg p-2 hover:bg-gray-300
            dark:text-black
            '> 
            <p>Product Class</p>
            <p>{product_class || 'h'}</p>
           </div>




               <div className='flex gap-[150px]
             rounded-lg p-2 hover:bg-gray-300 dark:text-white'> 
            <p>Software Version</p>
            <p>{software_version}</p>
           </div>


             <div className='flex gap-[150px]
             rounded-lg p-2 hover:bg-gray-300
             dark:text-black
             bg-gray-200'> 
            <p>Hardware Version</p>
            <p>{hardware_version}</p>
           </div>



             <div className='flex gap-[150px]
             rounded-lg p-2 hover:bg-gray-300 dark:text-white'> 
            <p>Serial Number</p>
            <p>{serial_number}</p>
           </div>




           <div className='flex gap-[150px]
           bg-gray-200
             rounded-lg p-2 hover:bg-gray-300 '> 
            <p>OUI</p>
            <p>{oui}</p>

           </div>





           <div className='flex gap-[150px]
             rounded-lg p-2 hover:bg-gray-300 dark:text-white'> 
            <p>Uptime</p>
            <p>{uptime}</p>

           </div>




             <div className='flex gap-[150px]
             rounded-lg p-2 bg-gray-200 hover:bg-gray-300 '> 
            <p>RAM Used</p>
            <p>{ram_used}</p>

           </div>

            <div className='flex gap-[150px]
             rounded-lg p-2 hover:bg-gray-300 dark:text-white'> 
            <p>CPU Used</p>
            <p>{cpu_used}</p>

           </div>
</div>
        
          </AccordionDetails>
        </Accordion>
      </form>
    </div>








<div className='mt-2'>
      <form onSubmit={handleCreateTicketSettings}>
        <Accordion
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
        >
          <AccordionSummary
            expandIcon={
              <ArrowDownwardIcon
                className="dark:text-white text-black"
                sx={{ transition: "transform 0.3s" }}
              />
            }
            aria-controls="panel1-content"
            id="panel1-header"
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: "10px",
              color: "black",
            }}
          >
            <Typography variant="h6">
              <motion.div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <motion.div
                  variants={iconVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <MdDevices
                   className='dark:text-white'
                  />
                </motion.div>
                <p className="dark:text-white text-black roboto-condensed">
                  Hosts
                </p>
              </motion.div>
            </Typography>
          </AccordionSummary>



          <AccordionDetails
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: "10px",
              marginTop: "10px",
              padding: "20px",
            }}
          >
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong className='roboto-condensed-light'>What does this setting do?</strong>
              <br />
              <p className='roboto-condensed'>Configure system-wide settings for support tickets, including
              notifications, priorities, and workflows. </p>
            </Typography>




<TextField  
name='prefix'
onChange={handleChange}
helperText={
    <p className='dark:text-white text-black text-lg md:w-full md:text-sm  
    text-wrap w-[140px] roboto-condensed'>Can be any letter example(FK, TQ, QM, M, A, B)</p>}
className='myTextField'
  sx={{
    width: '100%',
    mt:2,

    '& label.Mui-focused': {
      color: 'black',
      fontSize:'16px'
    },
    '& .MuiOutlinedInput-root': {
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "black",
        borderWidth: '3px'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      }
    },
  }}
value={prefix} fullWidth  label='Prefix'    />




<TextField 
name='minimum_digits'
value={minimum_digits}
onChange={handleChange}
className='myTextField'
type='number'
sx={{
    width: '100%',
    mt:2,

    '& label.Mui-focused': {
      color: 'black',
      fontSize:'16px'
    },
    '& .MuiOutlinedInput-root': {
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "black",
        borderWidth: '3px'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      }
    },
  }}
fullWidth
label='Minimum Digits'
helperText={
  <p className='dark:text-white text-black text-lg md:w-full md:text-sm 
   text-wrap w-[140px] roboto-condensed'> 
    Minimum Digits(Zeros will be added to the front of the prefix, eg SUB001 for
        three digits)
     </p>  
}
/>
            {/* Interactive Update Button */}
            <Tooltip title="Update ticket settings system-wide">
              <Button
                type="submit"
                sx={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  backgroundColor: "#ff6f61",
                  color: "white",
                  borderRadius: "25px",
                  "&:hover": {
                    backgroundColor: "#ff4a3d",
                  },
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                component={motion.button}
              >
                Update Settings
              </Button>
            </Tooltip>
          </AccordionDetails>
        </Accordion>
      </form>
    </div>





<div className='mt-2'>
      <form onSubmit={handleCreateTicketSettings}>
        <Accordion
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
        >
          <AccordionSummary
            expandIcon={
              <ArrowDownwardIcon
                className="dark:text-white text-black"
                sx={{ transition: "transform 0.3s" }}
              />
            }
            aria-controls="panel1-content"
            id="panel1-header"
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: "10px",
              color: "black",
            }}
          >
            <Typography variant="h6">
              <motion.div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <motion.div
                  variants={iconVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <IoWifi
                   className='dark:text-white'
                  />
                </motion.div>
                <p className="dark:text-white text-black roboto-condensed">
                  PPP Interface
                </p>
              </motion.div>
            </Typography>
          </AccordionSummary>

          <AccordionDetails
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: "10px",
              marginTop: "10px",
              padding: "20px",
            }}
          >
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong className='roboto-condensed-light'>What does this setting do?</strong>
              <br />
              <p className='roboto-condensed'>Configure system-wide settings for support tickets, including
              notifications, priorities, and workflows. </p>
            </Typography>




<TextField  
name='prefix'
onChange={handleChange}
helperText={
    <p className='dark:text-white text-black text-lg md:w-full md:text-sm  
    text-wrap w-[140px] roboto-condensed'>Can be any letter example(FK, TQ, QM, M, A, B)</p>}
className='myTextField'
  sx={{
    width: '100%',
    mt:2,

    '& label.Mui-focused': {
      color: 'black',
      fontSize:'16px'
    },
    '& .MuiOutlinedInput-root': {
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "black",
        borderWidth: '3px'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      }
    },
  }}
value={prefix} fullWidth  label='Prefix'    />




<TextField 
name='minimum_digits'
value={minimum_digits}
onChange={handleChange}
className='myTextField'
type='number'
sx={{
    width: '100%',
    mt:2,

    '& label.Mui-focused': {
      color: 'black',
      fontSize:'16px'
    },
    '& .MuiOutlinedInput-root': {
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "black",
        borderWidth: '3px'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      }
    },
  }}
fullWidth
label='Minimum Digits'
helperText={
  <p className='dark:text-white text-black text-lg md:w-full md:text-sm 
   text-wrap w-[140px] roboto-condensed'> 
    Minimum Digits(Zeros will be added to the front of the prefix, eg SUB001 for
        three digits)
     </p>  
}
/>
            {/* Interactive Update Button */}
            <Tooltip title="Update ticket settings system-wide">
              <Button
                type="submit"
                sx={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  backgroundColor: "#ff6f61",
                  color: "white",
                  borderRadius: "25px",
                  "&:hover": {
                    backgroundColor: "#ff4a3d",
                  },
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                component={motion.button}
              >
                Update Settings
              </Button>
            </Tooltip>
          </AccordionDetails>
        </Accordion>
      </form>
    </div>








<div className='mt-2'>
      <form onSubmit={handleCreateTicketSettings}>
        <Accordion
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
        >
          <AccordionSummary
            expandIcon={
              <ArrowDownwardIcon
                className="dark:text-white text-black"
                sx={{ transition: "transform 0.3s" }}
              />
            }
            aria-controls="panel1-content"
            id="panel1-header"
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: "10px",
              color: "black",
            }}
          >
            <Typography variant="h6">
              <motion.div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <motion.div
                  variants={iconVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <IoWifi
                   className='dark:text-white'
                  />
                </motion.div>
                <p className="dark:text-white text-black roboto-condensed">
                  IP Interface
                </p>
              </motion.div>
            </Typography>
          </AccordionSummary>

          <AccordionDetails
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: "10px",
              marginTop: "10px",
              padding: "20px",
            }}
          >
           

  <div className='flex flex-col  cursor-pointer '>
           <div className='flex gap-[150px] hover:bg-gray-300 p-2 
           dark:text-white
           rounded-lg'>
            <p>Name</p>
            <p>{dhcp_name}</p>

           </div>


           <div className='flex gap-[150px]
            bg-gray-200 rounded-lg p-2 hover:bg-gray-300
            dark:text-black
            '> 
            <p>Addresing Type</p>
            <p>{dhcp_addressing_type}</p>
           </div>




               <div className='flex gap-[150px]
             rounded-lg p-2 hover:bg-gray-300 dark:text-white'> 
            <p>Connection Status</p>
            <p>{dhcp_connection_status}</p>
           </div>


             <div className='flex gap-[150px]
             rounded-lg p-2 hover:bg-gray-300
             dark:text-black
             bg-gray-200'> 
            <p>Uptime</p>
            <p>{dhcp_uptime}</p>
           </div>



             <div className='flex gap-[150px]
             rounded-lg p-2 hover:bg-gray-300 dark:text-white'> 
            <p>IP Address	</p>
            <p>{dhcp_ip}</p>
           </div>




           <div className='flex gap-[150px]
           bg-gray-200
             rounded-lg p-2 hover:bg-gray-300 '> 
            <p>Subnet Mask	</p>
            <p>{dhcp_subnet_mask}</p>

           </div>





           <div className='flex gap-[150px]
             rounded-lg p-2 hover:bg-gray-300 dark:text-white'> 
            <p>Default Gateway	</p>
            <p>{dhcp_gateway}</p>

           </div>




             <div className='flex gap-[150px]
             rounded-lg p-2 bg-gray-200 hover:bg-gray-300 '> 
            <p>DNS Servers	</p>
            <p>{dhcp_dns_servers}</p>

           </div>

            <div className='flex gap-[150px]
             rounded-lg p-2 hover:bg-gray-300 dark:text-white'> 
            <p>Last connection error</p>
            <p>{dhcp_last_connection_error}</p>

           </div>




           <div className='flex gap-[150px]
             rounded-lg p-2 bg-gray-200 hover:bg-gray-300 dark:text-black'> 
            <p>MAC Address	</p>
            <p>{dhcp_mac_address}</p>

           </div>



           <div className='flex gap-[150px]
             rounded-lg p-2  hover:bg-gray-300 dark:text-white'> 
            <p>Max MTU Size		</p>
            <p>{dhcp_max_mtu_size}</p>

           </div>





           <div className='flex gap-[150px]
             rounded-lg p-2 bg-gray-200  hover:bg-gray-300
              dark:text-black'> 
            <p>NAT Enabled		</p>
            <p>{dhcp_nat_enabled}</p>

           </div>




             <div className='flex gap-[150px]
             rounded-lg p-2   hover:bg-gray-300 dark:text-white'> 
            <p>VLAN ID	</p>
            <p>{dhcp_vlan_id}</p>

           </div>
</div>
        


          </AccordionDetails>
        </Accordion>
      </form>
    </div>












<div className='mt-2'>
      <form onSubmit={changeDhcpServerSettings}>
        <Accordion
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
        >
          <AccordionSummary
            expandIcon={
              <ArrowDownwardIcon
                className="dark:text-white text-black"
                sx={{ transition: "transform 0.3s" }}
              />
            }
            aria-controls="panel1-content"
            id="panel1-header"
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: "10px",
              color: "black",
            }}
          >
            <Typography variant="h6">
              <motion.div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <motion.div
                  variants={iconVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <GiServerRack
                   className='dark:text-white'
                  />
                </motion.div>
                <p className="dark:text-white text-black roboto-condensed">
                  LAN DHCP Server
                </p>
              </motion.div>
            </Typography>
          </AccordionSummary>

          <AccordionDetails
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: "10px",
              marginTop: "10px",
              padding: "20px",
            }}
          >
          

<div className='flex flex-col cursor-pointer '>

<div className='flex flex-row justify-between items-center'>
  <p>LAN IP interface address	</p>
<TextField  

onChange={(e) => setLanIpInterfaceAddress(e.target.value)}

className='myTextField'
  sx={{
    width: '100%',
    mt:2,

    '& label.Mui-focused': {
      color: 'black',
      fontSize:'16px'
    },
    '& .MuiOutlinedInput-root': {
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "black",
        borderWidth: '3px'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      }
    },
  }}
value={lan_ip_interface_address} fullWidth  label='LAN IP interface address'    />
</div>



<div className='flex flex-row justify-between items-center'>
  <p>LAN IP interface netmask	</p>
<TextField 
value={lan_ip_interface_net_mask}
onChange={(e) => setLanIpInterfaceNetMask(e.target.value)}
className='myTextField'
sx={{
    width: '100%',
    mt:2,

    '& label.Mui-focused': {
      color: 'black',
      fontSize:'16px'
    },
    '& .MuiOutlinedInput-root': {
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "black",
        borderWidth: '3px'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      }
    },
  }}
fullWidth
label='Minimum Digits'

/>

</div>




<div className='flex flex-row  items-center gap-8'>
  <p>DHCP server enable	</p>
  <FormControlLabel
    className="dark:text-white text-black mb-1"
    control={
      <Checkbox 
        checked={dhcp_server_enable}
          onChange={(e)=> setDhcpServerEnable(e.target.checked)}
        color="default"
      />
    }
    label={<span className="font-medium">{dhcp_server_enable ? 'Yes' : 'No'}</span>}
  />
</div>



<div className='flex flex-row justify-between items-center mt-2'>
  <p>DHCP IP Pool Min address	</p>

  <TextField
    value={dhcp_ip_pool_min_addr}
    onChange={(e) => setDhcpIpPoolMinAddr(e.target.value)}
    className='myTextField'
    sx={{
      width: '100%',
      '& label.Mui-focused': {
        color: 'black',
        fontSize:'16px'
      },
      '& .MuiOutlinedInput-root': {
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "black",
          borderWidth: '3px'
        },
        '&.Mui-focused fieldset': {
          borderColor: 'black',
        }
      },
    }}
  
  />

</div>


<div className='flex flex-row justify-between items-center mt-2'>
  <p>DHCP IP Pool Max address	</p>
  <TextField 
  
    value={dhcp_ip_pool_max_addr}
    onChange={(e) => setDhcpIpPoolMaxAddr(e.target.value)}
    className='myTextField'
    sx={{
      width: '100%',
      '& label.Mui-focused': {
        color: 'black',
        fontSize:'16px'
      },
      '& .MuiOutlinedInput-root': {
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "black",
          borderWidth: '3px'
        },
        '&.Mui-focused fieldset': {
          borderColor: 'black',
        }
      },
    }}
  
  />

</div>



<div className='flex flex-row justify-between items-center mt-2'>
  <p>DHCP subnet mask	</p>
  <TextField 
  
    
    value={dhcp_server_subnet_mask}
    onChange={(e) => setDhcpServerSubnetMask(e.target.value)}
    className='myTextField'
    sx={{
      width: '100%',
      '& label.Mui-focused': {
        color: 'black',
        fontSize:'16px'
      },
      '& .MuiOutlinedInput-root': {
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "black",
          borderWidth: '3px'
        },
        '&.Mui-focused fieldset': {
          borderColor: 'black',
        }
      },
    }}
  />

</div>


<div className=' flex flex-row justify-between items-center mt-2'>
  <p>DHCP default gateway	</p>
  <TextField

    value={dhcp_server_default_gateway}
    onChange={(e) => setDhcpServerDefaultGateway(e.target.value)}
    className='myTextField'
    sx={{
      width: '100%',
      '& label.Mui-focused': {
        color: 'black',
        fontSize:'16px'
      },
      '& .MuiOutlinedInput-root': {
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "black",
          borderWidth: '3px'
        },
        '&.Mui-focused fieldset': {
          borderColor: 'black',
        }
      },
    }}
   />


  </div> 



<div className='flex flex-row justify-between items-center mt-2'>
  <p>DHCP DNS servers	</p>
  <TextField 
  
    
    value={dhcp_server_dns_servers}
    onChange={(e) => setDhcpServerDnsServers(e.target.value)}
    className='myTextField'
    sx={{
      width: '100%',
      '& label.Mui-focused': {
        color: 'black',
        fontSize:'16px'
      },
      '& .MuiOutlinedInput-root': {
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "black",
          borderWidth: '3px'
        },
        '&.Mui-focused fieldset': {
          borderColor: 'black',
        }
      },
    }}
  />

</div>


<div className='flex flex-row justify-between items-center mt-2'>
  <p>Lease time	</p>
  <TextField 

    value={lease_time}
    onChange={(e) => setLeaseTime(e.target.value)}
    className='myTextField'
    sx={{
      width: '100%',
      '& label.Mui-focused': {
        color: 'black',
        fontSize:'16px'
      },
      '& .MuiOutlinedInput-root': {
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "black",
          borderWidth: '3px'
        },
        '&.Mui-focused fieldset': {
          borderColor: 'black',
        }
      },
    }}
  />
</div>



<div className='flex flex-row justify-between items-center mt-2'>
  <p>Reserved IP address		</p>
  <TextField
    value={reserved_ip_address}
    onChange={(e) => setReservedIpAddress(e.target.value)}
    className='myTextField'
    sx={{
      width: '100%',
      '& label.Mui-focused': {
        color: 'black',
        fontSize:'16px'
      },
      '& .MuiOutlinedInput-root': {
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "black",
          borderWidth: '3px'
        },
        '&.Mui-focused fieldset': {
          borderColor: 'black',
        }
      },
    }}
  />

</div>
</div>
            {/* Interactive Update Button */}
              <Button
                type="submit"
                sx={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  backgroundColor: "#ff6f61",
                  color: "white",
                  borderRadius: "25px",
                  "&:hover": {
                    backgroundColor: "#ff4a3d",
                  },
                }}
                whileHover={{ scale: 1.1 }}
                // whileTap={{ scale: 0.9 }}
                component={motion.button}
              >
                {loadingDhcpServer ? 'Updating DHCP Server Settings....' : 'Update Settings'}
              </Button>
          </AccordionDetails>
        </Accordion>
      </form>
    </div>





<div className='mt-2'>
        <Accordion
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
        >
          <AccordionSummary
            expandIcon={
              <ArrowDownwardIcon
                className="dark:text-white text-black"
                sx={{ transition: "transform 0.3s" }}
              />
            }
            aria-controls="panel1-content"
            id="panel1-header"
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: "10px",
              color: "black",
            }}
          >
            <Typography variant="h6">
              <motion.div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <motion.div
                  variants={iconVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <IoWifi
                   className='dark:text-white'
                  />
                </motion.div>
                <p className="dark:text-white text-black roboto-condensed">
                  Wireless LAN1
                </p>
              </motion.div>
            </Typography>
          </AccordionSummary>

          <AccordionDetails
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: "10px",
              marginTop: "10px",
              padding: "20px",
            }}
          >
           


<form
onSubmit={changeWirelessLan1}
className='flex flex-col  cursor-pointer '>



           <div className='flex flex-row justify-center items-center gap-x-[150px]
             rounded-lg p-2 hover:bg-gray-300 
            dark:text-black
            '> 
                          <p className='dark:text-white'>SSID</p>

            <TextField  
onChange={(e) => setSsid1(e.target.value)}

className='myTextField'
  sx={{
    width: '100%',

    '& label.Mui-focused': {
      color: 'black',
      fontSize:'16px'
    },
    '& .MuiOutlinedInput-root': {
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "black",
        borderWidth: '3px'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      }
    },
  }}
value={ssid1} fullWidth      />
            {/* <p>{product_class}</p> */}
           </div>


<div className='flex flex-row justify-center items-center gap-x-[150px]
             rounded-lg p-2 hover:bg-gray-300
            dark:text-black dark:bg-transparent
            '> 
            <p className='dark:text-white'>Password</p>

            <TextField 
onChange={(e) => setWifiPassword1(e.target.value)}

className='myTextField'
  sx={{
    width: '100%',
    '& label.Mui-focused': {
      color: 'black',
      fontSize:'16px'
    },
    '& .MuiOutlinedInput-root': {
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "black",
        borderWidth: '3px'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      }
    },
  }}
value={wifi_password1} fullWidth      />
</div>




<div className='flex flex-row justify-center items-center gap-x-[150px]
bg-gray-200
             rounded-lg p-2 hover:bg-gray-300
            dark:text-black dark:bg-transparent
            '> 
            <p className='dark:text-white'>Authentication  Mode</p>

            <TextField 
name='prefix'
onChange={handleChange}

className='myTextField'
  sx={{
    width: '100%',
    '& label.Mui-focused': {
      color: 'black',
      fontSize:'16px'
    },
    '& .MuiOutlinedInput-root': {
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "black",
        borderWidth: '3px'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      }
    },
  }}
value={prefix} fullWidth      />
</div>










<div className='flex gap-x-[150px]
             rounded-lg p-2 hover:bg-gray-300
            dark:text-black dark:bg-transparent
            '> 
            <p className='dark:text-white'>Status</p>

          <p className='dark:text-white'>{wlan1_status}</p>
</div>








<div className='flex gap-x-[150px]
bg-gray-200
             rounded-lg p-2 hover:bg-gray-300
            dark:text-black dark:bg-transparent
            '> 
            <p className='dark:text-white'>Enable</p>

          
           




    <FormControlLabel
      className="dark:text-white text-black mb-1"
      control={
        <Checkbox 
          checked={enable1}
            onChange={(e)=> setEnable1(e.target.checked)}

          color="default"
        />
      }
      label={<span className="font-medium">{enable1 ? 'Yes' : 'No'}</span>}
    />
</div>





<div className='flex gap-x-[150px]
             rounded-lg p-2 hover:bg-gray-300
            dark:text-black dark:bg-transparent
            '> 
            <p className='dark:text-white'>RF BAND</p>
            <p className='dark:text-white'>{rf_band1}</p>

          
</div>




<div className='flex flex-row justify-center items-center gap-x-[150px]
             rounded-lg p-2 hover:bg-gray-300
            dark:text-black dark:bg-transparent
            '> 
            <p className='dark:text-white'>Standard</p>

            <Autocomplete
  fullWidth
  options={standardOptions1}
  value={standardOptions1.find(option => option.value === standard1) || null}
  onChange={(event, newValue) => {
    if (newValue) {
      setStandard1(newValue.value);
    }
  }}
  
  getOptionLabel={(option) => option.label}
  renderInput={(params) => (
    <TextField
      {...params}
      // label="Subnet Mask"
      required
      className="myTextField"
    />
  )}
  disableClearable
  isOptionEqualToValue={(option, value) => option.value === value.value}
  sx={{
    '& .MuiAutocomplete-inputRoot': {
      padding: '8px 14px',
    },
    mt: 2 // Add margin if needed
  }}
/>
</div>







<div className='flex gap-x-[150px]
             rounded-lg p-2 hover:bg-gray-300
            dark:text-black dark:bg-transparent
            '> 
            <p className='dark:text-white'>Radio Enable</p>

            
    <FormControlLabel
      className="dark:text-white text-black mb-1"
      control={
        <Checkbox 
          checked={radio_enabled1}
            onChange={(e)=> setRadioEnabled1(e.target.checked)}

          color="default"
        />
      }
      label={<span className="font-medium">{radio_enabled1 ? 'Yes' : 'No'}</span>}
    />
</div>






<div className='flex gap-x-[150px]
             rounded-lg p-2 hover:bg-gray-300
            dark:text-black dark:bg-transparent
            '> 
            <p className='dark:text-white'>Total Associations</p>
            <p className='dark:text-white'>{total_associations1}</p>

            
</div>







<div className='flex gap-x-[150px]
             rounded-lg p-2 hover:bg-gray-300
            dark:text-black dark:bg-transparent
            '> 
            <p className='dark:text-white'>SSID Advertisment Enabled</p>



    <FormControlLabel
      className="dark:text-white text-black mb-1"
      control={
        <Checkbox 
          checked={ssid_advertisment_enabled1}
            onChange={(e)=> setSsidAdvertismentEnabled1(e.target.checked)}

          color="default"
        />
      }
      label={<span className="font-medium">{ssid_advertisment_enabled1 ? 'Yes' : 'No'}</span>}
    />
</div>



<div className='flex flex-row justify-center items-center gap-x-[150px]
             rounded-lg p-2 hover:bg-gray-300
            dark:text-black dark:bg-transparent
            '> 
            <p className='dark:text-white'>WPA Encryption</p>

              <Autocomplete
  fullWidth
  options={wpaEncryptionOptions1}
  value={wpaEncryptionOptions1.find(option => option.value === wpa_encryption1) || null}
  onChange={(event, newValue) => {
    if (newValue) {
      setWpaEncryption1(newValue.value);
    }
  }}
  
  getOptionLabel={(option) => option.label}
  renderInput={(params) => (
    <TextField
      {...params}
      // label="Subnet Mask"
      required
      className="myTextField"
    />
  )}
  disableClearable
  isOptionEqualToValue={(option, value) => option.value === value.value}
  sx={{
    '& .MuiAutocomplete-inputRoot': {
      padding: '8px 14px',
    },
    mt: 2 // Add margin if needed
  }}
/>

</div>




<div className='flex flex-row justify-center items-center gap-x-[150px]
             rounded-lg p-2 hover:bg-gray-300
            dark:text-black dark:bg-transparent
            '> 
            <p className='dark:text-white'>CHANNEL WIDTH</p>

          
              <Autocomplete
  fullWidth
  options={channelWidthOptions1}
  value={channelWidthOptions1.find(option => option.value === channel_width1) || null}
  onChange={(event, newValue) => {
    if (newValue) {
      setChannelWidth1(newValue.value);
    }
  }}
  
  getOptionLabel={(option) => option.label}
  renderInput={(params) => (
    <TextField
      {...params}
      // label="Subnet Mask"
      required
      className="myTextField"
    />
  )}
  disableClearable
  isOptionEqualToValue={(option, value) => option.value === value.value}
  sx={{
    '& .MuiAutocomplete-inputRoot': {
      padding: '8px 14px',
    },
    mt: 2 // Add margin if needed
  }}
/>
</div>




<div className='flex gap-x-[150px]
             rounded-lg p-2 hover:bg-gray-300
            dark:text-black dark:bg-transparent
            '> 
            <p className='dark:text-white'>Auto channel	</p>

            
    <FormControlLabel
      className="dark:text-white text-black mb-1"
      control={
        <Checkbox 
          checked={autochannel1}
            onChange={(e)=> setAutochannel1(e.target.checked)}

          color="default"
        />
      }
      label={<span className="font-medium">{autochannel1 ? 'Yes' : 'No'}</span>}
    />
</div>





<div className='flex flex-row justify-center items-center gap-x-[150px]
             rounded-lg p-2 hover:bg-gray-300
            dark:text-black dark:bg-transparent
            '> 
            <p className='dark:text-white'>CHANNEL </p>

           
              <Autocomplete
  fullWidth
  options={channelOptions1}
  value={channelOptions1.find(option => option.value === channel) || null}
  onChange={(event, newValue) => {
    if (newValue) {
      setChannel(newValue.value);
    }
  }}
  
  getOptionLabel={(option) => option.label}
  renderInput={(params) => (
    <TextField
      {...params}
      // label="Subnet Mask"
      required
      className="myTextField"
    />
  )}
  disableClearable
  isOptionEqualToValue={(option, value) => option.value === value.value}
  sx={{
    '& .MuiAutocomplete-inputRoot': {
      padding: '8px 14px',
    },
    mt: 2 // Add margin if needed
  }}
/>
</div>











<div className='flex flex-row justify-center items-center gap-x-[150px]
             rounded-lg p-2 hover:bg-gray-300
            dark:text-black dark:bg-transparent
            '> 
            <p className='dark:text-white'>Country Regulatory Domain </p>

  <Autocomplete
  fullWidth
  options={countryRegulatoryDomainOptions1}
  value={countryRegulatoryDomainOptions1.find(option => option.value === country_regulatory_domain1) || null}
  onChange={(event, newValue) => {
    if (newValue) {
      setCountryRegulatoryDomain1(newValue.value);
    }
  }}
  
  getOptionLabel={(option) => option.label}
  renderInput={(params) => (
    <TextField
      {...params}
      // label="Subnet Mask"
      required
      className="myTextField"
    />
  )}
  disableClearable
  isOptionEqualToValue={(option, value) => option.value === value.value}
  sx={{
    '& .MuiAutocomplete-inputRoot': {
      padding: '8px 14px',
    },
    mt: 2 // Add margin if needed
  }}
/>
         
</div>








<div className='flex flex-row justify-center items-center gap-x-[150px]
             rounded-lg p-2 hover:bg-gray-300
            dark:text-black dark:bg-transparent
            '> 
            <p className='dark:text-white'>TX Power </p>

            <TextField 
name='prefix'
onChange={handleChange}

className='myTextField'
  sx={{
    width: '100%',
    '& label.Mui-focused': {
      color: 'black',
      fontSize:'16px'
    },
    '& .MuiOutlinedInput-root': {
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "black",
        borderWidth: '3px'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      }
    },
  }}
value={prefix} fullWidth  />
</div>
<Tooltip title="Apply changes to wlan">
              <Button
                type="submit"
                sx={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  backgroundColor: "#ff6f61",
                  color: "white",
                  borderRadius: "25px",
                  "&:hover": {
                    backgroundColor: "#ff4a3d",
                  },
                }}
                component={motion.button}
              >
                  {loading ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        ''
                    )}
                    <span className="text-sm">
                        {loading ? 'Applying Changes' : 'Apply Changes'}
                    </span>
              </Button>
            </Tooltip>

</form>
            
          </AccordionDetails>
        </Accordion>
    </div>













<div className='mt-2'>
      <form onSubmit={handleCreateTicketSettings}>
        <Accordion
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
        >
          <AccordionSummary
            expandIcon={
              <ArrowDownwardIcon
                className="dark:text-white text-black"
                sx={{ transition: "transform 0.3s" }}
              />
            }
            aria-controls="panel1-content"
            id="panel1-header"
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: "10px",
              color: "black",
            }}
          >
            <Typography variant="h6">
              <motion.div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <motion.div
                  variants={iconVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <IoWifi
                   className='dark:text-white'
                  />
                </motion.div>
                <p className="dark:text-white text-black roboto-condensed">
                  Wireless LAN2
                </p>
              </motion.div>
            </Typography>
          </AccordionSummary>

          <AccordionDetails
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: "10px",
              marginTop: "10px",
              padding: "20px",
            }}
          >
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong className='roboto-condensed-light'>What does this setting do?</strong>
              <br />
              <p className='roboto-condensed'>Configure system-wide settings for support tickets, including
              notifications, priorities, and workflows. </p>
            </Typography>




<TextField  
name='prefix'
onChange={handleChange}
helperText={
    <p className='dark:text-white text-black text-lg md:w-full md:text-sm  
    text-wrap w-[140px] roboto-condensed'>Can be any letter example(FK, TQ, QM, M, A, B)</p>}
className='myTextField'
  sx={{
    width: '100%',
    mt:2,

    '& label.Mui-focused': {
      color: 'black',
      fontSize:'16px'
    },
    '& .MuiOutlinedInput-root': {
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "black",
        borderWidth: '3px'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      }
    },
  }}
value={prefix} fullWidth  label='Prefix'    />




<TextField 
name='minimum_digits'
value={minimum_digits}
onChange={handleChange}
className='myTextField'
type='number'
sx={{
    width: '100%',
    mt:2,

    '& label.Mui-focused': {
      color: 'black',
      fontSize:'16px'
    },
    '& .MuiOutlinedInput-root': {
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "black",
        borderWidth: '3px'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      }
    },
  }}
fullWidth
label='Minimum Digits'
helperText={
  <p className='dark:text-white text-black text-lg md:w-full md:text-sm 
   text-wrap w-[140px] roboto-condensed'> 
    Minimum Digits(Zeros will be added to the front of the prefix, eg SUB001 for
        three digits)
     </p>  
}
/>
            {/* Interactive Update Button */}
            <Tooltip title="Update ticket settings system-wide">
              <Button
                type="submit"
                sx={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  backgroundColor: "#ff6f61",
                  color: "white",
                  borderRadius: "25px",
                  "&:hover": {
                    backgroundColor: "#ff4a3d",
                  },
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                component={motion.button}
              >
                Update Settings
              </Button>
            </Tooltip>
          </AccordionDetails>
        </Accordion>
      </form>
    </div>

























<div className='mt-2'>
      <form onSubmit={handleCreateTicketSettings}>
        <Accordion
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
        >
          <AccordionSummary
            expandIcon={
              <ArrowDownwardIcon
                className="dark:text-white text-black"
                sx={{ transition: "transform 0.3s" }}
              />
            }
            aria-controls="panel1-content"
            id="panel1-header"
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: "10px",
              color: "black",
            }}
          >
            <Typography variant="h6">
              <motion.div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <motion.div
                  variants={iconVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <MdDeviceHub
                   className='dark:text-white'
                  />
                </motion.div>
                <p className="dark:text-white text-black roboto-condensed">
                  LAN Ports
                </p>
              </motion.div>
            </Typography>
          </AccordionSummary>

          <AccordionDetails
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: "10px",
              marginTop: "10px",
              padding: "20px",
            }}
          >
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong className='roboto-condensed-light'>What does this setting do?</strong>
              <br />
              <p className='roboto-condensed'>Configure system-wide settings for support tickets, including
              notifications, priorities, and workflows. </p>
            </Typography>




<TextField  
name='prefix'
onChange={handleChange}
helperText={
    <p className='dark:text-white text-black text-lg md:w-full md:text-sm  
    text-wrap w-[140px] roboto-condensed'>Can be any letter example(FK, TQ, QM, M, A, B)</p>}
className='myTextField'
  sx={{
    width: '100%',
    mt:2,

    '& label.Mui-focused': {
      color: 'black',
      fontSize:'16px'
    },
    '& .MuiOutlinedInput-root': {
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "black",
        borderWidth: '3px'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      }
    },
  }}
value={prefix} fullWidth  label='Prefix'    />




<TextField 
name='minimum_digits'
value={minimum_digits}
onChange={handleChange}
className='myTextField'
type='number'
sx={{
    width: '100%',
    mt:2,

    '& label.Mui-focused': {
      color: 'black',
      fontSize:'16px'
    },
    '& .MuiOutlinedInput-root': {
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "black",
        borderWidth: '3px'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      }
    },
  }}
fullWidth
label='Minimum Digits'
helperText={
  <p className='dark:text-white text-black text-lg md:w-full md:text-sm 
   text-wrap w-[140px] roboto-condensed'> 
    Minimum Digits(Zeros will be added to the front of the prefix, eg SUB001 for
        three digits)
     </p>  
}
/>
            {/* Interactive Update Button */}
            <Tooltip title="Update ticket settings system-wide">
              <Button
                type="submit"
                sx={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  backgroundColor: "#ff6f61",
                  color: "white",
                  borderRadius: "25px",
                  "&:hover": {
                    backgroundColor: "#ff4a3d",
                  },
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                component={motion.button}
              >
                Update Settings
              </Button>
            </Tooltip>
          </AccordionDetails>
        </Accordion>
      </form>
    </div>

    </>
  );
};

export default OnuDetails;