import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loadUser, logout } from '../store/slices/authSlice';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Avatar, 
  Divider, 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip, 
  Stack, 
  LinearProgress,
  CircularProgress,
  alpha
} from '@mui/material';
import { 
  WaterDrop as WaterDropIcon,
  WbSunny as WeatherIcon,
  Opacity as OpacityIcon,
  MoreVert as MoreVertIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CalendarToday as CalendarIcon,
  AccessTime as AccessTimeIcon,
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon,
  PowerSettingsNew as PowerIcon,
  Wifi as WifiIcon,
  Battery90 as BatteryIcon,
  Park as GardenIcon,
  Grass as GrassIcon,
  LocalFlorist as FlowerIcon,
  Spa as SpaIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  Thermostat as ThermostatIcon
} from '@mui/icons-material';

// Sample data for irrigation system
const stats = [
  { 
    title: 'Total Zones', 
    value: '4', 
    change: '+2', 
    isPositive: true,
    icon: <GrassIcon />,
    color: 'success',
    trend: 'up',
    timeFrame: 'this month',
    path: '/dashboard/zones'
  },
  { 
    title: 'Water Level', 
    value: '78%', 
    change: '-5%', 
    isPositive: false,
    icon: <WaterDropIcon />,
    color: 'info',
    trend: 'down',
    timeFrame: 'today',
    path: '/dashboard/water'
  },
  { 
    title: 'Temperature', 
    value: '24°C', 
    change: '+2°', 
    isPositive: true,
    icon: <ThermostatIcon />,
    color: 'warning',
    trend: 'up',
    timeFrame: 'today',
    path: '/dashboard/weather'
  },
  { 
    title: 'Weather', 
    value: 'Sunny', 
    change: 'Clear', 
    isPositive: true,
    icon: <WeatherIcon />,
    color: 'secondary',
    trend: 'stable',
    timeFrame: 'now',
    path: '/dashboard/weather'
  },
];

const irrigationZones = [
  { 
    id: 1, 
    name: 'Main Field', 
    status: 'active', 
    lastWatered: '2 hours ago', 
    nextSchedule: 'In 4 hours',
    moisture: 65,
    progressColor: 'success',
    type: 'vegetable'
  },
  { 
    id: 2, 
    name: 'Greenhouse A', 
    status: 'active', 
    lastWatered: '1 hour ago', 
    nextSchedule: 'In 2 hours',
    moisture: 72,
    progressColor: 'success',
    type: 'flower'
  },
  { 
    id: 3, 
    name: 'Orchard', 
    status: 'inactive', 
    lastWatered: '5 hours ago', 
    nextSchedule: 'Tomorrow',
    moisture: 42,
    progressColor: 'warning',
    type: 'herb'
  },
  { 
    id: 4, 
    name: 'Garden Beds', 
    status: 'error', 
    lastWatered: '1 day ago', 
    nextSchedule: 'Pending',
    moisture: 28,
    progressColor: 'error',
    type: 'grass'
  },
];

const systemAlerts = [
  { 
    id: 1, 
    type: 'warning', 
    message: 'Low water pressure detected in Main Field', 
    time: '10 min ago',
    icon: <WarningIcon color="warning" />
  },
  { 
    id: 2, 
    type: 'error', 
    message: 'Pump 3 requires maintenance', 
    time: '1 hour ago',
    icon: <ErrorIcon color="error" />
  },
  { 
    id: 3, 
    type: 'info', 
    message: 'System update available', 
    time: '3 hours ago',
    icon: <InfoIcon color="info" />
  },
];

const StatusChip = ({ status }) => {
  const statusMap = {
    active: { 
      label: 'Active', 
      color: 'success', 
      icon: <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} /> 
    },
    inactive: { 
      label: 'Inactive', 
      color: 'default', 
      icon: <InfoIcon fontSize="small" sx={{ mr: 0.5 }} /> 
    },
    error: { 
      label: 'Error', 
      color: 'error', 
      icon: <ErrorIcon fontSize="small" sx={{ mr: 0.5 }} /> 
    },
  };

  const statusInfo = statusMap[status] || statusMap.inactive;

  return (
    <Chip
      icon={statusInfo.icon}
      label={statusInfo.label}
      color={statusInfo.color}
      size="small"
      variant="outlined"
      sx={{ 
        '& .MuiChip-icon': { 
          color: `${statusInfo.color}.main`,
        },
      }}
    />
  );
};

