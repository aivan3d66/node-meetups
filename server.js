const express = require('express')
const userRouter = require('./routes/user.routes')
const meetupRouter = require('./routes/meetup.routes')
const authRouter = require('./routes/auth.routes')

const PORT = process.env.PORT || 8080

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', authRouter)
app.use('/api', userRouter)
app.use('/api', meetupRouter)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})
