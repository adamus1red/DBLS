// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'twitterAuth' : {
        'consumerKey'       : 'TK79zlkH5SxjYtmDOvZ6pNaPF',
        'consumerSecret'    : 'v38OzcwF7UyzKJX3s5LxfRjgtgrqOqPYKkRjT5LF8taXb24jcg',
        'callbackURL'       : 'https://dbls.ovh/login/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '954760815846-5hp9u11332jmel7qg5ij1be7um01cu2b.apps.googleusercontent.com',
        'clientSecret'  : 'aVWkIRyndJGVHkJMaDz0s3R1',
        'callbackURL'   : 'https://dbls.ovh/login/auth/google/callback'
    },

    'CISAuth' : {
        'issuer'      : 'CIS-LDAP',
        'host'  : 'https://local.cis.strath.ac.uk/simplesamlphp/saml2/idp/SSOService.php',
        'path'   : 'http://dbls.ovh/login/auth/saml/callback'
    },
    'gitlab' : { 
        'appkey' : '765a87ce6010c781a103d0613d5e9ebfefefe0f33f392779ec386f2c652459e6',
        'secretkey' : 'b7e5afa06daa852cf55d52ce9f7766934c227c5379d71d1c783dc6de58571b37',
        'host' : 'https://gitlab.strathtech.co.uk',
        'callbackURL' : 'https://dbls.ovh/login/auth/strathtech/callback'
    }
};