const db = require('../db')
const { userValidation } = require('../validations/user')

class UserController {
    async createUser(req, res) {
        const { error } = userValidation(req.body)

        if (error) {
            return res.status(400).json({
                message: `Validation error during user register: ${error.details[0].message}`,
            })
        }

        const { username, email, password, roles } = req.body
        const newPerson = await db.query(
            `INSERT INTO users (username, email, password, roles)
                                          values ($1, $2, $3, $4) RETURNING *`,
            [username, email, password, roles]
        )

        res.json(newPerson.rows)
    }

    async getUsers(req, res) {
        const users = await db.query('SELECT * FROM users')

        res.json(users.rows)
    }

    async getOneUser(req, res) {
        const id = req.params.id
        const user = await db.query('SELECT * FROM users where id = $1', [id])

        res.json(user.rows[0])
    }

    async updateUser(req, res) {
        const { id, username, email, password, roles } = req.body
        const user = await db.query(
            `UPDATE users 
                set username = COALESCE($1, username), 
                    email = COALESCE($2, email), 
                    password = COALESCE($3, password), 
                    roles = COALESCE($4, roles) 
                where id = $5 RETURNING *`,
            [username, email, password, roles, id]
        )

        res.json(user.rows[0])
    }

    async deleteUser(req, res) {
        const id = req.params.id
        const user = await db.query('DELETE FROM users where id = $1', [id])

        res.json(user.rows)
    }
}

module.exports = new UserController()
