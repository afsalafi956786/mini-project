const express = require('express');
const { Admin } = require('mongodb');
const { response } = require('../app');
const router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const { emailCheck } = require('../helpers/user-helpers');
const userHelpers=require('../helpers/user-helpers')
let user

/* GET home page. */
router.get('/', function(req, res, next) {
 
  productHelpers.getAllProducts().then((product)=>{
    if(req.session.loggedIn){
       user=req.session.user
       res.render('user/view-products',{product,user})
    }else{
      res.render('user/view-products',{product,user})
    }
  
  })
  })
  router.get('/login',(req,res)=>{
    if( req.session.loggedIn){
      res.redirect('/')
    }else{
       res.render('user/login',{"loginErr":req.session.loginErr})
       req.session.loginErr=false
    }
   
  })
  router.get('/signup',(req,res)=>{
    if( req.session.loggedIn){
      res.redirect('/')
    }else{
       res.render('user/signup')
    }
  })
  router.post('/signup',(req,res)=>{
    let email=req.body.email
    userHelpers.signEmailCheck(email).then((response)=>{
      if(response){
        res.render('user/signup',{signErr:'This email already existed !'})
      }else{
        userHelpers.doSignup(req.body).then((response)=>{
      req.session.loggedIn=true
      req.session.user=response
      res.redirect('/')

    })
      }

    })
    
  })
  router.post('/login',(req,res)=>{
    userHelpers.doLogin(req.body).then((response)=>{
      if(response.status){
        req.session.loggedIn=true
        req.session.user=response.user

        res.redirect('/')
      }else{
        req.session.loginErr=true
        res.redirect('/login')
      }
    })
    
  })


router.get('/logout',(req,res)=>{
  req.session.loggedIn=false;
  user=null;
  res.redirect('/login')

})

module.exports = router;
