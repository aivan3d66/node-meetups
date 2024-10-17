const Router = require('express')
const router = new Router()
const meetupController = require('../controller/meetup.controller')

router.post('/meetups', meetupController.getMeetups)
router.get('/meetup/:id', meetupController.getMeetupById)
router.put('/meetup/:id', meetupController.updateMeetup)
router.post('/meetup', meetupController.createMeetup)
router.delete('/meetup/:id', meetupController.deleteMeetup)

module.exports = router

// const authMiddleware = require('../middlewares/auth')
// const usePermissionsMiddleware = require('../middlewares/permission.js')
//
// const db = require('../db')
//
// const { hasPermission } = usePermissionsMiddleware(db)
//
// router.get(
//     '/meetups',
//     [authMiddleware, hasPermission('admin')],
//     meetupController.getMeetups
// )
// router.get('/meetup/:id', authMiddleware, meetupController.getMeetupById)
// router.put(
//     '/meetup',
//     [authMiddleware, hasPermission('admin')],
//     meetupController.updateMeetup
// )
// router.post(
//     '/meetup',
//     [authMiddleware, hasPermission('admin')],
//     meetupController.createMeetup
// )
// router.delete(
//     '/meetup/:id',
//     hasPermission('admin'),
//     meetupController.deleteMeetup
// )
