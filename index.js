const express = require('express')
const app = express()


const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public'));

// views
app.set('views', './views')
app.set('view engine', 'ejs')

// models


// routes -> controller

const home = require('./routes/home')
const benefits = require('./routes/benefits')

app.use('/',home)
app.use('/benefits',benefits)


app.listen(3000, () => console.log('App listening on port 3000!'))