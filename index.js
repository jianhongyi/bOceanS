const init = require('./init')
const createApp = require('./app')

async function start () {
    try {
        await init()
        console.log('Init success')

    // 一切就绪，最后启动服务
        const app = createApp()
        /* global CFG */
        app.listen(CFG.port)
        console.log(`Listening on port ${CFG.port}`)
    } catch (e) {
        console.trace('初始化app失败', e)
        process.exit(1)
    }
}

start()
