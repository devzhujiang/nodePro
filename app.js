const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')  //用来处理各种模板编译，包括ejs、jade(pug)、handlerbars
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const koaBody = require('koa-body')
const path = require('path')

const index = require('./routes/index')
const users = require('./routes/users')


// error handler
onerror(app)

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

// 添加处理模板的中间件
app.use(views(__dirname + '/views', {
    map: { html: 'handlebars' }
}))

// logger
app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

//文件上传 --koa-body中间件要放在路由之前
// app.use(koaBody({
//     multipart: true,
//     formidable: {
//         maxFileSize: 200*1024*1024	// 设置上传文件大小最大限制，默认2M
//     }
// }))


// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())



// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app
