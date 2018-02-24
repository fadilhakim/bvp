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

const menu = [
	{ url: '/', name: 'Home' },
	{ url: '/benefits', name: 'Benefits' },
	{ url: '/', name: 'Success Stories' },
	{ url: '/', name: 'Pricing' },
	{ url: '/', name: 'Blog' },
]

app.get('/', function(req, res) {
	res.render('home', {
		menu: menu,
		active: 0
	})
})
app.get('/benefits', function(req, res) {
	res.render('benefits', {
		menu: menu,
		active: 1
	})
})


app.listen(3000, () => console.log('App listening on port 3000!'))