module.exports = langChecker

function langChecker(req, res, next) {
    if (req.headers.country) {
        var lang = req.headers.country.toLowerCase();

        if (lang == 'id') {
            res.redirect('/' + lang + req.originalUrl);
        } else {
            next();
        }
    } else {
        if(req.cookies.BS_PreferredLang && req.cookies.BS_PreferredLang == 'id') {
            res.redirect('/' + lang + req.originalUrl);
        } else {
            next();
        }
    }
}