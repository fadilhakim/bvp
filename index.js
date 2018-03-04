const express = require('express')
const app = express()
const fs = require('fs');
const axios = require('axios');

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
	{ url: '/sucessstories', name: 'Success Stories' },
	{ url: '/pricing', name: 'Pricing' },
	{ url: 'https://www.bridestory.com/id/blog', name: 'Blog' },

]

app.get('/', function(req, res) {
	
	fs.readFile('./data/vendors.json','utf-8', (err, data) => {
        if(err){
            console.log(err)
        }else{
			axios.all([
				axios.get('https://secure-cdn-api.bridestory.com/v2/blog_articles?limit=3&include=category'),
				axios.get('https://secure-cdn-api.bridestory.com/v2/categories')
			]).then(axios.spread((response,response2)  => {
					let dataBlogs = response.data.blogArticles
					let dataCategories = response2.data.category
					//console.log(dataCategories)
					data = JSON.parse(data)
					let dataVendors = data.vendors
					res.render('home', {
						dataVendors:dataVendors,
						dataBlogs : dataBlogs,
						dataCategories : dataCategories,
						menu: menu,
						active: 0
					})
				}))
				.catch(error => {
				console.log(error);
			});
        }
	  })
})

app.get('/benefits', function(req, res) {
	res.render('benefits', {
		menu: menu,
		active: 1
	})
})


app.get('/sucessstories', function(req, res) {
	res.render('testimonials', {
		menu: menu,
		active: 2
	})
})

app.get('/pricing', function(req, res) {
	res.render('pricing', {
		menu: menu,
		active: 3

	})
})


// app.listen(3000, 'local.bridestory.com', function() {
// 	console.log("... port %d in %s mode", app.address().port, app.settings.env);
// });

app.listen(3000, () => console.log('App listening on port 3000!'))

// set to local.bridestory.com