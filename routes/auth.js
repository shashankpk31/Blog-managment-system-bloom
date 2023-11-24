const express =require("express");
const user = require("../model/user");
const router=express.Router();

router.get('/login',(req,res)=>{
    res.render('./pages/login');
})

router.post('/login',(req,res)=>{
    
})

router.get('/registeruser',(req,res)=>{
    res.render('./pages/Register');
})

router.post('/registeruser',(req,res)=>{
    const newUser=new user(req.body);
    newUser.save();
    req.body={};
    res.redirect('./login');
})

module.exports=router;