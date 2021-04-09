#### 安装依赖

```bash
# 安装全局依赖
npm i pm2 nodemon -g

# 安装项目依赖
npm i
```
#### 启动项目

```bash
# 开发环境，监听文件变化自动重启，并会输出 debug 信息
tnpm run dev

# 线上部署环境
tnpm start

# 使用pm2部署
pm2 start index.js --name blueOcean
```

### 接口文档地址
  https://easydoc.xyz/s/81009437/uwJQX3tS/gP9l7IKa

## 项目结构

```
koa-weapp-demo
├── README.md
├── app.js
├── controllers
│   ├── index.js
│   ├── login.js
│   ├── message.js
│   ├── tunnel.js
│   ├── upload.js
│   └── user.js
├── middlewares
│   └── response.js
├── config.js
├── package.json
├── process.json
├── nodemon.json
├── qcloud.js
└── routes
    └── index.js
```
`app.js` 是 Demo 的主入口文件，Demo 使用 Koa 框架，在 `app.js` 创建一个 Koa 实例并响应请求。

`routes/index.js` 是 Demo 的路由定义文件

`config.js` 主要的配置如下：

```javascript
{
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
            'char': 'utf8mb4'
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

```

