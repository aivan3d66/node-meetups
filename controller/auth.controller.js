const { userValidation } = require('../validations/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../db')
const { secret } = require('../config/auth.config').jwt
const { matchPassword } = require('../helpers')
const authHelper = require('../helpers/auth')
const { JsonWebTokenError, TokenExpiredError } = require('jsonwebtoken')

const updateTokens = async (userId) => {
    const accessToken = authHelper.generateAccessToken(userId)
    const refreshToken = authHelper.generateRefreshToken()

    await authHelper.replaceDbRefreshToken(refreshToken.id, userId)

    return {
        accessToken,
        refreshToken: refreshToken.token,
    }
}

class AuthController {
    async register(req, res) {
        try {
            const { error } = userValidation(req.body)

            if (error) {
                return res.status(400).json({
                    message: `Validation error during user register: ${error.details[0].message}`,
                })
            }

            const { username, email, password, roles } = req.body

            const user = await db.query(
                'SELECT * FROM users where username = $1',
                [username]
            )

            if (user?.rows[0]?.username === username) {
                return res.status(200).json({
                    message: 'This user already exists',
                })
            } else {
                const hashedPassword = await bcrypt.hash(password, 12)

                const newUser = await db.query(
                    `INSERT INTO users (username, email, password, roles)
                                          values ($1, $2, $3, $4) RETURNING *`,
                    [username, email, hashedPassword, roles]
                )

                return res.status(201).json({
                    message: `User ${newUser.rows[0].username} created`,
                })
            }
        } catch (e) {
            res.status(500).json({ message: 'Something goes wrong, try again' })
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body

            const user = await db.query(
                'SELECT * FROM users where username = $1',
                [username]
            )

            if (!user.rows[0]) {
                return res.status(200).json({
                    message: 'User not found',
                })
            }

            const isMatch = await matchPassword(password, user.rows[0].password)

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ message: 'Wrong password, try again' })
            }

            const { accessToken, refreshToken } = await updateTokens(
                user.rows[0].id
            )

            res.json({
                accessToken,
                refreshToken,
                userId: user.rows[0].id,
                roles: user.rows[0].roles,
            })
        } catch (e) {
            res.status(500).json({ message: 'Something goes wrong, try again' })
        }
    }

    async refreshTokens(req, res) {
        const { refreshToken } = req.body
        let payload

        try {
            payload = jwt.verify(refreshToken, secret)

            if (payload.type !== 'refresh') {
                res.status(400).json({ message: 'Invalid token!' })
            }
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                res.status(400).json({ message: 'Token expired!' })
            } else if (e instanceof JsonWebTokenError) {
                res.status(400).json({ message: 'Invalid token!' })
            }
        }

        if (payload?.id) {
            const token = await db.query(
                'SELECT * FROM tokens where token_id = $1',
                [payload.id]
            )

            if (!token) {
                throw new Error('Throw Invalid token!')
            } else {
                try {
                    const { accessToken, refreshToken } = await updateTokens(
                        token.rows[0].user_id
                    )
                    res.json({ accessToken, refreshToken })
                } catch (e) {
                    res.status(400).json({ message: e.message })
                }
            }
        }
    }
}

module.exports = new AuthController()
