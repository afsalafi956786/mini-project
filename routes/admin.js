const express = require('express');
const { response } = require('../app');
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.session.admin){
     productHelpers.getAllProducts().then((product)=>{
       res.render('admin/view-products',{admin:true,product})
    })
  }else{
    res.redirect('/adminLogin')
  }
   
});
router.get('/add-products',function(req,res){
  if(req.session.admin){
     res.render('admin/add-products',{adminAdd:true})
  }else{
    res.redirect('/adminLogin')
  }
})
router.post('/add-products',(req,res)=>{

  productHelpers.addProduct(req.body,(result)=>{
    res.render('admin/add-products',{adminAdd:true})
  })
})
router.get('/delete-product/:id',(req,res)=>{
  let proId=req.params.id
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin')
  })

})
router.get('/view-products/:id',async(req,res)=>{
  let product=await productHelpers.getProductDetails(req.params.id)
  res.redirect('admin/view-products',{product})
})
router.post('/view-products/:id',(req,res)=>{
  console.log(req.params.id,req.body);
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
  })
})

router.get('/view-users',(req,res)=>{
  if(req.session.admin){
    productHelpers.getAllusers().then((users)=>{
    res.render('admin/view-users',{users,adminUse:true})

  })
  }else{
    res.redirect('/adminLogin')
  }
})
router.get('/delete-user/:id',(req,res)=>{
  let userId=req.params.id
  productHelpers.deleteUser(userId).then((response)=>{
    res.redirect('/admin/view-users')
  })
})
router.get('/searchuser',(req,res)=>{
  const name=req.query.name
  if(name==''){
    res.redirect('/admin/view-users')
  }else{
      userHelpers.searchUser(name).then((users)=>{
    res.render('admin/view-users',{users,adminUse:true})

})
  }
})
router.get('/searchproduct',(req,res)=>{
  const names=req.query.name
  if(names==''){
    res.redirect('/admin')
  }else{
    productHelpers.productSearch(names).then((product)=>{
      res.render('admin/view-products',{product,admin:true})
    })
  }


})

module.exports = router;
