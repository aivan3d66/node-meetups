require('dotenv').config()

module.exports = {
    jwt: {
        secret: process.env.JWT_SECRET,
        tokens: {
            access: {
                type: 'access',
                expiresIn: '1m',
            },
            refresh: {
                type: 'refresh',
                expiresIn: '5m',
            },
        },
    },
}
