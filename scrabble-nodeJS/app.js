const express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const app = express()
app.use(cors())
require('dotenv').config()
//app.use(bodyParser.urlencoded({ extended: false }))
//app.use(bodyParser.json())
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use('/api/computerMove/', jsonParser,require('./routes/calculateMove'))
app.use('/api/validateWord/', jsonParser,require('./routes/validateMove'))

const PORT = process.env.PORT || 3001

app.listen(PORT, ()=> {
    console.log(`Listening on port ${PORT}`)
})