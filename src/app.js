/****** core modules import here *******/
import cors from "cors";
import express from "express";


/*******internal files import here *******/
import corsOptions from "./middlewares/cors.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import adminRoutes from './routes/adminRoutes/admin.routes.js';
import authRoutes from './routes/authroute/auth.routes.js';
import contactRoutes from "./routes/contactRoutes/contact.routes.js";
import healthRoutes from "./routes/health/health.route.js";
import instituteRoute from "./routes/instituteRoute/institute.route.js";
import stateRoute from './routes/stateRoute/state.routes.js';
import countryRoute from './routes/countryRoute/country.routes.js';
import userRoutes from './routes/userroute/user.routes.js';
import stateSystemRoute from './routes/stateSystemRoute/stateSystem.routes.js';
import credentialRoute from './routes/credentialRoute/credential.routes.js';
import divisionRoute from './routes/divisionRoute/division.routes.js';
import degreeRoute from './routes/degreeRoute/degree.routes.js';
import dataProviderRoute from './routes/dataProviderRoute/dataProvider.routes.js';
import statsRoute from './routes/statsRoute/stats.routes.js';
import lookupRoute from './routes/lookupRoute/lookup.routes.js';
import assignmentRoute from './routes/assignmentRoute/assignment.routes.js';


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


/********** Country Routes Define Here *********/
app.use("/api/v1", countryRoute);


/********** Contact Routes Define Here *********/
app.use("/api/v1", contactRoutes);


/********** Admin Routes Define Here *********/
app.use("/api/v1", adminRoutes);


/********** health check Routes Define Here *********/
app.use("/api/v1", healthRoutes);


/********** Institute Routes Define Here *********/
app.use("/api/v1", instituteRoute);


/********** State System Routes Define Here *********/
app.use("/api/v1", stateSystemRoute);


/********** Credential Routes Define Here *********/
app.use("/api/v1", credentialRoute);


/********** Division Routes Define Here *********/
app.use("/api/v1", divisionRoute);


/********** Degree Routes Define Here *********/
app.use("/api/v1", degreeRoute);


/********** Data Provider Routes Define Here *********/
app.use("/api/v1", dataProviderRoute);


/********** Stats Routes Define Here *********/
app.use("/api/v1", statsRoute);


/********** Lookup Routes Define Here *********/
app.use("/api/v1", lookupRoute);


/********** Assignment Routes Define Here *********/
app.use("/api/v1", assignmentRoute);


//global error handling middlewares
app.use(notFound);
app.use(errorHandler);


/******* Export the module ******/
export default app;
