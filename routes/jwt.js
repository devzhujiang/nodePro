const jwt = require('jsonwebtoken')
const secret = 'jwt login'
const token = (userInfo) =>{
    return jwt.sign(userInfo, secret, {expiresIn: '1h'})
}
module.exports = {
    token
}