const express =require("express");
const homeRouter=express.Router();

homeRouter.get('/', (req, res) => {
    res.status(200).render('./pages/Home', { title: 'Home' })
})

module.exports=homeRouter;