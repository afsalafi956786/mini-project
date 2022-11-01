const express = require('express');
const { response } = require('../app');
const productHelpers = require('../helpers/product-helpers');
const router = express.Router();



router.get('/',(req,res,next)=>{
    if(req.session.admin){
        res.redirect('/admin')
    
    }else{
        res.render('admin/adminLogin',{title:'adminLogin',adminLog:true,})

    }
    
  })

  router.post('/',(req,res)=>{
    req.session.adminErr=false
    const dbEmail='afsalafi@test.com';
    const dbPass='12345';
    const {email,password}=req.body;
    console.log(email,password);

    if(req.body.email=="" && req.body.password==""){
      res.render('admin/adminLogin',{adminLog:true,emailErr:'Email required',passErr:'password required'})
    }
    else if (email===dbEmail && password===dbPass){
        req.session.admin=true
        res.redirect('/admin')
    }else{ 
       res.render('admin/adminLogin',{title:'adminLogin',adminLog:true,emailError:'Invalid Email',passError:"Invalid password"}) 
    }
  })
  router.get('/adminLogout',(req,res)=>{
    req.session.admin=false;
    res.redirect('/adminLogin')
  })

  module.exports = router;
  