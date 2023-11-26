const path = require('path');
const express = require('express');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/config.db');
require('dotenv').config()
const session = require('express-session');
const authHandler = require("./routes/auth")

const app=express();

// connection to the database
connectDB();

// for data urlencoded 
app.use(express.urlencoded({ extended: false }))

// to use template engine to render against a get request
app.set('view engine', 'ejs');

// to serve a static file like css js and img
app.use(express.static(path.join(__dirname, 'public')))

//Routes file
const auth = require('./routes/auth');
const home=require("./routes/home")
// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


// using routers here
app.use('',home)
app.use('/auth', auth);

app.use(errorHandler);

const server = app.listen(
    process.env.PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.yellow.bold
    )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(err);
});