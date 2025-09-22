# Crop Intelligence Application

A full-stack web application for managing crop-related data with user authentication and image uploads.

## Features

- User authentication (login/register)
- Protected routes
- Image upload and management
- Responsive design with Material-UI
- State management with Redux Toolkit
- RESTful API with Express.js
- MongoDB for data storage

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (for cloud database) or local MongoDB installation

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   The server will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## Project Structure

```
crop-intelligence/
├── backend/               # Backend server
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── uploads/          # Uploaded files
│   ├── .env              # Environment variables
│   └── server.js         # Main server file
│
├── frontend/             # Frontend React app
│   ├── public/           # Static files
│   └── src/
│       ├── components/   # Reusable components
│       ├── contexts/     # React contexts
│       ├── services/     # API services
│       ├── store/        # Redux store and slices
│       ├── App.jsx       # Main App component
│       └── main.jsx      # Entry point
│
└── README.md             # Project documentation
```

## Available Scripts

### Backend
- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon

### Frontend
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Environment Variables

### Backend
- `PORT` - Port for the backend server (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation

## Deployment

### Backend
1. Set up a MongoDB Atlas cluster or use a managed MongoDB service
2. Update the `MONGODB_URI` in your production environment variables
3. Deploy to your preferred hosting platform (e.g., Heroku, Render, Railway)

### Frontend
1. Update the API base URL in `frontend/src/services/api.js` to point to your backend
2. Build the production version: `npm run build`
3. Deploy the `dist` folder to a static hosting service (e.g., Vercel, Netlify, GitHub Pages)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
