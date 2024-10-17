const jwt = require('jsonwebtoken')
const { secret } = require('../config/auth.config').jwt

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization')

    if (!authHeader) {
        res.status(401).json({ message: 'Token is not provided' })
    }

    const token = authHeader.replace('Bearer ', '')

    try {
        const payload = jwt.verify(token, secret)

        if (payload.type !== 'access') {
            res.status(401).json({ message: 'Invalid token' })
        }
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: 'Token is expired' })
        }

        if (e instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: 'Invalid token' })
        }
    }

    next()
}
