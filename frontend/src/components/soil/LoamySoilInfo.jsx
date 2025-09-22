import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  Grid,
  Card,
  CardContent,
  Divider,
  Tooltip,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom
} from '@mui/material';
import { 
  Spa as SpaIcon,
  WaterDrop as WaterDropIcon,
  Grass as GrassIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  LocalFlorist as LocalFloristIcon,
  Park as ParkIcon,
  Agriculture as AgricultureIcon,
  Science as ScienceIcon,
  Water as WaterIcon,
  Scale as ScaleIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const LoamySoilInfo = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Function to get water requirement color
  const getWaterReqColor = (req) => {
    const reqLower = req.toLowerCase();
    if (reqLower.includes('very high')) return '#d32f2f'; // Deep red
    if (reqLower.includes('high')) return '#f57c00'; // Orange
    if (reqLower.includes('moderate')) return '#ffa000'; // Amber
    if (reqLower.includes('low')) return '#388e3c'; // Green
    return theme.palette.text.secondary;
  };
  
  // Function to get soil property color
  const getSoilPropertyColor = (property, value) => {
    if (property === 'pH') {
      if (value < 5.5) return '#e53935'; // Acidic (red)
      if (value > 7.5) return '#1e88e5'; // Alkaline (blue)
      return '#43a047'; // Neutral (green)
    }
    return theme.palette.primary.main;
  };
  // Crops data with water requirements and icons
  const crops = [
    { 
      name: 'Wheat', 
      waterReq: 'Moderate', 
      icon: '🌾',
      notes: 'Needs irrigation at critical stages (tillering, flowering, grain filling)',
      season: 'Rabi (Winter)'
    },
    { 
      name: 'Rice', 
      waterReq: 'High', 
      icon: '🌾',
      notes: 'Requires standing water in fields; loamy soil supports if irrigation available',
      season: 'Kharif (Monsoon)'
    },
    { 
      name: 'Sugarcane', 
      waterReq: 'Very High', 
      icon: '🎋',
      notes: 'Needs continuous water supply (regular irrigation)',
      season: 'Year-round'
    },
    { 
      name: 'Cotton', 
      waterReq: 'Moderate', 
      icon: '🧶',
      notes: 'Requires well-drained loamy soil; too much water can harm',
      season: 'Kharif (Monsoon)'
    },
    { 
      name: 'Pulses', 
      waterReq: 'Low to Moderate', 
      icon: '🥜',
      notes: 'Grow well with less frequent watering',
      season: 'Rabi (Winter)'
    },
    { 
      name: 'Vegetables', 
      subtext: '(potato, tomato, onion, carrot)', 
      waterReq: 'Moderate to High', 
      icon: '🥔',
      notes: 'Need regular irrigation depending on crop cycle',
      season: 'Year-round'
    },
    { 
      name: 'Fruits', 
      subtext: '(mango, banana, papaya, orange)', 
      waterReq: 'Moderate to High', 
      icon: '🍌',
      notes: 'Banana needs more water, mango less',
      season: 'Year-round (varies)'
    },
    { 
      name: 'Oilseeds', 
      subtext: '(mustard, sunflower, groundnut)', 
      waterReq: 'Low to Moderate', 
      icon: '🌻',
      notes: 'Do not require too much water',
      season: 'Rabi (Winter)'
    },
  ];
  
  // Soil properties data
  const soilProperties = [
    {
      icon: <WaterDropIcon fontSize="large" color="primary" />,
      title: 'Water Retention',
      value: 'Excellent',
      description: 'Holds just the right amount of water without waterlogging',
      color: '#1e88e5'
    },
    {
      icon: <ScienceIcon fontSize="large" color="primary" />,
      title: 'Nutrient Level',
      value: 'High',
      description: 'Rich in organic matter and essential minerals',
      color: '#43a047'
    },
    {
      icon: <ScaleIcon fontSize="large" color="primary" />,
      title: 'pH Level',
      value: '6.0 - 7.0',
      description: 'Slightly acidic to neutral - ideal for most crops',
      color: '#7b1fa2'
    },
    {
      icon: <GrassIcon fontSize="large" color="primary" />,
      title: 'Aeration',
      value: 'Excellent',
      description: 'Good air circulation for healthy root growth',
      color: '#43a047'  // Changed to green to match the grass theme
    }
  ];

  // Function to render water drop icons based on water requirement
  const renderWaterDrops = (req) => {
    const reqLower = req.toLowerCase();
    let drops = [];
    
    if (reqLower.includes('very high')) {
      drops = ['💧', '💧', '💧', '💧'];
    } else if (reqLower.includes('high') || reqLower.includes('moderate to high')) {
      drops = ['💧', '💧', '💧'];
    } else if (reqLower.includes('moderate')) {
      drops = ['💧', '💧'];
    } else {
      drops = ['💧'];
    }
    
    return (
      <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
        {drops.map((drop, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            {drop}
          </motion.span>
        ))}
        <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 500, color: getWaterReqColor(req) }}>
          {req}
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 1, sm: 2, md: 3 } }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 2, sm: 3, md: 4 }, 
            mb: 4, 
            borderRadius: 3,
            background: 'linear-gradient(145deg, #f5f7fa 0%, #e8f0f8 100%)',
            border: '1px solid rgba(0,0,0,0.05)'
          }}
        >
          <Box 
            display="flex" 
            flexDirection={{ xs: 'column', sm: 'row' }} 
            alignItems={{ xs: 'flex-start', sm: 'center' }} 
            mb={4}
          >
            <Box 
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'primary.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 3,
                mb: { xs: 2, sm: 0 },
                boxShadow: 2
              }}
            >
              <SpaIcon sx={{ fontSize: 40, color: 'primary.contrastText' }} />
            </Box>
            <Box>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #1a5f7a 0%, #159895 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.2,
                  mb: 1
                }}
              >
                Loamy Soil – The Farmer's Best Friend
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: '800px' }}>
                The perfect balance of sand, silt, and clay for optimal plant growth and health
              </Typography>
            </Box>
          </Box>
        
        <Typography variant="h6" gutterBottom sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
          <CheckCircleIcon color="success" sx={{ mr: 1 }} /> Composition & Properties
        </Typography>
        <Box sx={{ ml: 3, mb: 4 }}>
          <Typography paragraph>Loamy soil is considered the best type of soil for agriculture because it is a balanced mixture of:</Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li><strong>40% Sand</strong> - Provides good drainage</li>
            <li><strong>40% Silt</strong> - Retains moisture and nutrients</li>
            <li><strong>20% Clay</strong> - Binds the soil together</li>
          </Box>
          
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2 }}>Key Benefits:</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <Chip 
              icon={<WaterDropIcon />} 
              label="Excellent water-holding capacity" 
              color="primary" 
              variant="outlined"
              sx={{ justifyContent: 'flex-start' }}
            />
            <Chip 
              icon={<CheckCircleIcon />} 
              label="Good drainage (prevents waterlogging)" 
              color="success" 
              variant="outlined"
              sx={{ justifyContent: 'flex-start' }}
            />
            <Chip 
              icon={<SpaIcon />} 
              label="Rich in organic matter & nutrients" 
              color="secondary" 
              variant="outlined"
              sx={{ justifyContent: 'flex-start' }}
            />
            <Chip 
              icon={<GrassIcon />} 
              label="Easy to cultivate and work with" 
              color="info" 
              variant="outlined"
              sx={{ justifyContent: 'flex-start' }}
            />
          </Box>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
          <GrassIcon color="success" sx={{ mr: 1 }} /> Crops Suited for Loamy Soil
        </Typography>
        
        <TableContainer component={Paper} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
          <Table size="small" aria-label="crops table">
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Crop</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Water Requirement</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {crops.map((crop, index) => (
                <TableRow 
                  key={index}
                  sx={{ 
                    '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                    '&:hover': { bgcolor: 'action.selected' }
                  }}
                >
                  <TableCell component="th" scope="row">
                    <Typography fontWeight={500}>{crop.name}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={crop.waterReq} 
                      size="small" 
                      sx={{ 
                        bgcolor: getWaterReqColor(crop.waterReq.toLowerCase()),
                        color: 'white',
                        fontWeight: 'bold',
                        minWidth: 100
                      }} 
                    />
                  </TableCell>
                  <TableCell>{crop.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ 
          bgcolor: 'success.light', 
          p: 3, 
          borderRadius: 2,
          borderLeft: '4px solid',
          borderColor: 'success.main'
        }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'success.dark', display: 'flex', alignItems: 'center' }}>
            <CheckCircleIcon sx={{ mr: 1 }} /> Why Farmers Love Loamy Soil
          </Typography>
          <Typography variant="body1" sx={{ color: 'success.contrastText' }}>
            Loamy soil is often called the "farmer's best friend" because its balanced composition makes it ideal for growing a wide variety of crops. 
            It retains enough moisture to support plant growth while still providing good drainage to prevent waterlogging. 
            The soil's structure allows for excellent root penetration and air circulation, while its natural fertility reduces the need for chemical fertilizers.
          </Typography>
        </Box>
      </Paper>
      </motion.div>
    </Box>
  );
};

export default LoamySoilInfo;
