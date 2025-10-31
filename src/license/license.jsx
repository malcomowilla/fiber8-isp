import React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  Divider,
  useTheme
} from '@mui/material'
import { 
  CheckCircle, 
  Business, 
  Category, 
  Person, 
  CalendarToday,
  Security
} from '@mui/icons-material'
import UiLoader from '../uiloader/UiLoader'
import { Suspense } from "react"
import {useApplicationSettings} from '../settings/ApplicationSettings'






const License = () => {
  const theme = useTheme()
  const [licenseData, setLicenseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const subdomain = window.location.hostname.split('.')[0]
  const [licenseTypepppoe, setLicenseTypepppoe] = useState('NA')
  const [licenseTypeHotspot, setLicenseTypeHotspot] = useState('NA')
  const [expiryHotspot, setExpiryHotspot] = useState('NA')
  const [expiryPppoe, setExpiryPppoe] = useState('NA')
const [hotspotPLanName, setHotspotPLanName] = useState('NA')
const [pppoePLanName, setPppoePLanName] = useState('NA')
const [hotspotStatus, setHotspotStatus] = useState('NA')
const [pppoeStatus, setPppoeStatus] = useState('NA')
    const {companySettings, setCompanySettings,} = useApplicationSettings()



const { contact_info, company_name, email_info, logo_preview} = companySettings



const handleGetCompanySettings = useCallback(
   async() => {
     try {
       const response = await fetch('/api/allow_get_company_settings', {
         method: 'GET',
         headers: {
           'X-Subdomain': subdomain,
         },
       })
       const newData = await response.json()
       if (response.ok) {
         // setcompanySettings(newData)
         const { contact_info, company_name, email_info, logo_url,
           customer_support_phone_number,agent_email ,customer_support_email
          } = newData
         setCompanySettings((prevData)=> ({...prevData, 
           contact_info, company_name, email_info,
           customer_support_phone_number,agent_email ,customer_support_email,
         
           logo_preview: logo_url
         }))
 
         console.log('company settings fetched', newData)
       }else{
         console.log('failed to fetch company settings')
       }
     } catch (error) {
      //  toast.error('internal servere error  while fetching company settings')
     
     }
   },
   [subdomain],
 )
 
 useEffect(() => {
   
   handleGetCompanySettings()
   
 }, [handleGetCompanySettings])












  const getCurrentHotspotPlan = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/get_current_hotspot_plan', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
      const newData = await response.json()
      if (response.ok && newData.length > 0) {
        setLicenseData(newData[0])
        setLicenseTypeHotspot(newData[0].hotspot_subscribers)
        setExpiryHotspot(newData[0].expiry)
        setHotspotPLanName(newData[0].name)
        setHotspotStatus(newData[0].status)
        
      }
    } catch (error) {
      console.error('Error fetching hotspot plan:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const getCurrentPPOEPlan = useCallback(async () => {
    try {
      const response = await fetch('/api/get_current_pppoe_plan', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
      const newData = await response.json()
      if (response.ok && newData.length > 0) {
        setLicenseData(newData[0])
        setLicenseTypepppoe(newData[0].maximum_pppoe_subscribers)
        setExpiryPppoe(newData[0].expiry)
        setPppoePLanName(newData[0].name)
        setPppoeStatus(newData[0].status)
      }
    } catch (error) {
      console.error('Error fetching PPPoE plan:', error)
    }
  }, [])

  useEffect(() => {
    getCurrentHotspotPlan()
    getCurrentPPOEPlan()
  }, [getCurrentHotspotPlan, getCurrentPPOEPlan])

  if (loading) {
    return <UiLoader />
  }

  if (!licenseData) {
    return (
      <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
        <CardContent>
          <Typography variant="h6" color="textSecondary" align="center">
            No license information found
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Box sx={{ p: 3, maxWidth: 600, margin: 'auto' }}>
      <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {/* Status Header */}
        <Box 
          sx={{ 
            p: 2, 
            backgroundColor: hotspotStatus === 'active' ? 'success.main' : 'error.main',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <CheckCircle />
          <Typography variant="h6" fontWeight="bold">
                        {hotspotStatus === 'active' ? '  Activated - License is up to date' : ' - Inactive- License is out of date'}

          </Typography>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* License Details Grid */}
          <Box display="grid" gap={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="textSecondary">Product:</Typography>
              <Typography variant="body1" fontWeight="bold">Hotspot</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="textSecondary">License Type:</Typography>
              <Typography variant="body1" fontWeight="bold">
                {licenseTypeHotspot} Users license
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="textSecondary">Registered to:</Typography>
              <Typography variant="body1" fontWeight="bold">{company_name}</Typography>
            </Box>


 <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="textSecondary">Name:</Typography>
              <Typography variant="body1" fontWeight="bold">{hotspotPLanName}</Typography>
            </Box>

            <Divider />



            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="textSecondary">Expiry:</Typography>
              <Typography 
                variant="body1" 
                fontWeight="bold" 
                color={hotspotStatus === 'active' ? 'success.main' : 'warning.main'}
              >
                {expiryHotspot}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>















     <Box sx={{ p: 3, maxWidth: 600, margin: 'auto' }}>
      <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {/* Status Header */}
        <Box 
          sx={{ 
            p: 2, 
             backgroundColor: pppoeStatus === 'active' ? 'success.main' : 'error.main',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <CheckCircle />
          <Typography variant="h6" fontWeight="bold">
           
            {pppoeStatus === 'active' ? '  Activated - License is up to date' : ' - Inactive- License is out of date'}
          </Typography>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* License Details Grid */}
          <Box display="grid" gap={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="textSecondary">Product:</Typography>
              <Typography variant="body1" fontWeight="bold">PPPoE</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="textSecondary">License Type:</Typography>
              <Typography variant="body1" fontWeight="bold">
                {licenseTypepppoe} Users license
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="textSecondary">Registered to:</Typography>
              <Typography variant="body1" fontWeight="bold">{company_name}</Typography>
            </Box>







             <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="textSecondary">Name:</Typography>
              <Typography variant="body1" fontWeight="bold">{pppoePLanName}</Typography>
            </Box>

                        <Divider />

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="textSecondary">Expiry:</Typography>
              <Typography 
                variant="body1" 
                fontWeight="bold" 
                color={pppoeStatus === 'active' ? 'success.main' : 'warning.main'}
              >
                {expiryPppoe}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>

    </>
  )
}

export default License