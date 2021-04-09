const path = require('path')
const errors = require('../common/errors')

/* global CFG, axios */

// uncaught error handler
process.on('unhandledRejection', (err, promise) => {
    console.log(`unhandledRejection: `, err)
})
process.on('uncaughtException', (err) => {
    console.log(`uncaughtException: `, err)
})

function addGlobalConst (name, value) {
    Object.defineProperty(global, name, {
        value: value
    })
}

addGlobalConst('addGlobalConst', addGlobalConst)

addGlobalConst('ROOT_DIR', path.resolve())
addGlobalConst('Op', require('sequelize').Op)

class Exception extends Error {
    constructor (code, msg) {
        let errMsg, status
        let errCode = code || 1 // 默认 code = 1
        if (errors[errCode]) {
            errMsg = msg || errors[code].msg
            status = errors[code].status
        } else {
            errMsg = '未知错误'
            status = 500
        }

        super(errMsg)

        this.code = errCode
        this.msg = errMsg
        this.status = status
    }
}

addGlobalConst('Exception', Exception)

addGlobalConst('CFG', require('../config'))
addGlobalConst('_', require('lodash'))
addGlobalConst('Promise', require('bluebird'))
addGlobalConst('axios', require('axios'))
addGlobalConst('Joi', require('joi'))

// addGlobalConst('Redis', require('ioredis'))

/*******************************************/
//                                         //
//                  xxx                    //
//                                         //
/*******************************************/
const initDb = require('./init-db')
// const initRedis = require('./init-redis')
addGlobalConst('utils', require('./init-utils'))

module.exports = async () => {
    // addGlobalConst('aliOss', require('./init-oss'))

    let API = axios.create({
        headers: {
            'x-service': CFG.serviceName
        }
    }) // 请求头添加 x-service
    API.interceptors.response.use(function (response) {
        if (/^application\/json/i.test(response.headers['content-type'])) {
            if (response.data.code === 0) {
                return response.data.data // unwrap data
            } else {
                return Promise.reject(response) // code !== 0 视作失败
            }
        }
        return response
    })
    addGlobalConst('API', API)

    await initDb({
        checkConnection: true,
        dbConfig: CFG.db
    })

    // await initRedis({
    //     checkConnection: true,
    //     clientGlobalName: 'redis',
    //     subscriberGlobalName: 'redisSub',
    //     redisConfig: Object.assign(CFG.cache, {
    //         keyPrefix: `${CFG.serviceName}:`
    //     })
    // })
}
