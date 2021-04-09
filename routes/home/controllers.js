'use strict'
const service = require('./service')
/* global utils */

/**
 * @api {POST} 登录
 * req: {user_name, password}
 */
module.exports.login = async ctx => {
    console.log('登录，',ctx.request.body)
    let [Data, err] = await service.login(ctx.request.body)
    if (Data) {
        const tokenEncrypt = Data.id + ',' + Data.user_name + ',' + new Date().getTime()
        console.log('准备对称加密', tokenEncrypt)
        const token = utils.aesEncrypt(tokenEncrypt, CFG.key)
        let req = {
            userName: Data.user_name,
            userNameCn: Data.user_name_cn,
            jurisdiction: Data.jurisdiction,
            userId: Data.id,
            typeName: Data.type_name,
            lineList: Data.line_list,
            token: token
        }
        ctx.state.data = req
    }else{
        ctx.state.code = '10000'
        ctx.state.data = err
        ctx.state.tip = '账号或密码错误'
    }

}
/**
 * @api {POST} 重置密码
 * req: {user_name, password, new_password}
 */

module.exports.resetPassword = async ctx => {
    console.log('登录，',ctx.request.body)
    const params = ctx.request.body
    let [resData, err] = await service.resetPassword(params)
    console.log(resData)
    if (resData === 1) {
        ctx.request.body.password = ctx.request.body.new_password
        await this.login(ctx)
    }else if(resData === 0){
        ctx.state.code = '10000'
        ctx.state.tip = '重置失败,旧密码错误或新密码和旧密码相同'
    }else{
        utils.serverErrTip(ctx, err)
    }

}

/**
 * @api {get} 获取用户列表
 * req: {line_type:产品线id}
 */
module.exports.getUsersList = async ctx => {
    let req = utils.analysisParams(ctx.request.url)
    let [Data, err] = await service.getUsersList(req)
    if (Data) {
        ctx.state.data = Data
    }else{
        utils.serverErrTip(ctx, err)
    }
}
