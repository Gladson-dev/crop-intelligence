import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Grid,
  Divider,
  IconButton,
  InputAdornment,
  Fade,
  useTheme,
  alpha,
  CssBaseline,
  InputLabel,
  FormControl,
  OutlinedInput,
  FormHelperText,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { 
  Visibility as VisibilityIcon, 
  VisibilityOff as VisibilityOffIcon, 
  Lock as LockIcon, 
  Email as EmailIcon,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  GitHub as GitHubIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Background image
const backgroundImage = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80';

const Login = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isAuthenticated, loading } = useSelector((state) => ({
    error: state.auth.error,
    isAuthenticated: state.auth.isAuthenticated,
    loading: state.auth.loading
  }));
  const [showAlert, setShowAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginInProgress, setLoginInProgress] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }
    
    if (error) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        dispatch(clearError());
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate, error, dispatch]);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required')
    }),
    onSubmit: async (values, { setSubmitting, setFieldError, setStatus }) => {
      setLoginInProgress(true);
      setStatus(undefined);
      
      // Clear any previous errors
      setFieldError('email', undefined);
      setFieldError('password', undefined);
      
      try {
        const resultAction = await dispatch(loginUser(values));
        
        if (loginUser.rejected.match(resultAction)) {
          const errorMessage = resultAction.payload?.toLowerCase() || 'login failed';
          let displayMessage = 'Login failed. Please try again.';
          
          // Handle specific error cases
          if (errorMessage.includes('invalid password') || errorMessage.includes('wrong password')) {
            displayMessage = 'Incorrect password. Please try again.';
            setFieldError('password', ' ');
          } 
          else if (errorMessage.includes('user not found') || errorMessage.includes('email not found')) {
            displayMessage = 'No account found with this email. Please check and try again.';
            setFieldError('email', ' ');
          }
          else if (errorMessage.includes('user already exists')) {
            displayMessage = 'An account with this email already exists. Please log in or use a different email.';
            setFieldError('email', ' ');
          }
          else if (errorMessage.includes('invalid email')) {
            displayMessage = 'Please enter a valid email address.';
            setFieldError('email', ' ');
          }
          
          // Set the status with the appropriate message
          setStatus(displayMessage);
          
          // Show an alert for important messages
          if (['incorrect password', 'no account found', 'user already exists'].some(term => 
              displayMessage.toLowerCase().includes(term))) {
            // Using browser's alert for better visibility
            setTimeout(() => {
              alert(displayMessage);
            }, 100);
          }
        }
      } catch (error) {
        console.error('Unexpected error during login:', error);
        const errorMessage = 'An unexpected error occurred. Please try again later.';
        setStatus(errorMessage);
        alert(errorMessage);
      } finally {
        setSubmitting(false);
        setLoginInProgress(false);
      }
    }
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        px: 2,
      }}
    >
      <CssBaseline />
      <Container component="main" maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper 
            elevation={6}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: theme.shadows[10],
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              maxWidth: 1000,
              mx: 'auto'
            }}
          >
            {/* Left side - Welcome */}
            <Box
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
                p: { xs: 4, md: 6 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center',
                minHeight: { xs: 'auto', md: '650px' },
                width: { xs: '100%', md: '45%' },
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `url(${backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.1,
                  zIndex: 0,
                }
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <LoginIcon sx={{ fontSize: 60, mb: 2, color: 'white' }} />
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                  Welcome Back!
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, opacity: 0.9, maxWidth: '80%', mx: 'auto' }}>
                  Sign in to access your account and continue your journey with us.
                </Typography>
                
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <IconButton 
                    onClick={() => handleSocialLogin('google')}
                    sx={{
                      bgcolor: 'white',
                      color: theme.palette.error.main,
                      '&:hover': { bgcolor: 'grey.100' }
                    }}
                  >
                    <GoogleIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleSocialLogin('facebook')}
                    sx={{
                      bgcolor: 'white',
                      color: theme.palette.primary.main,
                      '&:hover': { bgcolor: 'grey.100' }
                    }}
                  >
                    <FacebookIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleSocialLogin('github')}
                    sx={{
                      bgcolor: 'white',
                      color: 'grey.900',
                      '&:hover': { bgcolor: 'grey.100' }
                    }}
                  >
                    <GitHubIcon />
                  </IconButton>
                </Box>
                
                <Box sx={{ mt: 'auto', pt: 4, position: 'relative' }}>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {t('noAccount', { ns: 'common' })}
                    </Typography>
                  </Divider>
                  <Button 
                    component={Link} 
                    to="/register" 
                    variant="outlined" 
                    color="inherit"
                    size="large"
                    fullWidth
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    {t('signUp', { ns: 'common' })}
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* Right side - Login Form */}
            <Box 
              sx={{ 
                p: { xs: 4, md: 6 }, 
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: { xs: '100%', md: '55%' },
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" component="h2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {t('signIn', { ns: 'common' })}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {t('welcomeMessage', { ns: 'common' })}
                </Typography>
              </Box>

              <Box component="form" onSubmit={formik.handleSubmit} noValidate>
                <FormControl 
                  fullWidth 
                  variant="outlined" 
                  margin="normal"
                  error={(formik.touched.email && Boolean(formik.errors.email)) || 
                         (formik.touched.email && formik.status && formik.status.toLowerCase().includes('email'))}
                >
                  <InputLabel htmlFor="email">{t('email')}</InputLabel>
                  <OutlinedInput
                    id="email"
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    startAdornment={
                      <InputAdornment position="start">
                        <EmailIcon color={formik.touched.email && formik.errors.email ? 'error' : 'action'} />
                      </InputAdornment>
                    }
                    label={t('auth.email')}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <FormHelperText>{formik.errors.email}</FormHelperText>
                  )}
                </FormControl>

                <FormControl 
                  fullWidth 
                  variant="outlined" 
                  margin="normal"
                  error={(formik.touched.password && Boolean(formik.errors.password)) || 
                         (formik.touched.password && formik.status && formik.status.toLowerCase().includes('password'))}
                >
                  <InputLabel htmlFor="password">{t('password')}</InputLabel>
                  <OutlinedInput
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    startAdornment={
                      <InputAdornment position="start">
                        <LockIcon color={formik.touched.password && formik.errors.password ? 'error' : 'action'} />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label={t('password', { ns: 'common' })}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <FormHelperText>{formik.errors.password}</FormHelperText>
                  )}
                </FormControl>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="rememberMe"
                        checked={formik.values.rememberMe}
                        onChange={formik.handleChange}
                        color="primary"
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" color="text.secondary">
                        {t('rememberMe', { ns: 'common' })}
                      </Typography>
                    }
                  />
                  <Typography 
                    component={Link} 
                    to="/forgot-password" 
                    variant="body2" 
                    color="primary"
                    sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                  >
                    {t('forgotPassword', { ns: 'common' })}
                  </Typography>
                </Box>

                {/* Error message display */}
                {formik.status && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 2,
                      '& .MuiAlert-message': {
                        width: '100%',
                        textAlign: 'center'
                      }
                    }}
                  >
                    {formik.status}
                  </Alert>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={!loginInProgress && <LoginIcon />}
                  disabled={formik.isSubmitting || loginInProgress}
                  sx={{
                    mt: 1,
                    mb: 2,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.15)'
                    },
                    transition: 'all 0.3s ease',
                    minHeight: '48px',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:disabled': {
                      backgroundColor: theme.palette.primary.main,
                      opacity: 0.8,
                    },
                  }}
                >
                  {loginInProgress ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                      <CircularProgress size={24} color="inherit" sx={{ mr: 1.5 }} />
                      <span>Signing in...</span>
                    </Box>
                  ) : (
                    t('login')
                  )}
                </Button>

                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('orSignInWith', { ns: 'common' })}
                  </Typography>
                </Divider>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                  <IconButton 
                    onClick={() => handleSocialLogin('google')}
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <GoogleIcon color="error" />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleSocialLogin('facebook')}
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <FacebookIcon color="primary" />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleSocialLogin('github')}
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <GitHubIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;