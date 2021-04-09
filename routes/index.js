/**
 * ajax 服务路由集合
 */
const Index = require('koa-router')
const auth = require('../middlewares/auth')
const router = new Index()
/* global Exception */
const onAdress = async function (ctx) {
    throw new Exception(1006)
}

// 校验token
router.use(auth.authorize)

router.use('/blueOcean', require('./home').routes())
router.use('/blueOcean/record', require('./prdRecord').routes())

module.exports = router

