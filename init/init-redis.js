/* global _,addGlobalConst, Redis */
module.exports = (options) => {
    if (!_.isObject(options)) {
        throw new Error('options 参数缺失')
    }
    if (!_.isObject(options.redisConfig)) {
        throw new Error('options.redisConfig 参数缺失')
    }
    const redisConfig = options.redisConfig
    let clientGlobalName = 'redis'
    if (options && options.clientGlobalName) {
        clientGlobalName = options.clientGlobalName
    }

    if (options && options.subscriberGlobalName) {
        const redisSub = new Redis(redisConfig)
        addGlobalConst(options.subscriberGlobalName, redisSub)
    }

    const redisClient = new Redis(redisConfig)
    addGlobalConst(clientGlobalName, redisClient)

    return new Promise((resolve, reject) => {
        function redisError (err) {
            console.error('redis error', err)
        }

        function connectFail (err) {
            console.error('init redis fail', err)
            redisClient.on('error', redisError)

            if (options && options.checkConnection) {
                reject(err)
            } else {
                resolve()
            }
        }

        function connectSuccess () {
            console.log('Redis connected.')
            redisClient.removeListener('error', connectFail)
        .on('error', redisError)

            resolve()
        }

        redisClient.once('ready', connectSuccess)
      .once('error', connectFail)
    })
}
