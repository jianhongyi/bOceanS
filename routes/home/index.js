const Router = require('koa-router')
const router = new Router()
const ctrl = require('./controllers')

router.get('/getUsersList', ctrl.getUsersList) // 根据产品线获取用户列表

router.post('/login', ctrl.login) // 登录

router.post('/resetPassword', ctrl.resetPassword) // 重置密码

module.exports = router
