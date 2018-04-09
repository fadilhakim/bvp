require('dotenv').config()

const express = require('express')
const app = express()
const fs = require('fs');
const axios = require('axios');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const langChecker = require('./middleware/langChecker');

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(express.static(__dirname + '/public'));

// views
app.set('views', './views')
app.set('view engine', 'ejs')

// routes -> controller

const home = require('./routes/home')
const benefits = require('./routes/benefits')

const menu = [{
    url: '/home/',
    name: 'Home'
}, {
    url: '/home/benefits',
    name: 'Benefits'
}, {
    url: '/home/success-stories',
    name: 'Success Stories'
}, {
    url: '/home/pricing',
    name: 'Pricing'
}]

app.use(morgan('combined'), helmet(), compression(), cookieParser());

if ('production' === process.env.NODE_ENV)
    app.locals.PROD_MODE = true;
else
    app.locals.PROD_MODE = false;

if ('staging' === process.env.NODE_ENV)
    app.locals.DEV_MODE = true;
else
    app.locals.DEV_MODE = false;

if ('local' === process.env.NODE_ENV)
    app.locals.LOCAL_MODE = true;
else
    app.locals.LOCAL_MODE = false;

if ('local' === process.env.NODE_ENV) {
    app.locals.assetsJsUrl = process.env.ASSETS_BASE_URL + '/dist/js/application.js';
    app.locals.assetsCssUrl = process.env.ASSETS_BASE_URL + '/dist/css/application.css';
} else {
    var paths = ['js', 'css'];

    for (var i = paths.length - 1; i >= 0; i--) {
        var revManifestPath = './public/dist/' + paths[i] + '/rev-manifest.json';
        var manifest = JSON.parse(fs.readFileSync(revManifestPath, 'utf8'));
        var revAssets = manifest['application.' + paths[i]];

        if (paths[i] === 'js')
            app.locals.assetsJsUrl = process.env.ASSETS_BASE_URL + '/raw/upload/business-home/js/' + revAssets;
        if (paths[i] === 'css')
            app.locals.assetsCssUrl = process.env.ASSETS_BASE_URL + '/raw/upload/business-home/css/' + revAssets;
    }
}

app.use('/:lang*?/home/benefits', langChecker, function(req, res) {
    if (req.headers.country) {
        var lang = req.headers.country.toLowerCase();
    } else {
        var lang = 'en';
    }

    res.locals.baseUrl = process.env.BASE_URL;
    res.locals.assetsUrl = process.env.ASSETS_URL;
    res.locals.country = lang;
    res.locals.lang = lang;
    res.locals.transId = req.params.lang || 'en';
    res.locals.menuUrl = (res.locals.transId != 'en') ? res.locals.baseUrl + '/' + res.locals.transId : res.locals.baseUrl;

    res.render('benefits', {
        menu: menu,
        active: 1,
        localization: require('./public/lang/localization')
    });
})

app.get('/:lang*?/home/success-stories', langChecker, function(req, res) {
    if (req.headers.country) {
        var lang = req.headers.country.toLowerCase();
    } else {
        var lang = 'en';
    }

    res.locals.baseUrl = process.env.BASE_URL;
    res.locals.assetsUrl = process.env.ASSETS_URL;
    res.locals.lang = lang;
    res.locals.transId = req.params.lang || 'en';
    res.locals.menuUrl = (res.locals.transId != 'en') ? res.locals.baseUrl + '/' + res.locals.transId : res.locals.baseUrl;


    if (lang == 'id' || lang == 'en') {
        var dataTesti = "./data/testimonial_global.json"
    } else if (lang == 'ph') {
        var dataTesti = "./data/testimonial_ph.json"
    } else if (lang == 'sg') {
        var dataTesti = "./data/testimonials_sg.json"
    }


    fs.readFile(dataTesti, 'utf-8', (err, data) => {
        if (err) {
            console.log(err)
        } else {
            data = JSON.parse(data)
            var testimonials = data.testi

            res.render('testimonials', {
                menu: menu,
                testimonials: testimonials,
                active: 2,
                localization: require('./public/lang/localization')
            })
        }
    })

})


app.get('/:lang*?/home/pricing', langChecker, function(req, res) {
    if (req.headers.country) {
        var lang = req.headers.country.toLowerCase();
    } else {
        var lang = 'en';
    }

    res.locals.baseUrl = process.env.BASE_URL;
    res.locals.assetsUrl = process.env.ASSETS_URL;
    res.locals.lang = lang;
    res.locals.transId = req.params.lang || 'en';
    res.locals.menuUrl = (res.locals.transId != 'en') ? res.locals.baseUrl + '/' + res.locals.transId : res.locals.baseUrl;

    axios.get('https://secure-cdn-api.bridestory.com/v2/categories')
        .then((categories) => {
            var dataCategories = categories.data.category;

            res.render('pricing', {
                menu: menu,
                active: 3,
                dataCategories: dataCategories,
                localization: require('./public/lang/localization')
            })
        });

})


app.get('/:lang*?/home/', langChecker, function(req, res) {
    if (req.headers.country) {
        var lang = req.headers.country.toLowerCase();
    } else {
        var lang = 'en';
    }

    if (lang == 'id' || lang == 'en') {
        var dataVendors = "./data/vendors_global.json";
        var folderImg = 'global';
    } else if (lang == 'ph') {
        var dataVendors = "./data/vendors_ph.json";
        var folderImg = 'ph';
    } else if (lang == 'sg') {
        var dataVendors = "./data/vendors_sg.json";
        var folderImg = 'sg';
    }

    res.locals.baseUrl = process.env.BASE_URL;
    res.locals.assetsUrl = process.env.ASSETS_URL;
    res.locals.lang = lang;
    res.locals.transId = req.params.lang || 'en';
    res.locals.menuUrl = (res.locals.transId != 'en') ? res.locals.baseUrl + '/' + res.locals.transId : res.locals.baseUrl;

    fs.readFile(dataVendors, 'utf-8', (err, data) => {
        if (err) {
            console.log(err)
        } else {
            axios.all([
                    axios.get('https://secure-cdn-api.bridestory.com/v2/blog_articles?limit=3&include=category'),
                    axios.get('https://secure-cdn-api.bridestory.com/v2/categories')
                ]).then(axios.spread((response, response2) => {
                    var dataBlogs = response.data.blogArticles
                    var dataCategories = response2.data.category

                    //console.log(dataCategories)
                    data = JSON.parse(data)
                    var dataVendors = data.vendors
                    res.render('home', {
                        dataVendors: dataVendors,
                        dataBlogs: dataBlogs,
                        folderImg: folderImg,
                        dataCategories: dataCategories,
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