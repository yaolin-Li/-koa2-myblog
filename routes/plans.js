const express = require('express')
const router = express.Router()
const PlanModel = require('../models/plans')
const checkLogin = require('../middlewares/check').checkLogin


router.get('/', function (req, res, next) {
    const author = req.query.author

    PlanModel.getPlan(author)
    .then(function (plans) {
        res.render('plans', {
            plans: plans
        })
    })
})
router.get('/create', checkLogin, function (req, res, next) {
    res.render('createPlan')
})
router.post('/create', checkLogin, function (req, res, next) {
    const author = req.session.user._id
    const title = req.fields.title
    const content = req.fields.content
    const time = req.fields.time
    try {
        if (!title.length) {
          throw new Error('请填写标题')
        }
        if (!content.length) {
          throw new Error('请填写内容')
        }
        if (!content.length) {
            throw new Error('请填写完成时间')
        }
    } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
    }
    let plan = {
        author: author,
        title: title,
        time: time,
        content:content
    }
    PlanModel.create(plan)
    .then(function (result){
        plan = result.ops[0]
        req.flash('success','发表成功')
        res.redirect('/plans/${plan._id}')
    })
    .catch(next)
})
router.get('/:planId', function (req, res, next) {
    const planId = req.params.planId

    Promise.all([
        PlanModel.getPlanById(planId),
        PlanModel.incPv(planId)
    ])
    .then(function (result) {
        const plan = result[0]
        if(!plan) {
            throw new Error('该计划不存在')
        }
        res.render('plan', {
            plan: plan
        })
    })
    .catch(next)
})
router.get('/:planId/edit', checkLogin, function (req, res, next) {
    res.send('更新计划页')
})
router.post('/:planId/edit', checkLogin, function (req, res, next) {
    res.send('更新计划')
})
router.get(':planId/remove', checkLogin, function (req, res, next) {
    res.send('删除计划')
})
module.exports = router
