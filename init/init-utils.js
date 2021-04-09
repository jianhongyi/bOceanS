const mime = require('mime')
const moment = require('moment')
const CryptoJS = require("crypto-js")
const multiparty = require('multiparty')
const exec = require('child_process').exec; 
const nodemailer = require("nodemailer");
const fs = require('fs');
const savePath = '/mnt/www'
// const savePath = '/Users/pengliangwei/Downloads/www'
const visitUrl = 'http://blue-ocean.digtalk.unischool.cn/www'
const emailCotentUrl = 'http://blue-ocean.digtalk.unischool.cn/product'

const utils = {}
utils.randString = (len, seed) => {
    len = len || 32
    const dict = seed || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let res = ''
    for (let i = 0; i < len; i++) {
        res += dict[parseInt(Math.random() * dict.length, 10)]
    }
    return res
}

utils.curTime = () => {
    return moment().unix()
}

utils.getRealFileType = (fileName, fileType) => {
    const index = fileName.lastIndexOf('.')
    const extension = index > 0 ? fileName.substring(index + 1) : 'bin'

    return mime.getExtension(fileType) || extension
}

// 获取url的参数
utils.analysisParams = (url) => {
    let params = {}
    const _query = url.split('?')[1]
    if (!_query) {
        return undefined
    }
    const _vars = _query.split('&')
    _vars.forEach((v, i) => {
        const _pair = v.split('=')
        if (!params.hasOwnProperty(_pair[0])) {
            params[_pair[0]] = decodeURIComponent(_pair[1])
        } else if (typeof params[_pair[0]] === 'string') {
            const _arr = [params[_pair[0]], decodeURIComponent(_pair[1])]
            params[_pair[0]] = _arr
        } else {
            params[_pair[0]].push(decodeURIComponent(_pair[1]))
        }
    })
    return params
}

utils.aesEncrypt = (data, key) => {
    const cipher = CryptoJS.AES.encrypt(data, key).toString()
    return cipher
}

utils.aesDecrypt = (encrypted, key) => {
    const bytes = CryptoJS.AES.decrypt(encrypted, key)
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText
}

// 解压缩zip包
const unpack = (url,openUrl,urlData) => {
    const time = new Date().getTime()
    let fileIn = `${openUrl}/${time}`
    var cmdStr = `unzip ${url} -d ${fileIn}`;
    console.log('cmdStr', cmdStr)
    const host = visitUrl
    return new Promise((resolve, reject) => {
        // default value of maxBuffer is 200KB.
        // maxBuffer 增加到50M
        exec(cmdStr,{maxBuffer: 1024 * 1024 * 50}, function(err,stdout,stderr){
            if(err) {
                console.log('get weather api error:'+stderr);
                console.log(err, 'cmdStr_err')
            } else {
                let data = stdout;
                console.log('data', stdout)
                let index = data.indexOf('index.html');
                if(index < 0){
                    console.log('上传的文件夹中没有index.html,让上传的人检查上传的包', stdout)
                }
                let rough = data.substring(index-60,index+10) // 截取路径，减去60是为了保证截取到完整的路径
                console.log('rough',rough)
                let url = rough.split('www/')[1]
                let previewPath = url.replace(/index.html$/,'preview')
                let list = ''
                try {
                    list = fs.readdirSync(`${savePath}/${previewPath}`)
                } catch (error) {
                    console.log('error',error)
                }                  
                resolve({
                    fileUrl: `${host}/${url}`,
                    previewUrl: list ? `${host}/${previewPath}/${list.find(i => /\.png|\.jpg/.test(i))}` : ''
                })
            }
        });
    })
}

const zipFile = (openUrl,url) => {
    var fileUrl = url.replace(/index.html$/,'')
    var cdUrl = `${openUrl}${fileUrl}`
    cdUrl = transferredFont(cdUrl)
    console.log('新路径',cdUrl)
    var cmdStr = `cd ${cdUrl}; zip -r assets.zip ./assets/*`;
    console.log('压缩代码cmdStr',cmdStr)

    exec(cmdStr,function(err,stdout,stderr){
        if(err) {
            console.log('压缩失败:'+stderr);
        } else {
           console.log('压缩完成')
        }
    });
}

const transferredFont = (url) => {
    var re = /\(|\)|\[|\]|\-|\*|\ |（|\）/gi;
    var mapObj = {
        "\(":"\\(",
        "\)":"\\)",
        "\[":"\\[",
        "\]":"\\]",
        "\-":"\\-",
        "\*":"\\*",
        "\ ":"\\ ",
		"\（":"\\（",
		"\）":"\\）"
    }
    return url.replace(re, function(matched){
        return mapObj[matched];
    });
}

