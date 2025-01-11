import express from "express";
import morgan from "morgan";
import cors from "cors";
import userRoutes from './routes/user.route.js';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swaggerConfig.js';
import connectDB from './Databse/userDB.js';

// Connect to the database
connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Serve Swagger UI at the root ("/")
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware for parsing URL-encoded data and cookies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS setup
app.use(cors());

// Logging middleware
app.use(morgan("dev"));

// API routes prefixed with "/api"
app.use('/api', userRoutes);

// Export the app
export default app;
