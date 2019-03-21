const router = require('koa-router')()
const { query } = require('../db/query.js')
const request = require('request')
const config = require('../config.js')
const fs = require('fs')
const path = require('path')
const koaBody = require('koa-body')
const { token } = require('./jwt.js')

router.get('/', async (ctx, next) => {
    var httpRequest = function (api) {
        return new Promise(function (resolve, reject) {
            request(api, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    resolve(body)
                } else {
                    reject(error)
                }
            })
        })
            .catch((err) => {
                console.log(err)
            })
    }
    var data = await httpRequest('http://localhost:3030/getUserInfo')
    await ctx.render('index', {
        haha: '😆😆!',
        content: data
    })
})

router.get('/getUserInfo', async (ctx, next) => {
    await query(`select * from userInfo`)
        .then(res => {
            ctx.body = {
                data: res,
                errcode: 0,
                msg: 'success'
            }
        })
        .catch(err => {
            ctx.body = {
                data: [],
                errcode: -1,
                msg: 'fail'
            }
            console.log(err)
        })
})

router.get('/login_wx', async (ctx, next) => {
    request(`https://api.weixin.qq.com/sns/jscode2session?appid=${config.appid}&secret=${config.secret}&js_code=${config.code}&grant_type=authorization_code`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++')
            console.log(body)
            console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++')
        } else {
            console.log('===================================')
            console.log(error)
            console.log('===================================')
        }
    })
    await ctx.render('string', {
        haha: '😆😆!'
    })
})

//post接口
router.post('/setUserInfo', async(ctx) => {
    console.log(ctx.request.body);
    let req = ctx.request.body
    await query(`insert into userInfo (userName, password) values ('${req.userName}', '${req.password}')`)
        .then(res => {
            ctx.body = {
                errcode: 0,
                msg: 'success'
            }
        })
        .catch(err => {
            ctx.body = {
                errcode: -1,
                msg: 'fail'
            }
        })
})

router.get('/userInfoByName', async (ctx, next) => {
    const params = ctx.request.query
    await query(`select * from UserInfo where userName='${params.userName}'`)
        .then(res => {
            ctx.body = {
                data: res,
                errcode: 0,
                msg: 'success'
            }
        })
        .catch(err => {
            ctx.body = {
                errcode: -1,
                msg: 'fail'
            }
        })
})

//delete接口
router.del('/deleteUserInfo', async (ctx, next) => {
    const req = ctx.request.body
    await query(`delete from userInfo where userName='${req.userName}'`)
        .then(res => {
            ctx.body = {
                data: [],
                errcode: 0,
                msg: 'success'
            }
        })
        .catch(err => {
            ctx.body = {
                errcode: -1,
                msg: 'fail'
            }
        })
})

//update接口
router.put('/updateUserInfo', async (ctx, next) => {
    const req = ctx.request.body
    await query(`update userInfo set userName='${req.userName}' where userName='朱江哈哈'`)
        .then(res => {
            ctx.body = {
                data: [],
                errcode: 0,
                msg: 'success'
            }
        })
        .catch(err => {
            ctx.body = {
                errcode: -1,
                msg: 'fail'
            }
        })
})

//文件上传
router.post('/uploadFile', async (ctx, next) => {
    // 上传单个文件
    const file = ctx.request.files.file // 获取上传文件
    // 创建可读流
    const reader = fs.createReadStream(file.path)
    let filePath = path.join(__dirname, '../public/upload/')
    let fileResource = filePath + `/${file.name}`
    //判断public下是否存在upload文件夹，如果不存在则新建一个
    if (!fs.existsSync(filePath)) {
        fs.mkdir(filePath, (err) => {
            if (err) {
                throw new Error(err)
            } else {
                // 创建可写流
                const upStream = fs.createWriteStream(fileResource)
                // 可读流通过管道写入可写流
                reader.pipe(upStream)
                ctx.response.body = {
                    url: `/${file.name}`
                }
            }
        })
    } else {
        // 创建可写流
        const upStream = fs.createWriteStream(fileResource)
        // 可读流通过管道写入可写流
        reader.pipe(upStream)
        ctx.response.body = {
            url: `/${file.name}`
        }
    }
})

//login登录鉴权
router.post('/login', async (ctx, next) => {
    let req = ctx.request.body
    const accessToken = token(req)
    console.log(accessToken)
    ctx.body = {
        errcode: 0,
        data: accessToken,
        msg: 'success'
    }

    // await query(`insert into userInfo (userName, password) values ('${req.userName}', '${req.password}')`)
    //     .then(res => {
    //         ctx.body = {
    //             errcode: 0,
    //             msg: 'success'
    //         }
    //     })
    //     .catch(err => {
    //         ctx.body = {
    //             errcode: -1,
    //             msg: 'fail'
    //         }
    //     })
})

module.exports = router