// 接受客户端传过来的zip包
/* global aliOss */
utils.regularFormImage = (req, urlData) => {
    // 初始化 multiparty
    const openUrl = savePath

    const form = new multiparty.Form({
        encoding: 'utf8',
        maxFilesSize: 30 * 1024 * 1024 * 1024,
        autoFiles: true,
        uploadDir: openUrl
    })
    return new Promise((resolve, reject) => {
        // 从 req 读取文件
        form.parse(req, (err, fields = {}, files = {}) => {
            err ? reject(err) : resolve({fields, files})
        })
    }).then(async({fields, files}) => {
        let res = {
            fileUrl: '',
            previewUrl: '',
            picUrl: ''
        }
        let prdFile = files.upName && files.upName[0];
        let picFile = files.picName && files.picName[0]

        if (prdFile) {
            const {fileUrl, previewUrl } = await unpack(prdFile.path, openUrl, urlData )
            res.fileUrl = fileUrl
            res.previewUrl = previewUrl
        }

        // 获取上传的切图文件路径
        if (picFile) {
            const host = visitUrl;
            let url = picFile.path && picFile.path.split('www')[1]
            res.picUrl = host + url
        }
        return res
    })
}

// 保存文件 创建 savePath/images
utils.saveImage = (req, urlData) => {
    // 初始化 multiparty
    const openUrl = `${savePath}`
    // const openUrl = 'E:/zipfile'

    const form = new multiparty.Form({
        encoding: 'utf8',
        maxFilesSize: 30 * 1024 * 1024 * 1024,
        autoFiles: true,
        uploadDir: openUrl
    })
    return new Promise((resolve, reject) => {
        // 从 req 读取文件
        form.parse(req, (err, fields = {}, files = {}) => {
            err ? reject(err) : resolve({fields, files})
        })
    }).then(async({fields, files}) => {
        let fileUrl = files.file && files.file[0]

        const host = visitUrl;
        fileUrl = fileUrl.path && fileUrl.path.split('www')[1]
        fileUrl = host + fileUrl
        return fileUrl
    })
}

utils.toSendEmail = (sendList, data) => {
    console.log("上传返回数据：", data);
    console.log("邮件接收人：", sendList);
    nodemailer.createTestAccount((err, account) => {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.fltrp.com",
        // service: 'qiye.aliyun', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
        port: 465, // SMTP 端口
        // secureConnection: , // 使用了 SSL
        auth: {
          user: "devops@fltrp.com",
          // 这里密码不是qq密码，是你设置的smtp授权码
          pass: "EvMeBjPwg44FNLyP",
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
  
      // setup email data with unicode symbols
      console.log(data.isUploadPic, "是否上传切图");
      let subject =
      data.isUploadPic === 1
          ? `${data.userInfo.userName}-上传了-${data.prd_name}-切图`
          : `${data.userInfo.userName}-${
            data.prd_id ? "更新了" : "创建了"
            }-${data.prd_name}`;
  
      let htmlTitle =
      data.isUploadPic === 1
          ? `<h1>${data.userInfo.userName}-上传了-${data.prd_name}-切图 </h1>`
          : `<h1>${data.userInfo.userName}-${
            data.prd_id ? "更新了" : "创建了"
            }-${data.prd_name} </h1>`;
      let mailOptions = {
        from: "<devops@fltrp.com>", // sender address
        to: sendList, // list of receivers
        subject: subject, // Subject line
        // text: 'Hello world?', plain text body
        html: `<div>
                      <h4>Hello all:</h4>
                      ${htmlTitle}
                      <p>更新时间： ${moment().format("YYYY-MM-DD HH:mm")}</p>
                      <a href='${emailCotentUrl}?prod_id=${data.prod_id}&prod_name=${data.prod_name}&line_type=${data.line_type}&prd_id=${data.prd_id}&prd_type=${data.prd_type}'>点击查看: ${emailCotentUrl}?prod_id=${data.prod_id}&prod_name=${data.prod_name}&line_type=${data.line_type}&prd_id=${data.prd_id}&prd_type=${data.prd_type}</a>
                </div>`, // html body
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error 发送失败", error);
        } else {
          console.log("Message sent: %s", info.messageId);
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
      });
    });
  }

utils.awaitWrap = (promise, once) => {
    console.log('执行数据库查询')
    return promise
        .then(data => [once ? data[1] : data, null])
        .catch(err => [null, err])
}

utils.serverErrTip = (ctx, err) => {
    console.log('数据库查询错误:', err)
    ctx.state.code = 502
    ctx.state.data = err
    ctx.state.tip = '服务器内部错误'
}
  

module.exports = utils
