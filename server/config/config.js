var env = process.env.NODE_ENV || 'development'
var appRoute
if (process.env.VCAP_APPLICATION) {
  var VCAP_APPLICATION = JSON.parse(process.env.VCAP_APPLICATION)
  appRoute = VCAP_APPLICATION && VCAP_APPLICATION.application_uris[0]
}

var config = {
    apiEndpoint: "your-apiEndpoint",
    clientId: "your-clientId",
    clientSecret: "your-clientSecret",
    callbackUrl: 'http://' + (appRoute || '127.0.0.1:3000'),
    uaaEndpoint: 'your-uaaEndpoint'
}

module.exports = config;