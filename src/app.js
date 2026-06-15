/****** core modules import here *******/
import cors from "cors";
import express from "express";


/*******internal files import here *******/
import corsOptions from "./middlewares/cors.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import assignmentRoute from './routes/assignmentRoute/assignment.routes.js';
import authRoutes from './routes/authroute/auth.routes.js';
import contactRoutes from "./routes/contactRoutes/contact.routes.js";
import countryRoute from './routes/countryRoute/country.routes.js';
import credentialRoute from './routes/credentialRoute/credential.routes.js';
import dataProviderRoute from './routes/dataProviderRoute/dataProvider.routes.js';
import degreeRoute from './routes/degreeRoute/degree.routes.js';
import divisionRoute from './routes/divisionRoute/division.routes.js';
import educationSystem from './routes/educationSystemRoute/educationSystem.routes.js';
import healthRoutes from "./routes/health/health.route.js";
import instituteRoute from "./routes/instituteRoute/institute.route.js";
import lookupRoute from './routes/lookupRoute/lookup.routes.js';
import stateRoute from './routes/stateRoute/state.routes.js';
import userRoutes from './routes/userroute/user.routes.js';


/****** express app initilazation here *******/
const app = express();


/********* Body Data Parse **********/
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));



/*********** CORS  Middleware Here ***********/
app.use(cors(corsOptions));



/********** auth Routes Define Here *********/
app.use("/api/v1", authRoutes);



/********** user Routes Define Here *********/
app.use("/api/v1", userRoutes);



/********** State Routes Define Here *********/
app.use("/api/v1", stateRoute);



/********** State System Routes Define Here *********/
app.use("/api/v1", educationSystem);



/********** Credential Routes Define Here *********/
app.use("/api/v1", credentialRoute);



/********** Institute Routes Define Here *********/
app.use("/api/v1", instituteRoute);



/********** Division Routes Define Here *********/
app.use("/api/v1", divisionRoute);



/********** Degree Routes Define Here *********/
app.use("/api/v1", degreeRoute);



/********** Data Provider Routes Define Here *********/
app.use("/api/v1", dataProviderRoute);



/********** Lookup Routes Define Here *********/
app.use("/api/v1", lookupRoute);



/********** Assignment Routes Define Here *********/
app.use("/api/v1", assignmentRoute);



/********** Country Routes Define Here *********/
app.use("/api/v1", countryRoute);



/********** Contact Routes Define Here *********/
app.use("/api/v1", contactRoutes);



/********** health check Routes Define Here *********/
app.use("/api/v1", healthRoutes);





//global error handling middlewares
app.use(notFound);
app.use(errorHandler);


/******* Export the module ******/
export default app;
