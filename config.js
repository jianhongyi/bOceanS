const CONF = {
    port: '5761',
    serviceName: 'blue-ocean',
    rootPathname: '',

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */

    db: {
        'database': 'blue-ocean',
        'user': 'root',
        'password': 'root',
        'options': {
            'host': '129.0.4.41',
            'port': 31116,
            'dialect': 'mysql',
            'char': 'utf8mb4',
            pool: {
                max: 5,
                min: 0,
                idle: 20000,
                acquire: 20000
            }
        }
    },
 
    oss: {
        accessKeyId: '',
        accessKeySecret: '',
        bucket: '',
        region: ''
    },

    // 对称加密常量
    key: 'pliangwei'
}

module.exports = CONF
