const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const Classify = require('../models/classify')
router.post('/list',(req,res)=>{
  Product.find({}).exec((err,productList)=>{
    err ? res.status(400).json({desc: err.message}) : res.json({count:productList.length , list:productList})
  })
})

//精品推荐
router.get('/selected',(req,res)=>{
  Product.find({isSelected:true}).exec((err,productList)=>{
    err ? res.status(400).json({desc: err.message}) : res.json({count:productList.length , list:productList})
  })
})

//热卖
router.get('/billboard',(req,res)=>{
  Product.find({isSelected:true}).exec((err,productList)=>{
    err ? res.status(400).json({desc: err.message}) : res.json({count:productList.length , list:productList})
  })
})


//新增商品
router.post('/add', async (req,res)=>{
  let _product = new Product(req.body)
  let classifyId = _product.classify
  _product.isNew = true

  _product.save((err)=>{
    err ? res.status(400).json({desc: err.message}) : res.json({ desc: '新增成功'})
  })
  Classify.findById(classifyId, (err, classify) => {
    if (err) console.log(err);
    if(!classifyId) throw 'addressId error'
    if (classify.productList.indexOf(_product._id) > -1) {
        return
    } else {
        classify.productList.push(_product._id);
    }
    classify.save(err => {
      if (err) console.log(err);
    });
  });
})


router.put('/update', async (req,res)=>{
  try{
    let product = await Product.findById(req.body._id)

    if(!product) throw 'productId error'
    let _product = Object.assign(product,{
      name: req.body.name,
      image: req.body.image,
      price: req.body.price,
      amount: req.body.amount,
      desc: req.body.desc,
      status:req.body.status,
      isSelected: req.body.isSelected,
      isBillboard: req.body.isBillboard,
      classify: req.body.classify,
    })
    
    if(req.body.classify !== product.classify){
      //新classify中加入product
      Classify.findById(req.body.classify, (err, classify) => {
        if (err) console.log(err);
        if(!req.body.classify) throw 'addressId error'
        if (classify.productList.indexOf(_product._id) > -1) {
            return
        } else {
            classify.productList.push(_product._id);
        }
        classify.save(err => {
          if (err) console.log(err);
        });
      });
      // 删除旧classify中product
      Classify.findOne({"productList": _product._id}, (err, classify) => {
        if (err) console.log(err);
        if (classify && classify.productList.length > 0) {
            classify.productList.map((e, i) => {
                if (e.toString() === _product._id.toString()) {
                    classify.productList.splice(i, 1)
                }
            });
            classify.save(err => {
              if (err) console.log(err);
              console.log('保存成功');
            });
        }
      })
    }
    
    _product.save(err=>{
      err ? res.status(400).json({ desc: '更新失败'}) :  res.json({ desc: '更新成功' })
    })
  }catch (err){
    res.stauts(500).json({ desc: err ||'系统错误'})
  }
})

module.exports = router