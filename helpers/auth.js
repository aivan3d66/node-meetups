const jwt = require('jsonwebtoken')
const db = require('../db')
const uuid = require('uuid').v4
const { tokens, secret } = require('../config/auth.config').jwt

const generateAccessToken = (userId) => {
    const payload = {
        userId,
        type: tokens.access.type,
    }

    const options = { expiresIn: tokens.access.expiresIn }

    return jwt.sign(payload, secret, options)
}

const generateRefreshToken = () => {
    const payload = {
        id: uuid(),
        type: tokens.refresh.type,
    }

    const options = { expiresIn: tokens.refresh.expiresIn }

    return {
        id: payload.id,
        token: jwt.sign(payload, secret, options),
    }
}

const replaceDbRefreshToken = async (tokenId, userId) => {
    await db.query('DELETE FROM tokens where user_id = $1', [userId])
    await db.query(
        `INSERT INTO tokens (token_id, user_id)
                                          values ($1, $2) RETURNING *`,
        [tokenId, userId]
    )
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    replaceDbRefreshToken,
}
