import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import routes from '../routes/index.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const expressLoader = async ({ app }) => {
  // 1. Enable Cross-Origin Resource Sharing (CORS)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true                
}));

  // 2. Built-in Express middleware for parsing json and urlencoded data
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
  app.use('/uploads/avatars', express.static(path.join(__dirname, '../../uploads/avatars')));

  // 3. Basic Security: Rate Limiting to prevent brute-force attacks
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  // 4. Base Check Route
  app.get('/status', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Backend Server is healthy!' });
  });

  // 5. Connect your API Routes
  app.use('/api/v1', routes);

  // 6. Global Error Handling Middleware
  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  });

  return app;
};

export default expressLoader;