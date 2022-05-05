const express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const app = express()
app.use(cors())
require('dotenv').config()
//Node set up
var jsonParser = bodyParser.json()


app.use('/api/computerMove/', jsonParser,require('./routes/calculateMove'))
app.use('/api/validateWord/', jsonParser,require('./routes/validateMove'))

const PORT = process.env.PORT || 3001

app.listen(PORT, ()=> {
    
})