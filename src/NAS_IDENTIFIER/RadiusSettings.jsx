
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Tooltip from "@mui/material/Tooltip";
import { motion } from "framer-motion";
import styled from "styled-components";
import TextField from '@mui/material/TextField';
import {useState, useEffect, useCallback} from 'react'
import toast, { Toaster } from 'react-hot-toast';
import FreeRadiusLogo from "../../public/images/free_radius.svg";

import { IoGitNetwork } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import { 
  FaCopy, 
  FaServer, 
  FaKey, 
  FaUserAlt,
  FaNetworkWired,
  FaShieldAlt
} from 'react-icons/fa';
import {
  Button
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';


const RadiusSettings = () => {

// const navigate = useNavigate()
    const [radiusSettings, setRadiusSettings] = useState({
        shortname: '',
        ipaddr: '',
        secret: '',
      })


      const {shortname, ipaddr, secret} = radiusSettings
 const [mikrotikConfig, setMikrotikConfig] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [searchParams] = useSearchParams();

      const onChange = (e) => {
        const { type, name, checked, value } = e.target;
        setRadiusSettings((prevFormData) => ({
    ...prevFormData,
    [name]:  value,
  }));
      }

const ip = searchParams.get('ip_address')
const l = searchParams.get('l')


  const generateMikrotikConfig = () => {
    setIsGenerating(true);
    const config = `
/radius incoming seta accept=yes port=3799
/radius add service=ppp,hotspot \\
  address=${'10.2.0.1'} \\
  secret=${secret || l} \\
  protocol=udp
    `.trim();
    setMikrotikConfig(config);
    setTimeout(() => setIsGenerating(false), 800);
  };


  const copyToClipboard = () => {
    navigator.clipboard.writeText(mikrotikConfig);
    toast.success('Copied to clipboard!');
  };

    const iconVariants = {
        hover: {
          scale: 1.2,
          rotate: [0, 10, -10, 0], // Wiggle effect
          transition: { duration: 0.5 },
        },
        // tap: {
        //   scale: 0.9,
        // },
      };





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



const subdomain = window.location.hostname.split('.')[0]

const saveRadiusSettings = async(e) => {
    e.preventDefault()


    try {
        const response = await fetch('/api/radius_settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Subdomain': subdomain,

            },
            body: JSON.stringify(radiusSettings),  //
        })

        const newData = await response.json()



  if (response.status === 402) {
    setTimeout(() => {
      window.location.href = '/license-expired';
     }, 1800);
    
  }

        if (response.ok) {
            toast.success('radius settings saved successfully', {
                position: "top-center",
                duration: 5000,
            })
            setRadiusSettings({
                shortname: newData.shortname,
                ipaddr: newData.ipaddr,
                secret: newData.secret,
              
            })
        } else {
           toast.error('failed to save radius settings', {
                position: "top-center",
                duration: 4000,
            })
        }
    } catch (error) {
        toast.error('failed to save radius settings server error', {
            position: "top-center",
            duration: 4000,
        })
    }
}


const getRadiusSettings = useCallback(
  async() => {
   
    
    try {
        const response = await fetch('/api/radius_settings', {
            method: 'GET',

            headers: {
                'X-Subdomain': subdomain,
            },
        })

        const newData = await response.json()
        if (response.ok) {
            setRadiusSettings({
                shortname: newData[0].shortname,
                ipaddr: newData[0].ipaddr,
                secret: newData[0].secret,
              
            })
        } else {

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
            toast.error('failed to fetch radius settings', {
                    position: "top-center",
                    duration: 4000,
            })
        }
    } catch (error) {
        console.log(error)
    }
  },
  [],
)


useEffect(() => {
    
    getRadiusSettings()
}, [getRadiusSettings]);

  return (
     <div className="max-w-4xl mx-auto p-4">
      <Toaster />
      <form onSubmit={saveRadiusSettings}>
        <Accordion defaultExpanded sx={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.03)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px !important',
          overflow: 'hidden',
          mb: 3
        }}>
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon className="text-gray-600 dark:text-white" />}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' }
            }}
          >
            <div className="flex items-center gap-3">
              <img src={FreeRadiusLogo} className="w-10 h-10" alt="FreeRADIUS" />
              <Typography variant="h6" className="font-bold text-gray-800 dark:text-white">
                RADIUS Server Configuration
              </Typography>
            </div>
          </AccordionSummary>

          <AccordionDetails sx={{ pt: 3 }}>
            <Typography paragraph className="mb-6 text-gray-700 dark:text-white ">
              Configure your RADIUS server settings for MikroTik authentication. 
              These settings will be used for PPP and Hotspot services.
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                name="shortname"
                 className='myTextField'
                value={shortname || 'admin'}
                onChange={onChange}
                label="RADIUS Username"
                variant="outlined"
                fullWidth
                InputProps={{
                  startAdornment: <FaUserAlt className="mr-3 text-gray-500" />
                }}
                helperText="Optional display name"
                sx={{ mb: 2 }}
              />

              <TextField
                name="ipaddr"
                 className='myTextField'
                value={ipaddr || ip}
                onChange={onChange}
                label="IP Address"
                variant="outlined"
                fullWidth
                InputProps={{
                  startAdornment: <FaNetworkWired className="mr-3 text-gray-500" />
                }}
                sx={{ mb: 2 }}
              />

              <TextField
              className='myTextField'
                name="secret"
                value={secret || l}
                onChange={onChange}
                label="Shared Secret"
                variant="outlined"
                fullWidth
                type="password"
                InputProps={{
                  startAdornment: <FaKey className="mr-3 text-gray-500" />
                }}
                sx={{ mb: 2 }}
              />
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<FaShieldAlt />}
                sx={{
                  borderRadius: '8px',
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                Save Settings
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                size="large"
                startIcon={<FaServer />}
                onClick={generateMikrotikConfig}
                disabled={isGenerating}
                sx={{
                  borderRadius: '8px',
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                {isGenerating ? 'Generating...' : 'Generate MikroTik Config'}
              </Button>
            </div>
          </AccordionDetails>
        </Accordion>
      </form>

      {mikrotikConfig && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <div className="p-4 bg-gray-100 dark:bg-gray-700 flex justify-between items-center">
            <Typography variant="h6" className="font-bold flex items-center gap-2">
              <FaNetworkWired className="text-blue-500" />
              MikroTik Configuration
            </Typography>
            <Tooltip title="Copy to clipboard">
              <Button 
                variant="text" 
                startIcon={<FaCopy />}
                onClick={copyToClipboard}
                size="small"
              >
                Copy
              </Button>
            </Tooltip>
          </div>

          <div className="p-4 bg-gray-900 overflow-x-auto">
            <pre className="text-green-400 font-mono text-sm">
              {mikrotikConfig.split('\n').map((line, i) => (
                <div key={i} className="flex">
                  <span className="text-gray-500 select-none mr-4 w-6 text-right">{i + 1}</span>
                  <code>{line}</code>
                </div>
              ))}
            </pre>
          </div>

          <div className="p-3 bg-gray-100 dark:bg-gray-700 text-sm text-gray-600 dark:text-gray-300">
            <p>Copy these commands to your MikroTik router terminal</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default RadiusSettings