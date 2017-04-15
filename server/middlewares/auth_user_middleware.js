var refresh = require('passport-oauth2-refresh')

module.exports = function (req, res, next) {
    var session = req.session
    var user = session.passport.user ? session.passport.user : null

    if (user && user.accessToken) {
        var dateNow = Date.now()
        var timeDifference = parseInt(dateNow, 10) - parseInt(session.passport.user.tokenCreatedAt, 10)

        if (timeDifference >= 150000) {
            refresh.requestNewAccessToken('uaa', user.refreshToken, function (err, accessToken, refreshToken) {
                session.redirectPath = req.originalUrl || '/'
                if (err) {
                    return res.redirect('/')
                }
                session.passport.user.accessToken = accessToken
                session.passport.user.refreshToken = refreshToken
                session.passport.user.tokenCreatedAt = Date.now()
                next()
            })
        } else {
            session.redirectPath = ''
            next()
        }
    } else {
        if (req.method !== 'GET') {
            session.redirectPath = req.get('Referer') || '/'
            //req.flash('warning', 'Your session had expired before any action was taken. Please try again.')
        } else {
            if (!req.xhr) {
                session.redirectPath = req.url
            }
        }

        res.redirect('/')
    }
}