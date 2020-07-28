const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes/routes')


const app = express()

//middlewares
app.use(bodyParser.json())
//routes
app.use('/api/v1', routes) 
module.exports = app