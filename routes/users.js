const express = require('express');
const router = express.Router();
const User = require('../models/users');

//登陆
router.post('/login',(req,res)=>{
  let _user = req.body
  User.findOne({name:_user.name},(err,user)=>{
    if (err) console.log(err);
    if(!user){
      res.statusCode = 400;
      res.json({desc: '用户不存在，去注册吧'});
    }else{
      user.comparePassword(_user.password,(err,isMatch)=>{
        if (err) console.log(err);
        if(isMatch){
          // req.session.user = user;
          res.statusCode = 200;
          res.json({desc: '登录成功',data:user});
        }else{
          res.statusCode = 400;
          res.json({desc: '登录失败，密码可能错误，请重新登录'});
        }
      })

    }
  })
})
// 注册接口
router.post('/register', (req, res) => {
  let userObj = req.body;
  console.log(userObj.name)
  User.findOne({name: userObj.name}, (err, user) => {
      if (err) console.log(err);
      if (user) {
          res.json({code: 403, desc: '账号存在，请重新注册或去登录'});
      } else {
          let _user = new User(userObj);
          _user.firstSave = true;
          _user.save((err) => {
              if (err) console.log(err);
              res.json({code: 200, desc: '注册成功，去登录吧'});
          })
      }
  })
});

module.exports = router;
