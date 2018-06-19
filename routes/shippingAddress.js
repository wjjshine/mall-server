const express = require('express')
const router = express.Router()
const ShippingAddress = require('../models/shippingAddress')
const User = require('../models/users')

router.get('/list/:id',(req,res)=>{
  const userId = req.params.id;
  ShippingAddress.find({ofUser: userId}).populate({path: 'shippingAddress'}).sort({'set':-1}).exec((err, shippingAddress) => {
    if (err) {
      res.status(400).json({desc: err.message});
    } else {
      res.json({count:shippingAddress.length, list: shippingAddress});
    }
  })
})

router.post('/add', async (req,res)=>{
  let _address = new ShippingAddress(req.body)
  let userId = req.body.ofUser
  try{
    let user = await User.findById(userId)
    if(user.shippingAddress.length == 0) _address.isDefault = true

    user.shippingAddress.push(_address._id)
    let _user = Object.assign(user, {firstSave: false});
    _user.save();
    _address.save((err)=>{
      if(err) {
        res.status(400).json({desc: '新增失败'})
      }else{
        res.json({ desc: '新增成功' ,data:_address})
      }
    })
  } catch(err){
    res.status(500).send({ desc: '系统错误'})
  }

})

router.put('/update', async (req,res)=>{
  try{
    let address = await ShippingAddress.findById(req.body._id)
    if(!address) throw 'addressId error'
    let _address = Object.assign(address,{
      name: req.body.name,
      tel: req.body.tel,
      address: req.body.address,
      ofUser: req.body.ofUser,
      preAddress: req.body.preAddress,
    })
    _address.save(err=>{
      err ? res.status(400).json({ desc: '更新失败'}) :  res.json({ desc: '更新成功' })
    })

  }catch (err){
    res.stauts(500).json({ desc: err ||'系统错误'})
  }
})

router.delete('/delete/:userId/:addressId',async (req,res)=>{
  const addressId = req.params.addressId
  const userId = req.params.userId

  try{
    if(!addressId || !userId) throw 'addressId || userId error'
    let user = await User.findOne({ _id: userId })
    if(!user) throw 'user error'
    let index = user.shippingAddress.indexOf(addressId)
    user.shippingAddress.splice(index,1)
    user.save(err=>{
      if(err) console.log(err)
      ShippingAddress.remove({_id:addressId}, err=>{
        if(err){
          res.status(400).json({ desc: '删除失败'})
        }else{
          res.json({ desc: '删除成功'})
        }
      })
    })
  }catch(err){
    res.status(500).json({ desc: err||'系统错误'})
  }
})

module.exports = router;