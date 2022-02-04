const express = require('express');
var cors = require('cors');
const app = express()
app.use(cors())
require('dotenv').config()

const PORT = process.env.PORT || 3001

app.listen(PORT, ()=> {
    console.log(`Listening on port ${PORT}`)
})