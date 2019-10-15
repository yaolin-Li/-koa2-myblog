const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/check').checkLogin
const UserModel = require('../models/users')

// GET /posts/:postId/edit 更新文章页
router.get('/', checkLogin, function (req, res, next) {
    const name = req.session.user.name
    UserModel.getRawUserByName(name)
      .then(function (user) {
        if (!name) {
          throw new Error('该用户不存在')
        }
        res.render('personInfo', {
          user: user
        })
      })
      .catch(next)
  })
  
  
router.post('/',checkLogin, function (req, res, next) {
    const name = req.fields.name
    console.log("2=:"+name)
    const bio = req.fields.bio
    try {
        if (!(bio.length >= 1 && bio.length <= 100)) {
          throw new Error('个人签名请限制在 1-100 个字符')
        }
    } catch (e) {
    // 注册失败，异步删除上传的头像
    req.flash('error', e.message)
    return res.redirect('/personInfo')
    }

    UserModel.getRawUserByName(name)
    .then(function(user) {
        if(!user){
            throw new Error('用户不存在')
        }
        UserModel.updateUserByName(name,{bio: bio})
        .then(function(){
            req.flash('success','编辑用户信息成功')
            res.redirect('/posts')
        })
        .catch(next)
    })
})

module.exports = router