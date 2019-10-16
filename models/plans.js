const marked = require('marked')
const Plan = require('../lib/mongo').Plan

// 给 post 添加留言数 commentsCount
Plan.plugin('addCommentsCount', {
    afterFind: function (plans) {
      return Promise.all(plans.map(function (plan) {
        return CommentModel.getCommentsCount(plan._id).then(function (commentsCount) {
          plan.commentsCount = commentsCount
          return plan
        })
      }))
    },
    afterFindOne: function (plan) {
      if (plan) {
        return CommentModel.getCommentsCount(plan._id).then(function (count) {
          plan.commentsCount = count
          return plan
        })
      }
      return plan
    }
  })
// 将 comment 的 content 从 markdown 转换成 html
Plan.plugin('contentToHtml', {
    afterFind: function (plan) {
      return plan.map(function (plan) {
        plan.content = marked(plan.content)
        return plan
      })
    },
    afterFindOne: function (plan) {
        if (plan) {
            plan.content = marked(plan.content)
        }
        return plan
    }
})

module.exports = {
    create: function create(plan) {
        return Plan.create(plan).exec()
    },
    getPlanById: function getPlanById (planId) {
        return Plan
          .findOne({ _id: planId })
          .populate({ path: 'author', model: 'User' })
          .addCreatedAt()
          .addCommentsCount()
          .contentToHtml()
          .exec()
      },
    getPlan: function getPlan(author) {
        const query = {}
        if(author){
            query.author = author
        }
        return Plan
        .find(query)
        .populate({ path: 'author', model: 'User' })
        .sort({_id: -1})
        .addCreatedAt()
        .contentToHtml()
        .exec()
    },
    // 通过文章 id 给 pv 加 1
    incPv: function incPv (planId) {
        return Plan
        .update({ _id: planId }, { $inc: { pv: 1 } })
        .exec()
    },
    getRawPostById: function getRawPostById(planId) {
        return Plan
        .findOne({_id: planId})
        .populate({path: 'author', model: 'User'})
        .exec()
    },
    updatePlanById: function updatePlanById (planId, data) {
        return Plan.update({_id: planId}, {$set: data}).exec()
    },
    delPlanById: function delPlanById (planId) {
        return Plan.deleteOne({_id: planId}).exec()
    }
}