const StatCard = ({ title, value, unit, change, isPositive, icon, color, trend, timeFrame }) => {
  const TrendIcon = trend === 'up' ? ArrowUpwardIcon : ArrowDownwardIcon;
  
  return (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        '&:hover': {
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease',
        },
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography color="text.secondary" variant="subtitle2" sx={{ mb: 0.5 }}>
              {title}
            </Typography>
            <Box display="flex" alignItems="baseline">
              <Typography variant="h4" sx={{ fontWeight: 600, mr: 0.5 }}>
                {value}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {unit}
              </Typography>
            </Box>
          </Box>
          <Avatar 
            sx={{ 
              bgcolor: `${color}.light`, 
              color: `${color}.dark`,
              width: 44,
              height: 44,
            }}
          >
            {React.cloneElement(icon, { fontSize: 'medium' })}
          </Avatar>
        </Box>
        
        <Box display="flex" alignItems="center" mt={2}>
          <Box 
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: isPositive ? 'success.main' : 'error.main',
              mr: 2,
            }}
          >
            <TrendIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2" fontWeight={500}>
              {change}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {timeFrame}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const DashboardPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get auth state
  const { user: memoizedUserData, isAuthenticated, loading } = useSelector(
    (state) => ({
      user: state.auth.user,
      isAuthenticated: state.auth.isAuthenticated,
      loading: state.auth.loading
    }),
    shallowEqual
  );
  
  // Track if we've checked auth
  const [authChecked, setAuthChecked] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [zones, setZones] = useState([
    { id: 1, name: 'Main Field', type: 'vegetable', status: 'active', lastWatered: '2h ago', nextSchedule: 'In 4h', moisture: 65 },
    { id: 2, name: 'Flower Garden', type: 'flower', status: 'active', lastWatered: '1h ago', nextSchedule: 'Tomorrow', moisture: 72 },
    { id: 3, name: 'Herb Garden', type: 'herb', status: 'inactive', lastWatered: '5h ago', nextSchedule: 'Tomorrow', moisture: 58 },
    { id: 4, name: 'Lawn', type: 'grass', status: 'error', lastWatered: '1d ago', nextSchedule: 'Pending', moisture: 42 },
  ]);
  
  const [systemStatus] = useState({
    online: true,
    lastUpdate: 'Just now',
    battery: 78,
    connection: 'excellent',
  });

  const handleMenuOpen = (event, zone) => {
    setAnchorEl(event.currentTarget);
    setSelectedZone(zone);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedZone(null);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = useCallback(() => {
    setProfileAnchorEl(null);
  }, []);

  const navigateToProfile = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (profileAnchorEl) {
      handleProfileMenuClose();
      // Small timeout to allow menu to close before navigation
      setTimeout(() => {
        navigate('/profile');
      }, 200);
    } else {
      navigate('/profile');
    }
  }, [navigate, handleProfileMenuClose, profileAnchorEl]);

  const handleLogout = useCallback(() => {
    handleProfileMenuClose();
    dispatch(logout())
      .unwrap()
      .then(() => {
        navigate('/login', { replace: true });
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  }, [dispatch, navigate, handleProfileMenuClose]);

  const handleAction = (action) => {
    console.log(`${action} ${selectedZone?.name}`);
    handleMenuClose();
  };

  const getZoneIcon = (type) => {
    switch(type) {
      case 'vegetable': return <GardenIcon color="primary" />;
      case 'flower': return <FlowerIcon color="secondary" />;
      case 'grass': return <GrassIcon color="success" />;
      case 'herb': return <SpaIcon color="info" />;
      default: return <GardenIcon />;
    }
  };

  const toggleZoneStatus = (zoneId) => {
    setZones(zones.map(zone => 
      zone.id === zoneId 
        ? { ...zone, status: zone.status === 'active' ? 'inactive' : 'active' } 
        : zone
    ));
  };

  const toggleAllZones = (activate) => {
    setZones(zones.map(zone => ({
      ...zone,
      status: activate ? 'active' : 'inactive'
    })));
  };

  // Handle authentication state
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await dispatch(loadUser()).unwrap();
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setAuthChecked(true);
      }
    };

    if (!isAuthenticated && !authChecked) {
      checkAuth();
    }
  }, [dispatch, isAuthenticated, authChecked]);

  // Show loading state while checking auth
  if (loading || (!isAuthenticated && !authChecked)) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated && authChecked) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', p: 3 }}>
        {/* Top Bar */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {t('welcome', { name: memoizedUserData?.name?.split(' ')[0] || 'User' })}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('dashboard.description')}
            </Typography>
          </Box>
        
        {/* Profile and Notifications */}
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!profileAnchorEl) {
                setProfileAnchorEl(e.currentTarget);
              } else {
                handleProfileMenuClose();
              }
            }}
            sx={{ 
              p: 0,
              '&:hover': {
                '& .MuiAvatar-root': {
                  boxShadow: 2,
                  transform: 'scale(1.05)'
                }
              }
            }}
          >
            <Avatar
              src={memoizedUserData?.avatar || ''}
              alt={memoizedUserData?.name || 'User'}
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'primary.main',
                '&:hover': { opacity: 0.9 }
              }}
            >
              {memoizedUserData?.name ? memoizedUserData.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={profileAnchorEl}
            open={Boolean(profileAnchorEl)}
            onClose={handleProfileMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {memoizedUserData?.name || 'User'}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {memoizedUserData?.email || ''}
              </Typography>
            </Box>
            <MenuItem onClick={navigateToProfile}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t('common.profile')}</ListItemText>
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <PowerIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText sx={{ color: 'error.main' }}>
                {t('common.logout')}
              </ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Box 
              onClick={() => navigate(stat.path || '/dashboard')}
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.2s ease-in-out',
                }
              }}
            >
              <StatCard {...stat} />
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* System Status Overview */}
      <Box id="devices" sx={{ pt: 6 }}>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Box display="flex" alignItems="center" mb={2} onClick={() => navigate('/profile')} sx={{ cursor: 'pointer' }}>
                <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                  <PersonIcon color="primary" />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>{memoizedUserData?.name || 'User'}</Typography>
                  <Typography variant="body2" color="text.secondary">{memoizedUserData?.email || ''}</Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>System Status</Typography>
                <Box display="flex" alignItems="center" mb={1}>
                  <WifiIcon color={systemStatus.online ? 'success' : 'disabled'} sx={{ mr: 1 }} />
                  <Typography variant="body2">Connection: <strong>{systemStatus.connection}</strong></Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <BatteryIcon color={systemStatus.battery > 20 ? 'success' : 'error'} sx={{ mr: 1 }} />
                  <Typography variant="body2">Battery: <strong>{systemStatus.battery}%</strong></Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="caption" color="text.secondary">Last update: {systemStatus.lastUpdate}</Typography>
                </Box>
              </Box>
            </Box>
            
            <Button 
              variant="outlined" 
              color="primary" 
              size="small" 
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate('/dashboard/system-status')}
            >
              View System Status
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Irrigation Zones
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {zones.filter(z => z.status === 'active').length} of {zones.length} zones active
                </Typography>
              </Box>
              <Box display="flex" gap={1}>
                <Button 
                  variant="outlined" 
                  color="primary"
                  size="small"
                  startIcon={<PowerIcon />}
                  onClick={() => toggleAllZones(true)}
                  sx={{ textTransform: 'none' }}
                >
                  All On
                </Button>
                <Button 
                  variant="outlined" 
                  color="error"
                  size="small"
                  startIcon={<PowerIcon />}
                  onClick={() => toggleAllZones(false)}
                  sx={{ textTransform: 'none' }}
                >
                  All Off
                </Button>
              </Box>
            </Box>
            
            <Grid container spacing={2}>
              {zones.map((zone) => (
                <Grid item xs={12} sm={6} key={zone.id}>
                  <Card 
                    variant="outlined"
                    sx={{
                      p: 2,
                      height: '100%',
                      borderColor: zone.status === 'error' ? 'error.main' : 'divider',
                      borderWidth: zone.status === 'error' ? 1 : 1,
                      '&:hover': {
                        boxShadow: '0 8px 16px 0 rgba(0,0,0,0.05)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.3s ease',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Box display="flex" alignItems="center">
                        <Avatar 
                          sx={{ 
                            bgcolor: zone.status === 'active' ? 'success.light' : 'grey.200',
                            color: zone.status === 'active' ? 'success.dark' : 'grey.500',
                            width: 40, 
                            height: 40,
                            mr: 1.5
                          }}
                        >
                          {getZoneIcon(zone.type)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {zone.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {zone.type.charAt(0).toUpperCase() + zone.type.slice(1)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <IconButton 
                        size="small" 
                        onClick={() => toggleZoneStatus(zone.id)}
                        sx={{
                          color: zone.status === 'active' ? 'success.main' : 'grey.500',
                          '&:hover': {
                            bgcolor: zone.status === 'active' ? 'rgba(46, 125, 50, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                          }
                        }}
                      >
                        {zone.status === 'active' ? <ToggleOnIcon fontSize="large" /> : <ToggleOffIcon fontSize="large" />}
                      </IconButton>
                    </Box>
                    
                    <Divider sx={{ my: 1.5 }} />
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Box display="flex" alignItems="center" mb={1}>
                          <OpacityIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            Last watered: <strong>{zone.lastWatered}</strong>
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                          <CalendarIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            Next: <strong>{zone.nextSchedule}</strong>
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box textAlign="right">
                        <Typography variant="h6" color={zone.moisture < 30 ? 'error' : zone.moisture < 60 ? 'warning' : 'success'}>
                          {zone.moisture}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Moisture
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Alerts Section */}
      <Box id="alerts" sx={{ pt: 6, px: 3 }}>
        <Grid container spacing={3}>
          {/* System Alerts */}
          <Grid item xs={12} lg={8}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight={600}>
                  System Alerts
                </Typography>
                <Button 
                  color="primary" 
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={() => console.log('Refresh alerts')}
                >
                  Refresh
                </Button>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Alert</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell align="right">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {systemAlerts.map((alert) => (
                      <TableRow 
                        key={alert.id}
                        hover
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            {alert.icon}
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              {alert.message}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {alert.time}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={alert.type.toUpperCase()}
                            size="small"
                            color={
                              alert.type === 'error' ? 'error' : 
                              alert.type === 'warning' ? 'warning' : 'info'
                            }
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Button 
                fullWidth 
                variant="outlined" 
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => console.log('View all alerts')}
              >
                View All Alerts
              </Button>
            </Paper>
          </Grid>
          
          {/* Quick Actions */}
          <Grid item xs={12} lg={4}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" fontWeight={600} mb={3}>
                Quick Actions
              </Typography>
              
              <Stack spacing={2}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  startIcon={<WaterDropIcon />}
                  onClick={() => navigate('/dashboard/irrigation')}
                >
                  Manual Watering
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="primary" 
                  fullWidth
                  startIcon={<CalendarIcon />}
                  onClick={() => navigate('/dashboard/schedule')}
                >
                  Manage Schedules
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="primary" 
                  fullWidth
                  startIcon={<SettingsIcon />}
                  onClick={() => navigate('/dashboard/settings')}
                >
                  System Settings
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      {/* Irrigation Zones Table */}
      <Box id="irrigation" sx={{ pt: 6, pb: 4 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight={600}>
              Irrigation Zones
            </Typography>
            <Button 
              color="primary" 
              size="small"
              startIcon={<RefreshIcon />}
              onClick={() => console.log('Refresh zones')}
            >
              Refresh
            </Button>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Zone Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Moisture</TableCell>
                  <TableCell>Last Watered</TableCell>
                  <TableCell>Next Schedule</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {irrigationZones.map((zone) => (
                  <TableRow 
                    key={zone.id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Typography fontWeight={500}>{zone.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={zone.status} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 2 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={zone.moisture} 
                            color={zone.progressColor}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {zone.moisture}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">
                          {zone.lastWatered}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <CalendarIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">
                          {zone.nextSchedule}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleMenuOpen(e, zone)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={() => handleAction('Water now')}>
                <ListItemIcon>
                  <WaterDropIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Water Now</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleAction('Schedule')}>
                <ListItemIcon>
                  <CalendarIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Schedule</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => handleAction('View details')}>
                <ListItemText inset>View Details</ListItemText>
              </MenuItem>
            </Menu>
        </Grid>
        {/* Weather Section */}
        <Box id="weather" sx={{ width: '100%', mb: 4 }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={2}>
              Weather Forecast
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Weather information will be displayed here.
            </Typography>
          </Paper>
        </Box>
        
        {/* Calendar Section */}
        <Box id="calendar" sx={{ width: '100%', mb: 4 }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={2}>
              Upcoming Events
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Calendar events will be displayed here.
            </Typography>
          </Paper>
        </Box>
        
        {/* Analytics Section */}
        <Box id="analytics" sx={{ width: '100%', mb: 4 }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={2}>
              Analytics Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Analytics data will be displayed here.
            </Typography>
          </Paper>
        </Box>
        
        {/* System Alerts */}
        <Grid item xs={12} lg={4}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight={600}>
                System Alerts
              </Typography>
              <Chip 
                label={`${systemAlerts.length} New`} 
                size="small" 
                color="error" 
                variant="outlined"
              />
            </Box>
            
            <Stack spacing={2}>
              {systemAlerts.map((alert) => (
                <Box 
                  key={alert.id}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      cursor: 'pointer',
                    },
                  }}
                >
                  <Box display="flex" alignItems="flex-start">
                    <Box sx={{ mr: 2 }}>
                      {alert.icon}
                    </Box>
                    <Box flexGrow={1}>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        {alert.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {alert.time}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
              
              <Button 
                fullWidth 
                variant="outlined" 
                color="primary"
                sx={{ mt: 1 }}
                onClick={() => console.log('View all alerts')}
              >
                View All Alerts
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

DashboardPage.propTypes = {
  // Add prop types here if needed
};

export default DashboardPage;
