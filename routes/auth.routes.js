const Router = require('express')
const router = new Router()
const authController = require('../controller/auth.controller')

router.post('/auth/register', authController.register)
router.post('/auth/login', authController.login)
router.post('/auth/refresh-tokens', authController.refreshTokens)

module.exports = router
