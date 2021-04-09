module.exports = {
    1: {
        status: 500,
        msg: '未知错误'
    },
    2: {
        status: 400,
        msg: '参数错误'
    },
    3: {
        status: 500,
        msg: '请求超时'
    },
    4: {
        status: 429,
        msg: '请求过于频繁'
    },

  // 自定义非业务错误
    1000: {
        status: 401,
        msg: '未登录'
    },
    1001: {
        status: 400,
        msg: '邮箱格式错误'
    },
    1002: {
        status: 400,
        msg: '密码格式错误'
    },
    1003: {
        status: 500,
        msg: '文件上传失败'
    },
    1004: {
        status: 500,
        msg: '文件上传失败，文件丢失'
    },
    1005: {
        status: 500,
        msg: '文件格式错误'
    }

}
