import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { imagesAPI } from '../../services/api';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  InputAdornment,
  TextField,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fetch user's images
  useEffect(() => {
    const fetchImages = async () => {
      // In a real app, you would fetch the user's images here
      // For now, we'll use a placeholder
      setImages([
        { id: 1, url: 'https://via.placeholder.com/300', name: 'Image 1' },
        { id: 2, url: 'https://via.placeholder.com/300', name: 'Image 2' },
      ]);
    };

    fetchImages();
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      const response = await imagesAPI.uploadImage(formData);
      setImages([...images, { id: Date.now(), url: response.data.filePath, name: file.name }]);
      setSnackbarMessage('Image uploaded successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload image');
      setSnackbarMessage('Failed to upload image');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (id) => {
    try {
      setLoading(true);
      // Find the image to get its filename
      const imageToDelete = images.find(img => img.id === id);
      if (!imageToDelete) return;

      // In a real app, you would call the API to delete the image
      // await imagesAPI.deleteImage(imageToDelete.filename);
      
      // For now, just remove it from the local state
      setImages(images.filter(img => img.id !== id));
      setSnackbarMessage('Image deleted successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete image');
      setSnackbarMessage('Failed to delete image');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {t('myDashboard')}
          </Typography>
          <div>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="upload-image"
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="upload-image">
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                component="span"
                disabled={loading}
              >
                Upload Image
              </Button>
            </label>
          </div>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading && images.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {images.map((image) => (
              <Grid item key={image.id} xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    image={image.url}
                    alt={image.name}
                    sx={{ height: 200, objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography gutterBottom variant="subtitle1" noWrap>
                      {image.name}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDeleteImage(image.id)}
                      disabled={loading}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.grey[200] }}>
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            {' '}
            {new Date().getFullYear()} Crop Intelligence. All rights reserved.
          </Typography>
        </Container>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={error ? 'error' : 'success'} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
