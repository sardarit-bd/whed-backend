/****** core modules import here *******/
import cors from "cors";
import express from "express";


/*******internal files import here *******/
import corsOptions from "./middlewares/cors.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import adminRoutes from './routes//adminRoutes/admin.routes.js';
import authRoutes from './routes/authroute/auth.routes.js';
import contactRoutes from "./routes/contactRoutes/contact.routes.js";
import healthRoutes from "./routes/health/health.route.js";
import instituteRoute from "./routes/instituteRoute/institute.route.js";
import orderRoute from "./routes/orderRoute/order.route.js";
import userRoutes from './routes/userroute/user.routes.js';


/****** express app initilazation here *******/
const app = express();


/********* Body Data Parse **********/
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));


/*********** CORS  Middleware Here ***********/
app.use(cors(corsOptions));


/********** auth Routes Define Here *********/
app.use("/", authRoutes);


/********** user Routes Define Here *********/
app.use("/", userRoutes);



/********** Contact Routes Define Here *********/
app.use("/", contactRoutes);



/**************** Order Routes Define Here *********************/
app.use("/", orderRoute);



/********** Admin Routes Define Here *********/
app.use("/", adminRoutes);


/********** health check Routes Define Here *********/
app.use("/", healthRoutes);


/********** Institute Routes Define Here *********/
app.use("/", instituteRoute);


//global error handling middlewares
app.use(notFound);
app.use(errorHandler);


/******* Export the module ******/
export default app;
