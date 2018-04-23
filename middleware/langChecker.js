module.exports = langChecker


function langChecker(req, res, next) {

    if (req.get('CloudFront-Viewer-Country')) {
        var lang = req.cookies.BS_PreferredLang ? req.cookies.BS_PreferredLang : req.headers.country.toLowerCase();
        if(req.get('CloudFront-Viewer-Country').toLowerCase() == 'ph' || req.get('CloudFront-Viewer-Country').toLowerCase() == 'sg' || req.get('CloudFront-Viewer-Country').toLowerCase() == 'id') 
            var country = req.headers.country.toLowerCase();
        else 
            var country = 'en';
    }else {
        var lang = req.cookies.BS_PreferredLang ? req.cookies.BS_PreferredLang : 'id';
        var country = 'id';
    }

    res.locals.country = country;
    res.locals.lang = lang;
    next();
}