import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Tabs,
  Tab,
  Box,
  useTheme,
  useMediaQuery,
  Divider,
  IconButton,
  Tooltip,
  Chip,
  Grid,
  Card,
  CardContent,
  styled,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import { 
  Grass as GrassIcon,
  WaterDrop as WaterDropIcon,
  Park as ParkIcon,
  Agriculture as AgricultureIcon,
  Info as InfoIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  LocalFlorist as LocalFloristIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LoamySoilInfo from '../components/soil/LoamySoilInfo';

const FeatureItem = ({ icon, title, description }) => (
  <Box sx={{ display: 'flex', mb: 2 }}>
    <Box sx={{ mr: 2, mt: 0.5 }}>{icon}</Box>
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{title}</Typography>
      <Typography variant="body2" color="text.secondary">{description}</Typography>
    </Box>
  </Box>
);

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`soil-tabpanel-${index}`}
      aria-labelledby={`soil-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `soil-tab-${index}`,
    'aria-controls': `soil-tabpanel-${index}`,
  };
}

const SoilInfoPage = () => {
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const soilTypes = [
    { 
      id: 'loamy', 
      name: 'Loamy Soil', 
      icon: <GrassIcon />, 
      description: 'The ideal balanced soil for most crops' 
    },
    { 
      id: 'sandy', 
      name: 'Sandy Soil', 
      icon: <WaterDropIcon />, 
      description: 'Fast-draining soil that needs more water' 
    },
    { 
      id: 'clay', 
      name: 'Clay Soil', 
      icon: <AgricultureIcon />, 
      description: 'Heavy soil that retains water' 
    },
    { 
      id: 'silty', 
      name: 'Silty Soil', 
      icon: <ParkIcon />, 
      description: 'Fertile soil that holds moisture well' 
    }
  ];

  const soilProperties = [
    {
      icon: <WaterDropIcon fontSize="large" />,
      title: 'Moisture Retention',
      description: 'Holds water effectively while allowing excess to drain, preventing waterlogging.'
    },
    {
      icon: <AgricultureIcon fontSize="large" />,
      title: 'Rich in Nutrients',
      description: 'Contains abundant organic matter and essential minerals for plant growth.'
    },
    {
      icon: <GrassIcon fontSize="large" />,
      title: 'Excellent Aeration',
      description: 'Well-aerated structure allows roots to breathe and expand easily.'
    },
    {
      icon: <CheckCircleIcon fontSize="large" />,
      title: 'Easy to Work With',
      description: 'Ideal texture for tilling and cultivation with minimal effort.'
    }
  ];

  const cropsData = [
    { name: 'Wheat', water: 'Moderate', icon: <LocalFloristIcon />, notes: 'Needs irrigation at critical growth stages' },
    { name: 'Rice', water: 'High', icon: <WaterDropIcon />, notes: 'Requires standing water in fields' },
    { name: 'Sugarcane', water: 'Very High', icon: <LocalFloristIcon />, notes: 'Needs continuous water supply' },
    { name: 'Cotton', water: 'Moderate', icon: <ParkIcon />, notes: 'Well-drained soil preferred' },
    { name: 'Pulses', water: 'Low-Moderate', icon: <GrassIcon />, notes: 'Less frequent watering needed' },
    { name: 'Vegetables', water: 'Moderate-High', icon: <LocalFloristIcon />, notes: 'Regular irrigation required' },
    { name: 'Fruits', water: 'Moderate-High', icon: <ParkIcon />, notes: 'Varies by fruit type' },
    { name: 'Oilseeds', water: 'Low-Moderate', icon: <LocalFloristIcon />, notes: 'Over-irrigation can reduce yield' },
  ];

  const getWaterChip = (level) => {
    const colorMap = {
      'Low': 'success',
      'Low-Moderate': 'info',
      'Moderate': 'primary',
      'Moderate-High': 'warning',
      'High': 'error',
      'Very High': 'error'
    };
    
    return (
      <Chip 
        label={level} 
        size="small" 
        color={colorMap[level] || 'default'}
        sx={{ minWidth: 90 }}
      />
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 2,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(25, 118, 210, 0.1)',
          }
        }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            color: 'primary.main',
            position: 'relative',
            zIndex: 1
          }}
        >
          Loamy Soil: The Farmer's Best Friend
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ 
            mb: 3,
            maxWidth: '80%',
            position: 'relative',
            zIndex: 1
          }}
        >
          The ideal soil for agriculture, balancing water retention, drainage, and fertility
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip 
            icon={<CheckCircleIcon />} 
            label="Perfect for most crops" 
            color="success" 
            variant="outlined" 
          />
          <Chip 
            icon={<WaterDropIcon />} 
            label="Balanced water retention" 
            color="info" 
            variant="outlined" 
          />
          <Chip 
            icon={<AgricultureIcon />} 
            label="Rich in nutrients" 
            color="warning" 
            variant="outlined" 
          />
        </Box>
      </Paper>

      {/* Soil Properties */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 600 }}>
        🌱 Why Loamy Soil is Ideal
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {soilProperties.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StyledCard>
              <CardContent sx={{ height: '100%' }}>
                <Box sx={{ mb: 2, color: 'primary.main' }}>
                  {item.icon}
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Composition */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 600 }}>
        🧪 Soil Composition
      </Typography>
      <Paper sx={{ p: 3, mb: 6, borderRadius: 2 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Perfect Balance for Plant Growth
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Sand</Typography>
                <Typography>40%</Typography>
              </Box>
              <Box sx={{ width: '100%', height: 8, bgcolor: 'grey.200', borderRadius: 4, overflow: 'hidden' }}>
                <Box sx={{ width: '40%', height: '100%', bgcolor: 'warning.main' }} />
              </Box>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Silt</Typography>
                <Typography>40%</Typography>
              </Box>
              <Box sx={{ width: '100%', height: 8, bgcolor: 'grey.200', borderRadius: 4, overflow: 'hidden' }}>
                <Box sx={{ width: '40%', height: '100%', bgcolor: 'info.main' }} />
              </Box>
            </Box>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Clay</Typography>
                <Typography>20%</Typography>
              </Box>
              <Box sx={{ width: '100%', height: 8, bgcolor: 'grey.200', borderRadius: 4, overflow: 'hidden' }}>
                <Box sx={{ width: '20%', height: '100%', bgcolor: 'error.main' }} />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Key Characteristics
                </Typography>
                <FeatureItem
                  icon={<CheckCircleIcon color="success" />}
                  title="Optimal Texture"
                  description="The perfect balance between sand, silt, and clay particles."
                />
                <FeatureItem
                  icon={<CheckCircleIcon color="success" />}
                  title="Water Management"
                  description="Retains moisture while allowing excess water to drain."
                />
                <FeatureItem
                  icon={<CheckCircleIcon color="success" />}
                  title="Nutrient Rich"
                  description="High in organic matter and essential plant nutrients."
                />
                <FeatureItem
                  icon={<CheckCircleIcon color="success" />}
                  title="Easy to Cultivate"
                  description="Ideal texture for tilling and root development."
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Crops and Water Requirements */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 600 }}>
        🌾 Crops Suited for Loamy Soil
      </Typography>
      <Paper sx={{ p: 3, mb: 6, borderRadius: 2 }}>
        <TableContainer>
          <Table size={isMobile ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell>Crop</TableCell>
                <TableCell align="center">Water Requirement</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cropsData.map((crop, index) => (
                <TableRow 
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {crop.icon}
                      {crop.name}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {getWaterChip(crop.water)}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {crop.notes}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Additional Tips */}
      <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
        <Box display="flex" alignItems="center" mb={2}>
          <InfoIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="h3">
            Pro Tip
          </Typography>
        </Box>
        <Typography paragraph>
          Loamy soil's versatility makes it suitable for both water-intensive crops (like rice and sugarcane) and drought-resistant crops (like pulses and oilseeds).
          The key is to match the crop's water needs with your local climate and irrigation capabilities.
        </Typography>
        <Typography>
          <strong>Remember:</strong> Even the best soil benefits from regular organic matter additions and proper crop rotation to maintain its fertility and structure.
        </Typography>
      </Paper>
    </Container>
  );
};

export default SoilInfoPage;
