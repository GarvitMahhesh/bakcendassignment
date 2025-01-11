import express from "express";
import morgan from "morgan";
import cors from "cors";
import userRoutes from './routes/user.route.js'
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swaggerConfig.js';

import connectDB from './Databse/userDB.js';
connectDB()

const app = express();
app.use(express.json());

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev")); 



app.use('/api', userRoutes);


export default app;
