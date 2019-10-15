const User = require('../lib/mongo').User
const marked = require('marked')

// 将 post 的 content 从 markdown 转换成 html
User.plugin('contentToHtml', {
  afterFind: function (user) {
    return user.map(function (user) {
      user.bio = marked(user.bio)
      return user
    })
  },
  afterFindOne: function (user) {
    if (user) {
      user.bio = marked(user.bio)
    }
    return user
  }
})

module.exports = {
  // 注册一个用户
  create: function create (user) {
    return User.create(user).exec()
  },

  // 通过用户名获取用户信息
  getUserByName: function getUserByName (name) {
    return User
      .findOne({ name: name })
      .addCreatedAt()
      .exec()
  },
  getRawUserByName: function getRawUserByName (name) {
    return User
      .findOne({ name: name })
      // .populate({ path: 'name', model: 'User' })
      .exec()
  },
  //修改用户名和个人简介
  updateUserByName: function updateUserByName(name, data) {
    console.log("user=:"+name)
    return User.update({name: name},{$set:data}).exec()//这里的data怎么和数据库中的联系起来
  }
}
