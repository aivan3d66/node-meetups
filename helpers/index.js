const db = require('../db')
const bcrypt = require('bcryptjs')

const emailExists = async (email) => {
    const data = await db.query('SELECT * FROM persons WHERE email=$1', [email])

    if (data.rowCount === 0) return false
    return data.rows[0]
}

const createUser = async (args) => {
    const { username, email, password, roles } = args

    const salt = await bcrypt.genSalt(12)
    const hash = await bcrypt.hash(password, salt)

    const data = await db.query(
        `INSERT INTO persons (username, email, password, roles)
                                          VALUES ($1, $2, $3, $4) RETURNING *`,
        [username, email, hash, roles]
    )

    if (data.rowCount === 0) return false
    return data.rows[0]
}

const matchPassword = async (password, hashPassword) => {
    return await bcrypt.compare(password, hashPassword)
}

module.exports = { emailExists, createUser, matchPassword }
