# Deployment Guide: Crop Intelligence Application

This guide will walk you through deploying the Crop Intelligence application to Render.

## Prerequisites

1. A [Render](https://render.com/) account
2. A [MongoDB Atlas](https://www.mongodb.com/atlas) database (for production)
3. Your code pushed to a GitHub repository

## Backend Deployment

1. **Set up MongoDB Atlas**
   - Create a new cluster in MongoDB Atlas
   - Create a database user
   - Add your IP address to the IP whitelist
   - Get your connection string (replace `<password>` with your database user's password)

2. **Deploy to Render**
   - Go to your Render dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` directory
   - Configure the service:
     - Name: `crop-intelligence-backend`
     - Region: Choose the one closest to your users
     - Branch: `main` or your preferred branch
     - Build Command: `npm install`
     - Start Command: `npm start`
   - Add environment variables:
     - `NODE_ENV`: `production`
     - `PORT`: `10000`
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: A secure secret for JWT token generation
     - Any other environment variables from your `.env` file
   - Click "Create Web Service"

## Frontend Deployment

1. **Update API Endpoints**
   - Ensure all API calls in your frontend use the backend URL (e.g., `https://crop-intelligence-backend.onrender.com`)

2. **Deploy to Render**
   - Go to your Render dashboard
   - Click "New" → "Static Site"
   - Connect your GitHub repository
   - Select the `frontend` directory
   - Configure the site:
     - Name: `crop-intelligence-frontend`
     - Build Command: `npm install && npm run build`
     - Publish Directory: `build`
   - Add environment variables:
     - `REACT_APP_API_URL`: `https://crop-intelligence-backend.onrender.com`
   - Click "Create Static Site"

## Environment Variables

### Backend
- `NODE_ENV`: `production`
- `PORT`: `10000`
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure secret for JWT
- `JWT_EXPIRE`: JWT expiration time (e.g., `30d`)
- `COOKIE_EXPIRE`: Cookie expiration time in days (e.g., `30`)

### Frontend
- `REACT_APP_API_URL`: Your backend API URL (e.g., `https://crop-intelligence-backend.onrender.com`)

## Post-Deployment

1. **Set up Custom Domain (Optional)**
   - Go to your service settings in Render
   - Click "Add Custom Domain" and follow the instructions

2. **Enable Auto-Deploy**
   - In your service settings, enable "Auto-Deploy" to automatically deploy changes when you push to your repository

3. **Monitor Your Application**
   - Check the logs in the Render dashboard for any issues
   - Set up alerts for errors or downtime

## Troubleshooting

- If the backend fails to start, check the logs in the Render dashboard
- Ensure all environment variables are correctly set
- Make sure your MongoDB Atlas cluster is accessible from Render's IP addresses (whitelist `0.0.0.0/0` for testing, but restrict it in production)
- If you encounter CORS issues, check your CORS configuration in the backend

## Security Considerations

- Never commit sensitive information to your repository
- Use environment variables for all secrets
- Enable HTTPS for all services
- Regularly update your dependencies
- Set up proper authentication and authorization
- Implement rate limiting on your API endpoints
