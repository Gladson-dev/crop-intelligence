// Load environment variables first
import dotenv from 'dotenv';
dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env' });

// Check for required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  console.error('Please check your .env file or deployment configuration.');
  process.exit(1);
}
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import zoneRoutes from './routes/zones.js';
import imageRoutes from './routes/images.js';
import AppError from './utils/appError.js';
import globalErrorHandler from './middleware/error.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  whitelist: []
}));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
  'http://localhost:5173',  // Add Vite dev server
  'http://127.0.0.1:5173'   // Add Vite dev server alternative
];

// CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Always allow preflight requests
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.status(200).end();
  }
  
  // Check origin for non-OPTIONS requests
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Expose-Headers', 'x-auth-token');
  } else if (origin) {
    console.warn(`Blocked request from origin: ${origin}`);
    return res.status(403).json({ error: 'Not allowed by CORS' });
  }
  
  next();
});

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Body:', req.body);
  }
  next();
});

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Body:', req.body);
  }
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Configure uploads directory
import { existsSync, mkdirSync } from 'fs';
import { tmpdir } from 'os';

let uploadsDir;
try {
  // Try to use project directory first
  uploadsDir = path.join(process.cwd(), 'uploads');
  if (!existsSync(uploadsDir)) {
    console.log(`Creating uploads directory at: ${uploadsDir}`);
    mkdirSync(uploadsDir, { recursive: true });
  }
  console.log(`Serving static files from: ${uploadsDir}`);
} catch (error) {
  // Fallback to system temp directory if needed
  console.error('Error setting up uploads directory:', error);
  uploadsDir = path.join(tmpdir(), 'crop-intelligence-uploads');
  console.warn(`Falling back to temp directory: ${uploadsDir}`);
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }
}

// Make uploads directory available to other modules
process.env.UPLOAD_DIR = uploadsDir;
app.use('/uploads', express.static(uploadsDir));

// MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  retryWrites: true,
  w: 'majority'
};

// Connect to MongoDB with retry logic
const connectDB = async () => {
  const maxRetries = 5;
  let retryCount = 0;
  const retryDelay = 3000; // 3 seconds

  // Enhanced MongoDB options
  const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
    retryWrites: true,
    w: 'majority'
  };

  while (retryCount < maxRetries) {
    try {
      console.log(`🔌 Attempting to connect to MongoDB (Attempt ${retryCount + 1}/${maxRetries})...`);
      
      await mongoose.connect(process.env.MONGODB_URI, mongoOptions);
      
      // Connection events
      mongoose.connection.on('connected', () => {
        console.log('✅ MongoDB connected successfully');
      });
      
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err.message);
      });
      
      mongoose.connection.on('disconnected', () => {
        console.log('ℹ️  MongoDB disconnected');
      });
      
      console.log('✅ MongoDB connected successfully');
      return true;
      
    } catch (error) {
      retryCount++;
      console.error(`❌ MongoDB Connection Error (Attempt ${retryCount}/${maxRetries}): ${error.message}`);
      
      if (retryCount === maxRetries) {
        console.error('\n💡 Troubleshooting Tips:'.yellow);
        console.log('1. Make sure MongoDB is running'.yellow);
        console.log('2. Check if the connection string is correct'.yellow);
        console.log('3. Verify your network connection'.yellow);
        console.log('4. If using MongoDB Atlas, check if your IP is whitelisted'.yellow);
        console.log('5. Try restarting the MongoDB service'.yellow);
        
        console.log('\nFor local MongoDB:'.blue);
        console.log('- Install MongoDB: https://www.mongodb.com/try/download/community'.blue);
        console.log('- Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas/register\n'.blue);
        
        throw new Error('Failed to connect to MongoDB after multiple attempts');
      }
      
      // Wait before retrying
      console.log(`⏳ Retrying in ${retryDelay/1000} seconds...\n`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Prevent parameter pollution
app.use(hpp({
  whitelist: []
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/images', imageRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Server Error' : err.message
  });
});

// 404 handler
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handling middleware
app.use(globalErrorHandler);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    console.log('🚀 Starting server...');
    console.log('Environment:', process.env.NODE_ENV || 'development');
    
    // Connect to MongoDB
    await connectDB();
    
    // Start the server
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 Access URLs:`);
      console.log(`   Local: http://localhost:${PORT}`);
      console.log(`   Network: http://${os.hostname()}:${PORT}`);
      console.log(`   Health check: http://localhost:${PORT}/api/health`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('❌ UNHANDLED REJECTION! Shutting down...');
      console.error(err);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
      console.error(err);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle SIGTERM for graceful shutdown
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
      server.close(() => {
        console.log('💥 Process terminated!');
      });
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

// Start the application
startServer().catch(err => {
  console.error('FATAL ERROR:', err);
  process.exit(1);
});
