const axios = require('axios');
const query = require('querystring');

var client_id = '5dee9a8e192844db98c1936d0a2e58b3';
var client_secret = 'b0710537ad47441a8345aaf429880396';
var callback_uri = 'http://92.238.31.112:50501/spotify/callback';
var scopes = 'user-read-private user-read-email user-read-playback-state';

var access_token = '';
var refresh_token = '';
var stateKey = 'spotify_auth_state';

var urls = {
    authorisation: {
        token:    `https://accounts.spotify.com/api/token?`,
        redirect: `https://accounts.spotify.com/authorize?`,
    },
    user: {
        account: `https://api.spotify.com/v1/me`,
        playback: `https://api.spotify.com/v1/me/player`
    }
}

function getAuthorizationString() {
    var auth = `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`;
    return auth;
}

function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

module.exports.login = function (req, res) 
{
    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    res.redirect(urls.authorisation.redirect +
        query.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scopes,
            redirect_uri: callback_uri,
            state: state
        }));
}

module.exports.refresh = function (req, res) 
{
    axios({
        method: 'post',
        url: urls.authorisation.token + query.stringify({ grant_type: 'refresh_token', refresh_token: refresh_token }),
        headers: {
            'Authorization': getAuthorizationString(),
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }).then((resp) => {
        access_token = resp.data.access_token;
        res.send('OK');
    });
}

module.exports.logincallback = function (req, res) 
{
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) 
    {
        res.redirect('/spotify/error' + query.stringify({ error: 'state_mismatch' }));
    }
    else 
    {
        res.clearCookie(stateKey);
        axios({
            method: 'post',
            url: urls.authorisation.token + query.stringify({ code: code, redirect_uri: callback_uri, grant_type: 'authorization_code' }),
            headers: {
                'Authorization': getAuthorizationString(),
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).then((resp) => {
            if(resp.status === 200) 
            {
                // Set Tokens
                access_token = resp.data.access_token;
                refresh_token = resp.data.refresh_token;

                // Redirect success
                res.redirect('/home');
            }
            else 
            {
                // Redirect error
                res.redirect('/spotify/error' + query.stringify({error: 'invalid_token'}));
            }
        });
    }
}

module.exports.user = function(req, res) {
    res.status(403).send('Error connected to spotify');
}

module.exports.user = function(req, res) {
    axios({
        method: 'get',
        url: urls.user.account,
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }).then((resp) => {
        res.send(resp.data);
    });
}

module.exports.playback = function(req, res) {
    axios({
        method: 'get',
        url: urls.user.playback,
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }).then((resp) => {
        res.send(resp.data);
    });
}