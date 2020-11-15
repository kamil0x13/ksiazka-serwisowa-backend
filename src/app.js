const express = require('express')
require('./db/mongoose')

const bodyParser = require('body-parser')
const path = require('path')


//Routers
const userRouter = require('./routers/user')
const equipmentRouter = require('./routers/equipment')

const app = express()
const port = 3001

process.title = 'myApp'

//Across port error change before production >>>
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*')

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*')

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true)

    // Pass to next layer of middleware
    next()
})

app.use(express.static(path.join(__dirname, 'build')))

app.use(bodyParser.json())

app.use(express.json())

//Routers
app.use(userRouter)
app.use(equipmentRouter)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'))
})

module.exports = app