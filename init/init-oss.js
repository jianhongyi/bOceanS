const oss = require('ali-oss')

const aliOss = oss({
    accessKeyId: global.CFG.oss.accessKeyId,
    accessKeySecret: global.CFG.oss.accessKeySecret,
    bucket: global.CFG.oss.bucket,
    region: global.CFG.oss.region
})

module.exports = aliOss
