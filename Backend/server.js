import express from "express";
import cors from "cors";
import helmet from "helmet";
import {limiter} from "./middleware/rateLimiter.js";


import apiRoutes from './routes/index.js';
import {errorHandler} from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(helmet());

// app.use(cors());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true                
}));

app.use(express.json());
app.use(cookieParser());

// limit to the access
app.use(limiter);

// API Versioning
app.use('/api/v1/auth', apiRoutes);

// middleware errorhandle
app.use(errorHandler);

const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
