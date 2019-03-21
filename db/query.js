const mysql = require('mysql')
const mysqlConfig = require('./config.js')

//创建连接池
const pool = mysql.createPool(mysqlConfig)
//封装查询
const query = (sql) =>{
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if(err){
                reject(err)
            }else{
                // 使用连接执行查询
                connection.query(sql, function (err, rows, fields) {
                    if(err){
                        reject(err)
                    }else{
                        resolve(rows)
                    }
                    //连接不再使用，返回到连接池
                    connection.release()
                })
            }
        })
    })
}
module.exports = {
    query
}
