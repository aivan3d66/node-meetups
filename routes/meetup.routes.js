const Router = require('express')
const router = new Router()
const meetupController = require('../controller/meetup.controller')

// router.post('/meetups', meetupController.getMeetups)
// router.get('/meetups/:id', meetupController.getMeetupById)
// router.put('/meetups/:id', meetupController.updateMeetup)
// router.post('/meetups', meetupController.createMeetup)
// router.delete('/meetups/:id', meetupController.deleteMeetup)

module.exports = router

const authMiddleware = require('../middlewares/auth')
const usePermissionsMiddleware = require('../middlewares/permission.js')

const db = require('../db')

const { hasPermission } = usePermissionsMiddleware(db)

router.get('/meetups', authMiddleware, meetupController.getMeetups)
router.get('/meetups/:id', authMiddleware, meetupController.getMeetupById)
router.put(
    '/meetups',
    [authMiddleware, hasPermission('admin')],
    meetupController.updateMeetup
)
router.post(
    '/meetups',
    [authMiddleware, hasPermission('admin')],
    meetupController.createMeetup
)
router.delete(
    '/meetups/:id',
    hasPermission('admin'),
    meetupController.deleteMeetup
)
