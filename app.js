const Koa = require('koa')
const app = new Koa()
const cors = require('@koa/cors')
const moment = require('moment')
const debug = require('debug')('koa-weapp-demo')
const response = require('./middlewares/response')
const validator = require('koa-validator-joi')
const bodyParser = require('koa-bodyparser')

/* global _, Exception */

module.exports = () => {
    app.proxy = true

  // 第一个中间件，确保所有错误都能捕获
    app.use(async (ctx, next) => {
        try {
            let startTime = new Date()
            ctx.reqId = moment(startTime).format('YYYYMMDD_HHmm_ssSSS') + '-' + _.padStart(_.random(0, 0xffffffff).toString(16), 8, 0)

            await next()

            if (ctx.body === undefined && ctx.data !== undefined) {
                ctx.body = {
                    reqId: ctx.reqId,
                    code: 0,
                    data: ctx.data
                }
            }
            let endTime = new Date()
            if (ctx.path !== '/healthCheck') {
                console.log(ctx.method, ctx.path, ctx.status, `- ${endTime - startTime} ms`)
            }
        } catch (e) {
            console.error(e)
            if (e instanceof Exception) { // 有准备的已知错误
                ctx.status = e.status
                ctx.body = {
                    reqId: ctx.reqId,
                    code: e.code,
                    msg: e.msg
                }
            } else if (e.isJoi) { // joi 参数验证错误
                ctx.status = 400
                ctx.body = {
                    reqId: ctx.reqId,
                    code: 2,
                    msg: '参数错误',
                    joi: e.message
                }
            } else { // 未知错误
                ctx.status = 500
                ctx.body = {
                    reqId: ctx.reqId,
                    code: 1,
                    msg: '未知错误'
                }
                debug('Failed 未知错误')
            }
            if (process.env.NODE_ENV !== 'production' && e) {
                ctx.body.stack = e.stack // 调用栈返给前端
            }
        }
    })

    //allow custom header and CORS
    app.use(cors())

    // 解析请求体
    app.use(bodyParser())
    app.use(validator())

    // 使用响应处理中间件
    app.use(response)

    // 引入路由分发
    const router = require('./routes/index') // 因为CFG还没准备好，所以要动态加载，不要放在文件顶部
    app.use(router.routes())
    app.use(router.allowedMethods())


    return app
}
