import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { I18nextProvider } from 'react-i18next';
import { Box, CircularProgress } from '@mui/material';
import i18n from './i18n';
import App from './App';
import { store } from './store/store';

// Loading component
const LoadingScreen = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="100vh"
    bgcolor="background.default"
  >
    <CircularProgress />
  </Box>
);

// Simple theme for faster rendering
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

// Main App Wrapper
const AppWrapper = () => {
  const [i18nReady, setI18nReady] = useState(i18n.isInitialized);

  useEffect(() => {
    const handleInitialized = () => {
      setI18nReady(true);
    };

    if (!i18n.isInitialized) {
      i18n.init().then(() => {
        setI18nReady(true);
      });
    }

    i18n.on('initialized', handleInitialized);
    
    return () => {
      i18n.off('initialized', handleInitialized);
    };
  }, []);

  if (!i18nReady) {
    return <LoadingScreen />;
  }

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  );
};

// Render the app
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
