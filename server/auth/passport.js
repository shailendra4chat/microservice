var request = require('request')
var OAuth2Strategy = require('passport-oauth2').Strategy
var refresh = require('passport-oauth2-refresh')

module.exports = function (config, passport) {
    var auth = 'Basic ' + new Buffer(config.clientId + ':' + config.clientSecret).toString('base64');
            
    var cfStrategy = new OAuth2Strategy({
            authorizationURL: config.apiEndpoint + '/oauth/authorize',
            tokenURL: config.apiEndpoint + '/oauth/token',
            clientID: config.clientId,
            clientSecret: config.clientSecret,
            customHeaders: { 'authorization': auth },
            callbackURL: config.callbackUrl + "/auth/uaa/callback",
            scope: ''
        },
        function(accessToken, refreshToken, profile, cb) {
            profile.accessToken = accessToken
            profile.refreshToken = refreshToken

            var httpOptions = {
                url: config.uaaEndpoint + '/userinfo',
                headers: {
                    'Authorization': 'bearer ' + profile.accessToken
                },
                timeout: 10000
            }

            request(httpOptions, function (error, response, body) {
                if (error) {
                    console.log(error)
                    return cb(error)
                }

                body = JSON.parse(body)
                profile.id = body.user_id
                profile.email = body.email
                profile.username = body.user_name
                profile.tokenCreatedAt = Date.now()
                process.nextTick(function () {
                    return cb(null, profile)
                })
            })
        }
    );

    passport.serializeUser(function (user, done) {
        done(null, user)
    })

    passport.deserializeUser(function (user, done) {
        done(null, user)
    })

    passport.use(cfStrategy)
    refresh.use('uaa', cfStrategy)
}