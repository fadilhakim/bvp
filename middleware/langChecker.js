module.exports = langChecker


function langChecker(req, res, next) {

    if (req.headers.country) {
        var lang = req.cookies.BS_PreferredLang ? req.cookies.BS_PreferredLang : req.headers.country.toLowerCase();
        if(req.headers.country.toLowerCase() == 'ph' || req.headers.country.toLowerCase() == 'sg' || req.headers.country.toLowerCase() == 'id') 
            var country = req.headers.country.toLowerCase();
        else 
            var country = 'en';
    }else {
        var lang = req.cookies.BS_PreferredLang ? req.cookies.BS_PreferredLang : 'en';
        var country = 'en';
    }

    res.locals.country = country;
    res.locals.lang = lang;
    next();
}