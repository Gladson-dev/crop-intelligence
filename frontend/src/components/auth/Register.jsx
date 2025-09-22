import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError } from '../../store/slices/authSlice';
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
  Person as PersonIcon,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  GitHub as GitHubIcon,
  HowToReg as HowToRegIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Background image
const backgroundImage = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80';

const Register = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isAuthenticated } = useSelector((state) => state.auth);
  const [showAlert, setShowAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Handle error alert
  useEffect(() => {
    if (error) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'Username must be at least 3 characters')
        .required('Username is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
      terms: Yup.boolean()
        .oneOf([true], 'You must accept the terms and conditions')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { confirmPassword, terms, ...userData } = values;
        await dispatch(registerUser(userData)).unwrap();
      } catch (error) {
        console.error('Registration failed:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSocialRegister = (provider) => {
    // Handle social registration
    console.log(`Registering with ${provider}`);
  };

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
                <HowToRegIcon sx={{ fontSize: 60, mb: 2, color: 'white' }} />
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                  {t('createAccount', { ns: 'common' })}
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, opacity: 0.9, maxWidth: '80%', mx: 'auto' }}>
                  {t('registerMessage', { ns: 'common' })}
                </Typography>
                
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <IconButton 
                    onClick={() => handleSocialRegister('google')}
                    sx={{
                      bgcolor: 'white',
                      color: theme.palette.error.main,
                      '&:hover': { bgcolor: 'grey.100' }
                    }}
                  >
                    <GoogleIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleSocialRegister('facebook')}
                    sx={{
                      bgcolor: 'white',
                      color: theme.palette.primary.main,
                      '&:hover': { bgcolor: 'grey.100' }
                    }}
                  >
                    <FacebookIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleSocialRegister('github')}
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
                      {t('haveAccount', { ns: 'common' })}
                    </Typography>
                  </Divider>
                  <Button 
                    component={Link} 
                    to="/login" 
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
                    {t('signIn', { ns: 'common' })}
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* Right side - Registration Form */}
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
                  {t('createAccount', { ns: 'common' })}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {t('registerMessage', { ns: 'common' })}
                </Typography>
              </Box>

              {showAlert && error && (
                <Alert 
                  severity="error" 
                  sx={{ mb: 3, borderRadius: 2 }}
                  onClose={() => setShowAlert(false)}
                >
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={formik.handleSubmit} noValidate>
                <FormControl 
                  fullWidth 
                  variant="outlined" 
                  margin="normal"
                  error={formik.touched.username && Boolean(formik.errors.username)}
                >
                  <InputLabel htmlFor="username">{t('username', { ns: 'common' })}</InputLabel>
                  <OutlinedInput
                    id="username"
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    startAdornment={
                      <InputAdornment position="start">
                        <PersonIcon color={formik.touched.username && formik.errors.username ? 'error' : 'action'} />
                      </InputAdornment>
                    }
                    label={t('username', { ns: 'common' })}
                  />
                  {formik.touched.username && formik.errors.username && (
                    <FormHelperText>{formik.errors.username}</FormHelperText>
                  )}
                </FormControl>

                <FormControl 
                  fullWidth 
                  variant="outlined" 
                  margin="normal"
                  error={formik.touched.email && Boolean(formik.errors.email)}
                >
                  <InputLabel htmlFor="email">{t('email', { ns: 'common' })}</InputLabel>
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
                    label={t('email', { ns: 'common' })}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <FormHelperText>{formik.errors.email}</FormHelperText>
                  )}
                </FormControl>

                <FormControl 
                  fullWidth 
                  variant="outlined" 
                  margin="normal"
                  error={formik.touched.password && Boolean(formik.errors.password)}
                >
                  <InputLabel htmlFor="password">{t('password', { ns: 'common' })}</InputLabel>
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

                <FormControl 
                  fullWidth 
                  variant="outlined" 
                  margin="normal"
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                >
                  <InputLabel htmlFor="confirmPassword">{t('confirmPassword', { ns: 'common' })}</InputLabel>
                  <OutlinedInput
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    startAdornment={
                      <InputAdornment position="start">
                        <LockIcon color={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'error' : 'action'} />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label={t('confirmPassword', { ns: 'common' })}
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <FormHelperText>{formik.errors.confirmPassword}</FormHelperText>
                  )}
                </FormControl>

                <FormControl 
                  fullWidth 
                  margin="normal"
                  error={formik.touched.terms && Boolean(formik.errors.terms)}
                >
                  <FormControlLabel
                    control={
                      <Checkbox 
                        name="terms"
                        checked={formik.values.terms}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        color="primary"
                        size="small"
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
                      />
                    }
                    label={
                      <Typography variant="body2" color="text.secondary">
                        {t('iAgreeTo', { ns: 'common' })} <Link to="/terms" style={{ color: theme.palette.primary.main, textDecoration: 'none' }}>{t('termsOfService', { ns: 'common' })}</Link> {t('and', { ns: 'common' })} <Link to="/privacy" style={{ color: theme.palette.primary.main, textDecoration: 'none' }}>{t('privacyPolicy', { ns: 'common' })}</Link>
                      </Typography>
                    }
                  />
                  {formik.touched.terms && formik.errors.terms && (
                    <FormHelperText sx={{ ml: 0, mt: -1 }}>{formik.errors.terms}</FormHelperText>
                  )}
                </FormControl>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    mt: 2,
                    mb: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: '0 4px 15px 0 rgba(65, 132, 234, 0.35)',
                    '&:hover': {
                      boxShadow: '0 6px 20px 0 rgba(65, 132, 234, 0.5)',
                    },
                    '&:disabled': {
                      background: theme.palette.action.disabledBackground,
                      color: theme.palette.action.disabled,
                      boxShadow: 'none',
                    },
                  }}
                  disabled={formik.isSubmitting}
                  startIcon={formik.isSubmitting ? <CircularProgress size={20} color="inherit" /> : <HowToRegIcon />}
                >
                  {formik.isSubmitting ? t('creatingAccount', { ns: 'common' }) : t('createAccount', { ns: 'common' })}
                </Button>

                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('orSignUpWith', { ns: 'common' })}
                  </Typography>
                </Divider>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                  <IconButton 
                    onClick={() => handleSocialRegister('google')}
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <GoogleIcon color="error" />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleSocialRegister('facebook')}
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <FacebookIcon color="primary" />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleSocialRegister('github')}
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

export default Register;
