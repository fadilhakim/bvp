module.exports = langChecker

function langChecker(req, res, next) {
    if (req.params.lang) {
        next();
    } else {
        if (req.headers.country) {
            var lang = req.headers.country.toLowerCase();

            if (lang == 'id') {
                res.redirect('/' + lang + req.originalUrl);
            } else {
                next();
            }
        } else {
            next();
        }
    }
}