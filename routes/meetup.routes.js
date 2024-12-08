const Router = require('express')
const router = new Router()
const meetupController = require('../controller/meetup.controller')

const authMiddleware = require('../middlewares/auth')
const usePermissionsMiddleware = require('../middlewares/permission.js')

const db = require('../db')

const { hasPermission } = usePermissionsMiddleware(db)

router.post('/meetups', authMiddleware, meetupController.getMeetups)
router.get('/meetups/:id', authMiddleware, meetupController.getMeetupById)
router.put(
    '/meetups/:id',
    [authMiddleware, hasPermission('admin')],
    meetupController.updateMeetup
)
router.post(
    '/meetup',
    [authMiddleware, hasPermission('admin')],
    meetupController.createMeetup
)
router.delete(
    '/meetups/:id',
    hasPermission('admin'),
    meetupController.deleteMeetup
)

module.exports = router
