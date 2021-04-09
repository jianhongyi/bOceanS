'use strict'

/* global Exception, utils, CFG */
module.exports.authorize = async (ctx, next) => {
    ctx.userData = {}

  // headers
    const token = ctx.req.headers['token']
    if (token) {
        const tokenDecrypt = utils.aesDecrypt(token, CFG.key)
        console.log('token', tokenDecrypt)
        const userInfo = tokenDecrypt.split(',')
        ctx.userData.id = userInfo[0]
        ctx.userData.userName = userInfo[1]
    } else {
        console.log(ctx.request.url)
        if (!/login$|resetPassword$|\/h5\//.test(ctx.request.url)) {
            throw new Exception(1000)
        }
    }
    await next()
}
