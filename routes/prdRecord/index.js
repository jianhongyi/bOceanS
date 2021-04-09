const Router = require('koa-router')
const router = new Router()
const ctrl = require('./controllers')

router.post('/creatProd', ctrl.creatProd) // 创建一个产品

router.get('/getProdList', ctrl.getProdList) // 根据产品线获取对应的产品

router.get('/getRecordList', ctrl.getRecordList) // 根据产品id获取产品版本列表

router.post('/saveRecord', ctrl.saveRecord) // 根据产品id保存一个新的产品版本

router.post('/uploadPic', ctrl.uploadPic) // 更新UI地址

router.post('/updateIsFiled', ctrl.updateIsFiled) // 更新文件的 isFiled 是否归档

module.exports = router

