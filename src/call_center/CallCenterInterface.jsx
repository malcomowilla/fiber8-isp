import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@mui/styles';
import { 
  Box, Typography, Button, Card, CardContent, 
  Avatar, IconButton, Paper, Divider, Badge, CircularProgress
} from '@mui/material';
import {
  Call, CallEnd, Phone, PhoneDisabled,
  Mic, MicOff, Headset, VolumeUp,
  People, History, Settings, MoreVert
} from '@mui/icons-material';
import { green, red, orange, blue } from '@mui/material/colors';
import { SimpleUser } from 'sip.js/lib/platform/web';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f5f7fa',
  },
  sidebar: {
    width: 280,
    backgroundColor: '#2e3b4e',
    color: 'white',
    padding: theme.spacing(2),
  },
  mainContent: {
    flex: 1,
    padding: theme.spacing(3),
    overflowY: 'auto',
  },
  callCard: {
    borderRadius: 12,
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    marginBottom: theme.spacing(3),
    background: 'linear-gradient(135deg, #f6f9fc 0%, #eef2f5 100%)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  statCard: {
    borderRadius: 12,
    padding: theme.spacing(2),
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
    },
  },
  activeCall: {
    borderLeft: `4px solid ${green[500]}`,
  },
  incomingCall: {
    borderLeft: `4px solid ${orange[500]}`,
    animation: '$pulse 2s infinite',
  },
  callButton: {
    borderRadius: '50%',
    width: 56,
    height: 56,
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    margin: theme.spacing(0, 1),
  },
  avatarLarge: {
    width: 80,
    height: 80,
    margin: '0 auto',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  },
  '@keyframes pulse': {
    '0%': { boxShadow: '0 0 0 0 rgba(255, 152, 0, 0.7)' },
    '70%': { boxShadow: '0 0 0 10px rgba(255, 152, 0, 0)' },
    '100%': { boxShadow: '0 0 0 0 rgba(255, 152, 0, 0)' },
  },
}));

