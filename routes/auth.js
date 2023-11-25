const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  confirmEmail,
} = require('../controllers/auth');
const user = require("../model/user");
const router=express.Router();
const { protect } = require('../middleware/auth');

router.get('/login',(req,res)=>{
    res.render('./pages/Login');
})

router.post('/login',(req,res)=>{
    console.log(req.body);
    res.redirect('./welcome');
})

router.get('/registeruser',(req,res)=>{
    res.render('./pages/Register');
})

router.post('/registeruser',(req,res)=>{
    console.log(req.body);
    res.redirect('./login');
})

router.get('/resetPassword',(req,res)=>{
    res.render('./pages/forgotPassword'); 
})

router.post('/resetPassword',(req,res)=>{
    console.log(req.body);
    res.redirect('./login');
})


router.get('/welcome',(req,res)=>{
    res.render('./pages/Welcome'); 
})


module.exports=router;