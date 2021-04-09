const debug = require('debug')('koa-weapp-demo')

/**
 * 响应处理模块
 */
module.exports = async function (ctx, next) {
    console.log('1:来到了response')
    try {
        // 调用下一个 middleware
        await next()

        // 处理响应结果
        // 如果直接写入在 body 中，则不作处理
        // 如果写在 ctx.body 为空，则使用 state 作为响应
        ctx.body = ctx.body ? ctx.body : {
            code: ctx.state.code !== undefined ? ctx.state.code : 200,
            data: ctx.state.data !== undefined ? ctx.state.data : {},
            tip: ctx.state.tip !== undefined ? ctx.state.tip : ''
        }
    } catch (e) {
        console.log('catch 住全局的错误信息')
        // catch 住全局的错误信息
        console.log('Catch Error: %o', e)
        debug('Catch Error: %o', e)

        // 设置状态码为 200 - 服务端错误
        ctx.status = 200

        // 输出详细的错误信息
        ctx.body = {
            code: -1,
            error: e && e.message ? e.message : e.toString()
        }
    }
}
