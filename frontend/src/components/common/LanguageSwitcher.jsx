import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { LANGUAGES } from '../../config/i18n';
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Paper,
  useTheme,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import CheckIcon from '@mui/icons-material/Check';

const LanguageSwitcher = ({ position = 'bottom-right' }) => {
  const { t, i18n, changeLanguage, getCurrentLanguage } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const currentLang = getCurrentLanguage();

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = async (lng) => {
    const success = await changeLanguage(lng);
    if (success) {
      handleCloseMenu();
      // Force a re-render of the app to update all translations
      window.location.reload();
    }
  };

  // Position styles
  const getPositionStyles = () => {
    const positions = position.split('-');
    const styles = {
      position: 'fixed',
      zIndex: theme.zIndex.speedDial,
    };

    positions.forEach((pos) => {
      switch (pos) {
        case 'top':
          styles.top = theme.spacing(2);
          break;
        case 'bottom':
          styles.bottom = theme.spacing(2);
          break;
        case 'left':
          styles.left = theme.spacing(2);
          break;
        case 'right':
          styles.right = theme.spacing(2);
          break;
        default:
          break;
      }
    });

    return styles;
  };

  return (
    <Box sx={getPositionStyles()}>
      <IconButton
        onClick={handleOpenMenu}
        color="inherit"
        aria-label={t('common.changeLanguage')}
        sx={{
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[3],
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <LanguageIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        PaperProps={{
          style: {
            maxHeight: 300,
            width: 200,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="subtitle2" color="text.secondary">
            {t('common.selectLanguage')}
          </Typography>
        </Box>
        
        {Object.entries(LANGUAGES).map(([code, lang]) => (
          <MenuItem
            key={code}
            selected={i18n.language === code}
            onClick={() => handleLanguageChange(code)}
            sx={{
              '&.Mui-selected': {
                backgroundColor: theme.palette.action.selected,
                '&:hover': {
                  backgroundColor: theme.palette.action.selected,
                },
              },
            }}
          >
            <ListItemIcon>
              <Typography variant="h6">{lang.flag}</Typography>
            </ListItemIcon>
            <ListItemText
              primary={lang.nativeName}
              secondary={lang.name}
              primaryTypographyProps={{
                fontWeight: i18n.language === code ? 'bold' : 'normal',
              }}
            />
            {i18n.language === code && (
              <CheckIcon color="primary" fontSize="small" />
            )}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher;