const CallCenterInterface = () => {
  const classes = useStyles();
  const [callStatus, setCallStatus] = useState('disconnected'); // disconnected, calling, ringing, connected
  const [muted, setMuted] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [callHistory, setCallHistory] = useState([]);
  const [callDuration, setCallDuration] = useState(0);
  const [callerInfo, setCallerInfo] = useState(null);
  const [simpleUser, setSimpleUser] = useState(null);
  const callTimer = useRef(null);
  const audioRef = useRef(null);

  // SIP Configuration - Replace with your actual credentials
  const sipConfig = {
    server: 'ws://127.0.0.1:8088/ws',
    username: '6001',
    password: '6001',
    domain: '127.0.0.1'
  };

  // Initialize SIP.js SimpleUser
  useEffect(() => {
    const initializeSip = async () => {
      const options = {
        aor: `sip:${sipConfig.username}@${sipConfig.domain}`,
        media: {
          constraints: { audio: true, video: false },
          remote: {
            audio: audioRef.current
          }
        },
        userAgentOptions: {
          authorizationUsername: sipConfig.username,
          authorizationPassword: sipConfig.password,
          displayName: 'Call Center Agent',
          uriTransport: 'wss',
        }
      };

      const user = new SimpleUser(sipConfig.server, options);
      
      user.delegate = {
        onCallReceived: async () => {
          setCallStatus('ringing');
          setCallerInfo({
            name: 'Incoming Caller',
            number: 'Unknown'
          });
          
          // Auto-answer after 3 seconds (optional)
          setTimeout(async () => {
            if (callStatus === 'ringing') {
              await user.answer();
              setCallStatus('connected');
              startCallTimer();
            }
          }, 3000);
        },
        onCallAnswered: () => {
          setCallStatus('connected');
          startCallTimer();
        },
        onCallHangup: () => {
          endCall();
        },
        onCallHold: () => {
          // Handle hold
        },
        onCallUnhold: () => {
          // Handle unhold
        }
      };

      try {
        await user.connect();
        await user.register();
        setSimpleUser(user);
      } catch (error) {
        console.error('SIP initialization failed:', error);
      }
    };

    initializeSip();

    return () => {
      if (simpleUser) {
        simpleUser.disconnect().catch(console.error);
      }
      if (callTimer.current) {
        clearInterval(callTimer.current);
      }
    };
  }, []);

  const startCallTimer = () => {
    const startTime = new Date();
    callTimer.current = setInterval(() => {
      const duration = Math.floor((new Date() - startTime) / 1000);
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      setCallDuration(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
  };

  const endCall = () => {
    if (callTimer.current) {
      clearInterval(callTimer.current);
      callTimer.current = null;
    }
    
    if (callStatus === 'connected' || callStatus === 'ringing') {
      setCallHistory([{
        id: Date.now(),
        name: callerInfo?.name || 'Outbound Call',
        number: callerInfo?.number || 'Unknown',
        time: new Date().toLocaleTimeString(),
        duration: callDuration,
        status: callStatus === 'ringing' ? 'missed' : 'completed'
      }, ...callHistory]);
    }
    
    setCallStatus('disconnected');
    setCallDuration(0);
    setCallerInfo(null);
  };

  const handleCall = async () => {
    if (callStatus === 'disconnected') {
      // Make outbound call
      setCallStatus('calling');
      setCallerInfo({
        name: 'James Wilson',
        number: '+1 (555) 987-6543'
      });
      
      try {
        await simpleUser.call(`sip:6001@${sipConfig.domain}`);
        setCallStatus('ringing');
      } catch (error) {
        console.error('Call failed:', error);
        setCallStatus('disconnected');
      }
    } else {
      // End current call
      try {
        await simpleUser.hangup();
      } catch (error) {
        console.error('Hangup failed:', error);
      } finally {
        endCall();
      }
    }
  };

  const toggleMute = async () => {
    if (simpleUser) {
      try {
        await simpleUser.toggleMute();
        setMuted(!muted);
      } catch (error) {
        console.error('Mute toggle failed:', error);
      }
    }
  };

  const answerCall = async () => {
    if (simpleUser && callStatus === 'ringing') {
      try {
        await simpleUser.answer();
        setCallStatus('connected');
        startCallTimer();
      } catch (error) {
        console.error('Answer failed:', error);
        setCallStatus('disconnected');
      }
    }
  };

  const rejectCall = async () => {
    if (simpleUser && callStatus === 'ringing') {
      try {
        await simpleUser.hangup();
      } catch (error) {
        console.error('Reject failed:', error);
      } finally {
        endCall();
      }
    }
  };

  // Mock data
  const stats = [
    { title: 'Total Calls', value: '1,248', change: '+12%', icon: <Phone />, color: blue[500] },
    { title: 'Active Calls', value: '5', change: '+2', icon: <Call />, color: green[500] },
    { title: 'Missed Calls', value: '23', change: '-5%', icon: <PhoneDisabled />, color: red[500] },
    { title: 'Avg. Duration', value: '4:32', change: '+0:12', icon: <History />, color: orange[500] },
  ];

  const recentCalls = [
    { id: 1, name: 'John Smith', number: '+1 (555) 123-4567', time: '10:23 AM', duration: '4:32', status: 'completed' },
    { id: 2, name: 'Acme Corp', number: '+1 (555) 987-6543', time: '9:45 AM', duration: '2:15', status: 'completed' },
    { id: 3, name: 'Unknown', number: '+1 (555) 234-5678', time: '9:30 AM', duration: '0:00', status: 'missed' },
    { id: 4, name: 'Sarah Johnson', number: '+1 (555) 345-6789', time: 'Yesterday', duration: '7:21', status: 'completed' },
    ...callHistory
  ];

  return (
    <div className={classes.root}>
      {/* Hidden audio element for WebRTC */}
      <audio ref={audioRef} autoPlay  />
      
      {/* Sidebar */}
      <div className={classes.sidebar}>
        <Box display="flex" flexDirection="column" height="100%">
          <Box mb={4} textAlign="center">
            <Typography variant="h6" style={{ fontWeight: 600 }}>Call Center</Typography>
          </Box>
          
          <Box flex={1}>
            <Button 
              fullWidth 
              startIcon={<Headset />}
              style={{ 
                backgroundColor: activeTab === 'dashboard' ? 'rgba(255,255,255,0.1)' : 'transparent',
                justifyContent: 'flex-start',
                marginBottom: 8
              }}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </Button>
            <Button 
              fullWidth 
              startIcon={<People />}
              style={{ 
                backgroundColor: activeTab === 'contacts' ? 'rgba(255,255,255,0.1)' : 'transparent',
                justifyContent: 'flex-start',
                marginBottom: 8
              }}
              onClick={() => setActiveTab('contacts')}
            >
              Contacts
            </Button>
            <Button 
              fullWidth 
              startIcon={<History />}
              style={{ 
                backgroundColor: activeTab === 'history' ? 'rgba(255,255,255,0.1)' : 'transparent',
                justifyContent: 'flex-start',
                marginBottom: 8
              }}
              onClick={() => setActiveTab('history')}
            >
              Call History
            </Button>
            <Button 
              fullWidth 
              startIcon={<Settings />}
              style={{ 
                backgroundColor: activeTab === 'settings' ? 'rgba(255,255,255,0.1)' : 'transparent',
                justifyContent: 'flex-start',
                marginBottom: 8
              }}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </Button>
          </Box>
          
          <Box textAlign="center" py={2}>
            <Avatar 
              alt="User Profile" 
              src="/profile.jpg" 
              style={{ width: 60, height: 60, margin: '0 auto 8px' }}
            />
            <Typography variant="subtitle1">Agent Smith</Typography>
            <Typography variant="caption" style={{ color: simpleUser ? green[500] : red[500] }}>
              {simpleUser ? 'Online' : 'Offline'}
            </Typography>
          </Box>
        </Box>
      </div>
      
      {/* Main Content */}
      <div className={classes.mainContent}>
        <Typography variant="h5" gutterBottom style={{ fontWeight: 600 }}>Call Dashboard</Typography>
        
        {/* Stats Cards */}
        <div className={classes.statsGrid}>
          {stats.map((stat, index) => (
            <Card key={index} className={classes.statCard} style={{ borderLeft: `4px solid ${stat.color}` }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">{stat.title}</Typography>
                    <Typography variant="h5" style={{ fontWeight: 600 }}>{stat.value}</Typography>
                    <Typography variant="caption" style={{ color: stat.change.startsWith('+') ? green[500] : red[500] }}>
                      {stat.change} from yesterday
                    </Typography>
                  </div>
                  <Avatar style={{ backgroundColor: stat.color, color: 'white' }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Call Control Card */}
        <Card className={`${classes.callCard} ${
          callStatus === 'connected' ? classes.activeCall : 
          callStatus === 'ringing' ? classes.incomingCall : ''
        }`}>
          <CardContent>
            <Box textAlign="center" py={2}>
              <Avatar 
                alt="Caller" 
                src="/customer.jpg" 
                className={classes.avatarLarge}
              />
              <Typography variant="h6" style={{ marginTop: 16, fontWeight: 600 }}>
                {callStatus === 'disconnected' ? 'No Active Call' : callerInfo?.name || 'Caller'}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {callStatus === 'disconnected' ? 'Ready to make calls' : 
                 callStatus === 'calling' ? 'Calling...' : 
                 callStatus === 'ringing' ? 'Incoming Call' : 
                 `${callerInfo?.number || 'Unknown'} • ${callDuration}`}
              </Typography>
              
              <Box display="flex" justifyContent="center" mt={4} mb={2}>
                {callStatus === 'ringing' ? (
                  <>
                    <IconButton 
                      className={classes.callButton} 
                      style={{ backgroundColor: green[500], color: 'white' }}
                      onClick={answerCall}
                    >
                      <Call />
                    </IconButton>
                    <IconButton 
                      className={classes.callButton} 
                      style={{ backgroundColor: red[500], color: 'white' }}
                      onClick={rejectCall}
                    >
                      <CallEnd />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton 
                      className={classes.callButton} 
                      style={{ 
                        backgroundColor: callStatus === 'connected' ? red[500] : green[500], 
                        color: 'white' 
                      }}
                      onClick={handleCall}
                      disabled={!simpleUser}
                    >
                      {callStatus === 'disconnected' ? <Call /> : <CallEnd />}
                    </IconButton>
                    
                    {callStatus === 'connected' && (
                      <IconButton 
                        className={classes.callButton} 
                        style={{ backgroundColor: muted ? orange[500] : '#eee', color: muted ? 'white' : '#333' }}
                        onClick={toggleMute}
                      >
                        {muted ? <MicOff /> : <Mic />}
                      </IconButton>
                    )}
                  </>
                )}
              </Box>
              
              {callStatus === 'connected' && (
                <Box display="flex" justifyContent="center">
                  <IconButton>
                    <VolumeUp />
                  </IconButton>
                  <IconButton>
                    <People />
                  </IconButton>
                  <IconButton>
                    <MoreVert />
                  </IconButton>
                </Box>
              )}
              
              {callStatus === 'calling' && (
                <Box display="flex" justifyContent="center" mt={2}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
        
        {/* Recent Calls */}
        <Typography variant="h6" style={{ marginTop: 24, fontWeight: 600 }}>Recent Calls</Typography>
        <Paper elevation={0} style={{ borderRadius: 12, overflow: 'hidden' }}>
          {recentCalls.map((call) => (
            <Box key={call.id}>
              <Box display="flex" alignItems="center" p={2} style={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <Avatar style={{ marginRight: 16 }}>
                  {call.status === 'missed' ? <PhoneDisabled color="error" /> : <Phone color="primary" />}
                </Avatar>
                <Box flex={1}>
                  <Typography style={{ fontWeight: 600 }}>{call.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{call.number}</Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="body2">{call.time}</Typography>
                  <Typography variant="body2" color="textSecondary">{call.duration}</Typography>
                </Box>
              </Box>
              <Divider />
            </Box>
          ))}
        </Paper>
      </div>
    </div>
  );
};

export default CallCenterInterface;