const express = require('express')
const router = express.Router()
const Classify = require('../models/classify')

router.post('/list',(req,res)=>{
  Classify.find({}).populate({path: 'productList', select: 'name image price'}).exec((err,classifyList)=>{
    if(err) res.status(400).json({desc: err.message})
    res.json({count:classifyList.length , list:classifyList})
  })
})

router.post('/add', (req,res)=>{
  let _classify = new Classify(req.body)
  _classify.isNew = true
  _classify.save((err)=>{
    if(err) res.status(400).json({desc: err.message})
    
    res.json({ desc: '新增成功'})
  })
})

router.put('/update', async (req,res)=>{
  try{
    let classify = await Classify.findById(req.body._id)
    if(!classify) throw 'classifyId error'
    let _classify = Object.assign(classify,{
      name: req.body.name,
      image: req.body.image,
      desc: req.body.desc,
      status:req.body.status
    })
    _classify.save(err=>{
      err ? res.status(400).json({ desc: '更新失败'}) :  res.json({ desc: '更新成功' })
    })

  }catch (err){
    res.stauts(500).json({ desc: err ||'系统错误'})
  }
})

module.exports = router