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


router.get('/registeruser',(req,res)=>{
    res.render('./pages/Register');
})

router.post('/registeruser',register)

router.get('/login',(req,res)=>{
    res.render('./pages/Login');
})

router.post('/login',login)

router.get('/resetPassword',(req,res)=>{
    res.render('./pages/forgotPassword'); 
})

router.post('/resetPassword',forgotPassword)


router.get('/welcome', protect, getMe)

router.get('/me');
router.get('/confirmemail', confirmEmail);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', );
router.put('/resetpassword/:resettoken', resetPassword);


module.exports=router;