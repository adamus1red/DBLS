// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'twitterAuth' : {
        'consumerKey'       : 'TK79zlkH5SxjYtmDOvZ6pNaPF',
        'consumerSecret'    : 'v38OzcwF7UyzKJX3s5LxfRjgtgrqOqPYKkRjT5LF8taXb24jcg',
        'callbackURL'       : 'http://127.0.0.1:3000/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '954760815846-5hp9u11332jmel7qg5ij1be7um01cu2b.apps.googleusercontent.com',
        'clientSecret'  : 'aVWkIRyndJGVHkJMaDz0s3R1',
        'callbackURL'   : 'http://127.0.0.1:3000/auth/google/callback'
    },

    'CISAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://127.0.0.1:3000/auth/google/callback'
    }

};