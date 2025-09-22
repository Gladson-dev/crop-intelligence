import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
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
  Badge,
  CircularProgress
} from '@mui/material';
import { 
  WaterDrop as WaterDropIcon,
  WbSunny as WeatherIcon,
  Opacity as OpacityIcon,
  Thermostat as ThermostatIcon,
  MoreVert as MoreVertIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CalendarToday as CalendarIcon,
  AccessTime as AccessTimeIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

// Memoized StatusChip component
const StatusChip = React.memo(({ status }) => {
  const getStatusProps = () => {
    switch (status) {
      case 'active':
        return { label: 'Active', color: 'success', icon: <CheckCircleIcon fontSize="small" /> };
      case 'inactive':
        return { label: 'Inactive', color: 'default', icon: <InfoIcon fontSize="small" /> };
      case 'warning':
        return { label: 'Warning', color: 'warning', icon: <WarningIcon fontSize="small" /> };
      case 'error':
        return { label: 'Error', color: 'error', icon: <ErrorIcon fontSize="small" /> };
      default:
        return { label: 'Unknown', color: 'default', icon: <InfoIcon fontSize="small" /> };
    }
  };

  const { label, color, icon } = getStatusProps();

  return (
    <Chip
      icon={icon}
      label={label}
      color={color}
      size="small"
      variant="outlined"
      sx={{ minWidth: 100 }}
    />
  );
});

// Memoized StatCard component
const StatCard = React.memo(({ title, value, unit, change, isPositive, icon: Icon, color, trend, timeFrame }) => {
  const TrendIcon = trend === 'up' ? ArrowUpwardIcon : ArrowDownwardIcon;
  
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Box display="flex" alignItems="baseline" gap={1}>
              <Typography variant="h5" component="div" fontWeight={600}>
                {value}
              </Typography>
              {unit && (
                <Typography variant="body2" color="text.secondary">
                  {unit}
                </Typography>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}.100`,
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: `${color}.main`,
            }}
          >
            <Icon />
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mt={1}>
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              color: isPositive ? 'success.main' : 'error.main',
              mr: 1,
            }}
          >
            <TrendIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2" fontWeight={500}>
              {change}%
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {timeFrame}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
});

const DashboardPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Select only the necessary state to prevent unnecessary re-renders
  const { isAuthenticated, loading, user } = useSelector(
    (state) => ({
      isAuthenticated: state.auth.isAuthenticated,
      loading: state.auth.loading,
      user: state.auth.user
    }),
    shallowEqual
  );

  // Local state
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zones, setZones] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Memoize derived state
  const open = Boolean(anchorEl);
  const profileMenuOpen = Boolean(profileAnchorEl);

  // Memoize user data
  const userData = useMemo(() => ({
    name: user?.username || 'User',
    email: user?.email || '',
    avatar: user?.avatar || '/default-avatar.png',
    lastLogin: 'Just now',
    systemStatus: 'online',
    notifications: 0,
  }), [user]);

  // Memoize stats data
  const stats = useMemo(() => [
    {
      title: 'Water Usage',
      value: '1,250',
      unit: 'L',
      change: '12.5',
      isPositive: false,
      icon: WaterDropIcon,
      color: 'primary',
      trend: 'up',
      timeFrame: 'Today',
    },
    {
      title: 'Energy Consumption',
      value: '45.2',
      unit: 'kWh',
      change: '3.2',
      isPositive: true,
      icon: OpacityIcon,
      color: 'secondary',
      trend: 'down',
      timeFrame: 'Today',
    },
    {
      title: 'System Health',
      value: '98',
      unit: '%',
      change: '2.1',
      isPositive: true,
      icon: CheckCircleIcon,
      color: 'success',
      trend: 'up',
      timeFrame: 'This week',
    },
  ], []);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        if (isAuthenticated && !user) {
          await dispatch(loadUser());
        }
        
        // Simulate API calls
        setZones([
          { id: 1, name: 'Front Lawn', status: 'active', type: 'sprinkler', lastWatered: '2h ago', nextWatering: 'In 4h', waterUsage: '120L' },
          { id: 2, name: 'Back Garden', status: 'inactive', type: 'drip', lastWatered: '5h ago', nextWatering: 'Tomorrow', waterUsage: '85L' },
          { id: 3, name: 'Vegetable Patch', status: 'warning', type: 'sprinkler', lastWatered: '1d ago', nextWatering: 'In 2h', waterUsage: '65L' },
          { id: 4, name: 'Flower Beds', status: 'active', type: 'drip', lastWatered: '3h ago', nextWatering: 'In 6h', waterUsage: '45L' },
        ]);

        setAlerts([
          { id: 1, message: 'Low water pressure detected in Front Lawn', level: 'warning', time: '10m ago' },
          { id: 2, message: 'System update available', level: 'info', time: '1h ago' },
          { id: 3, message: 'Water leak detected in Back Garden', level: 'error', time: '3h ago' },
        ]);

      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [dispatch, isAuthenticated, user]);

  // Handlers
  const handleMenuOpen = useCallback((event, zone) => {
    setSelectedZone(zone);
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedZone(null);
  }, []);

  const handleProfileMenuOpen = useCallback((event) => {
    setProfileAnchorEl(event.currentTarget);
  }, []);

  const handleProfileMenuClose = useCallback(() => {
    setProfileAnchorEl(null);
  }, []);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  const handleAction = useCallback((action) => {
    console.log(`Action: ${action}`, selectedZone);
    handleMenuClose();
  }, [selectedZone, handleMenuClose]);

  const toggleZoneStatus = useCallback((zoneId) => {
    setZones(prevZones => 
      prevZones.map(zone => 
        zone.id === zoneId 
          ? { 
              ...zone, 
              status: zone.status === 'active' ? 'inactive' : 'active' 
            } 
          : zone
      )
    );
  }, []);

  const toggleAllZones = useCallback((status) => {
    setZones(prevZones => 
      prevZones.map(zone => ({
        ...zone,
        status: status
      }))
    );
  }, []);

  const getZoneIcon = useCallback((type) => {
    switch (type) {
      case 'sprinkler':
        return <WaterDropIcon color="primary" />;
      case 'drip':
        return <OpacityIcon color="secondary" />;
      default:
        return <WaterDropIcon />;
    }
  }, []);

  // Loading state
  if (isLoading || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', p: 3 }}>
      {/* Top Bar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {t('dashboard.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Typography>
        </Box>
        
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <Button
            variant="outlined"
            startIcon={<PersonIcon />}
            onClick={handleProfileMenuOpen}
            sx={{ textTransform: 'none' }}
          >
            {userData.name}
          </Button>
          
          <Menu
            anchorEl={profileAnchorEl}
            open={profileMenuOpen}
            onClose={handleProfileMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => {
              handleProfileMenuClose();
              navigate('/profile');
            }}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              handleProfileMenuClose();
              navigate('/settings');
            }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Irrigation Zones */}
        <Grid item xs={12} lg={8}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              borderRadius: 2,
              backgroundColor: 'background.paper',
              height: '100%'
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight={600}>
                Irrigation Zones
              </Typography>
              <Box>
                <Button 
                  size="small" 
                  color="primary"
                  onClick={() => toggleAllZones('active')}
                  sx={{ mr: 1 }}
                >
                  Turn All On
                </Button>
                <Button 
                  size="small" 
                  color="secondary"
                  onClick={() => toggleAllZones('inactive')}
                >
                  Turn All Off
                </Button>
              </Box>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Zone</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Watered</TableCell>
                    <TableCell>Next Watering</TableCell>
                    <TableCell>Water Usage</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {zones.map((zone) => (
                    <TableRow key={zone.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          {getZoneIcon(zone.type)}
                          <Typography>{zone.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <StatusChip status={zone.status} />
                      </TableCell>
                      <TableCell>{zone.lastWatered}</TableCell>
                      <TableCell>{zone.nextWatering}</TableCell>
                      <TableCell>{zone.waterUsage}</TableCell>
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
        </Grid>

        {/* System Alerts */}
        <Grid item xs={12} lg={4}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              borderRadius: 2,
              backgroundColor: 'background.paper',
              height: '100%'
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight={600}>
                System Alerts
              </Typography>
              <IconButton size="small">
                <RefreshIcon />
              </IconButton>
            </Box>
            
            <Stack spacing={2}>
              {alerts.map((alert) => (
                <Box 
                  key={alert.id}
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 
                      alert.level === 'error' ? 'error.light' : 
                      alert.level === 'warning' ? 'warning.light' : 'divider',
                    backgroundColor: 
                      alert.level === 'error' ? 'error.50' : 
                      alert.level === 'warning' ? 'warning.50' : 'background.paper',
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="body2">
                      {alert.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {alert.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Zone Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleAction('edit')}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Zone</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('schedule')}>
          <ListItemIcon>
            <CalendarIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Schedule</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleAction('turn_on')}>
          <ListItemIcon>
            <CheckCircleIcon fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText>Turn On</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('turn_off')}>
          <ListItemIcon>
            <ErrorIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Turn Off</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DashboardPage;
