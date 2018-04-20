module.exports = langChecker


function langChecker(req, res, next) {
    if (req.headers.country) {
        var lang = req.cookies.BS_PreferredLang ? req.cookies.BS_PreferredLang : req.headers.country.toLowerCase();

        if (lang == 'id' && !req.params.lang) {
            res.redirect('/' + lang + req.originalUrl);
        } else {
            next();
        }
    } else {
        next();
    }
}

