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


	axios.get('https://secure-cdn-api.bridestory.com/v2/categories')
	.then((categories) => {
		let dataCategories = categories.data.category;
		
		res.render('pricing', {
			menu: menu,
			active: 3,
			dataCategories : dataCategories,
			localization: require('./public/lang/localization')
		})
	});

})

app.get('/:lang*?/', function(req, res) {
	res.locals.baseUrl = req.protocol + '://' + req.get('host');
	res.locals.lang = req.params.lang ? req.params.lang : 'en';
	res.locals.menuUrl = (res.locals.lang != 'en') ? res.locals.baseUrl + '/' + res.locals.lang : res.locals.baseUrl;
	
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
					var dataVendors = data.vendors
					res.render('home', {
						dataVendors:dataVendors,
						dataBlogs : dataBlogs,
						dataCategories : dataCategories,
						menu: menu,
						active: 0,
						localization: require('./public/lang/localization')
					})
				}))
				.catch(error => {
				console.log(error);
			});
        }
	  })
})


// app.listen(3000, 'local.bridestory.com', function() {
// 	console.log("... port %d in %s mode", app.address().port, app.settings.env);
// });

app.listen(3000, () => console.log('App listening on port 3000!'))

// set to local.bridestory.com