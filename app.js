const express = require("express");
const app = express();
require('dotenv').config()
const fs = require('fs');
const path = require('path');
const morgan = require("morgan")
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
const mongoose = require("mongoose");
const session = require('express-session');
const authHandler=require("./routes/auth")

app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.urlencoded({ extended: false }))

mongoose.connect(process.env.MONOGB_URL)
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch((err) => console.error(err))

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.set('view engine','ejs');


app.get('/',(req,res)=>{
    res.status(200).render('./pages/Home',{title:'Home'})
})

app.use(authHandler);


app.listen(process.env.PORT, () => {
    console.log("blog-managment-system server is on");
})