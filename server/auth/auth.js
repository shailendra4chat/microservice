module.exports = function (config, passport, app) {
    app.get('/', passport.authenticate('oauth2'));
    
    app.get('/auth/uaa/callback', passport.authenticate('oauth2', { failureRedirect: '/' }), function(req, res) {
        // Successful authentication, redirect home.
        
        var redirectPath = '/read'

        if (req.session.redirectPath) {
            redirectPath = req.session.redirectPath
        }

        res.redirect(redirectPath)
    });

    app.get('/auth/logged_out', function (req, res) {
        res.send("You're logged out!")
    })

    app.get('/auth/logout', function (req, res) {
        req.session.destroy(function () {
            return true
        })

        req.logout()
        res.redirect('/')
    })
}