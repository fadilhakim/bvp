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

app.use('/:lang*?/benefits', function(req, res) {
	res.locals.baseUrl = req.protocol + '://' + req.get('host');
	res.locals.lang = req.params.lang ? req.params.lang : 'en';
	res.locals.menuUrl = (res.locals.lang != 'en') ? res.locals.baseUrl + '/' + res.locals.lang : res.locals.baseUrl;

	res.render('benefits', {
		menu: menu,
		active: 1,
		localization: require('./public/lang/localization')
	});
})


app.get('/:lang*?/sucessstories', function(req, res) {
	res.locals.baseUrl = req.protocol + '://' + req.get('host');
	res.locals.lang = req.params.lang ? req.params.lang : 'en';
	res.locals.menuUrl = (res.locals.lang != 'en') ? res.locals.baseUrl + '/' + res.locals.lang : res.locals.baseUrl;

	res.render('testimonials', {
		menu: menu,
		active: 2,
		localization: require('./public/lang/localization')
	})
})

app.get('/:lang*?/pricing', function(req, res) {
	res.locals.baseUrl = req.protocol + '://' + req.get('host');
	res.locals.lang = req.params.lang ? req.params.lang : 'en';
	res.locals.menuUrl = (res.locals.lang != 'en') ? res.locals.baseUrl + '/' + res.locals.lang : res.locals.baseUrl;

	res.render('pricing', {
		menu: menu,
		active: 3,
		localization: require('./public/lang/localization')
	})
})

app.get('/:lang*?/', function(req, res) {
	res.locals.baseUrl = req.protocol + '://' + req.get('host');
	res.locals.lang = req.params.lang ? req.params.lang : 'en';
	res.locals.menuUrl = (res.locals.lang != 'en') ? res.locals.baseUrl + '/' + res.locals.lang : res.locals.baseUrl;
	
	fs.readFile('./data/vendors.json','utf-8', (err, data) => {
        if(err){
            console.log(err)
        }else{
			axios.get('https://secure-cdn-api.bridestory.com/v2/blog_articles?limit=3&include=category')
				.then(response => {
					var dataBlogs = response.data.blogArticles
					data = JSON.parse(data)
					var dataVendors = data.vendors
					res.render('home', {
						dataVendors:dataVendors,
						dataBlogs : dataBlogs,
						menu: menu,
						active: 0,
						localization: require('./public/lang/localization')
					})
				})
				.catch(error => {
				console.log(error);
			});
        }
	  })
})


app.listen(3000, () => console.log('App listening on port 3000!'))