const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (req,res,next) => {
    const bearerHeader = req.headers['authorization'];
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    try {
        const decoded = jwt.verify(req.token, process.env.BCRYPTPASSWORD)
        req.userData = decoded
        next()
    }
    catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        })
    }
}