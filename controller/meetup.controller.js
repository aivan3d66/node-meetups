const db = require('../db')
const { meetupValidation } = require('../validations/meetup')

class MeetupController {
    async createMeetup(req, res) {
        const { error } = meetupValidation(req.body)

        if (error) {
            return res.status(400).json({
                message: `Validation error during creating meetup: ${error.details[0].message}`,
            })
        }

        const { title, description, tags, date_time, location, user_id } =
            req.body
        const newMeetup = await db.query(
            `INSERT INTO meetups (title, description, tags, date_time, location, user_id)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [title, description, tags, date_time, location, user_id]
        )

        res.json(newMeetup.rows[0])
    }

    async getMeetupById(req, res) {
        const id = req.params.id
        const meetup = await db.query('SELECT * FROM meetups where id = $1', [
            id,
        ])

        res.json(meetup.rows[0])
    }

    async getMeetups(req, res) {
        const { searchString, sort, tagFilter, page, perPage } = req.body

        if (searchString) {
            const str = `${searchString}%`
            const meetup = await db.query(
                'SELECT * FROM meetups where title like $1',
                [str]
            )

            res.json(meetup.rows[0])
        } else if (sort === 'date-asc') {
            const meetup = await db.query(
                'SELECT * FROM meetups ORDER BY datetime ASC'
            )

            res.json(meetup.rows)
        } else if (sort === 'date-desc') {
            const meetup = await db.query(
                'SELECT * FROM meetups ORDER BY datetime DESC'
            )

            res.json(meetup.rows)
        } else if (tagFilter) {
            const str = `%${tagFilter}%`
            const meetup = await db.query(
                'SELECT * FROM meetups where tags like $1',
                [str]
            )

            res.json(meetup.rows)
        } else if (perPage && (page || page === 0)) {
            const pageableMeetups = await db.query(
                `
                    SELECT *
                    FROM meetups
                    ORDER BY meetups.id ASC
                    LIMIT ${perPage} OFFSET ${page === 0 ? page : page * 2}
                `
            )

            res.json({ meetups: pageableMeetups.rows })
        } else {
            const meetups = await db.query('SELECT * FROM meetups')

            res.json(meetups.rows)
        }
    }

    async updateMeetup(req, res) {
        const id = req.params.id

        const { title, description, tags, date_time, location, user_id } =
            req.body

        const meetup = await db.query(
            `UPDATE meetups
             set title       = COALESCE($1, title),
                 description = COALESCE($2, description),
                 tags        = COALESCE($3, tags),
                 date_time   = COALESCE($4, date_time),
                 location    = COALESCE($5, location),
                 user_id     = COALESCE($6, user_id)
             where id = $7
             RETURNING *`,
            [title, description, tags, date_time, location, user_id, id]
        )

        res.json(meetup.rows[0])
    }

    async deleteMeetup(req, res) {
        const id = req.params.id
        const meetup = await db.query('DELETE FROM meetups where id = $1', [id])

        res.json(meetup.rows)
    }
}

module.exports = new MeetupController()
