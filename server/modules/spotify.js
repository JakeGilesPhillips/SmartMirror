const axios = require('axios');
const query = require('querystring');
var config = require('../../config.json');

const callback_uri = `${config.server.path}:${config.server.port}/spotify/callback`;
const scopes = config.apis.spotify.scopes;
const client_id = config.apis.spotify.client_id;
const client_secret = config.apis.spotify.client_secret;

var access_token = '';
var refresh_token = '';

var urls =
{
    authorisation:
    {
        token:    `https://accounts.spotify.com/api/token?`,
        redirect: `https://accounts.spotify.com/authorize?`,
    },
    user:
    {
        account: `https://api.spotify.com/v1/me`,
        playback: `https://api.spotify.com/v1/me/player`
    }
}

var types =
{
    play: "put",
    pause: "put",
    next: "post",
    previous: "post",
}


module.exports.login = function (req, res) 
{
    res.redirect(urls.authorisation.redirect + query.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scopes,
        redirect_uri: callback_uri,
        showDialog: true
    }));
}

module.exports.refresh = function (req, res) 
{
    if (refresh_token)
    {
        axios({
            method: 'post',
            url: urls.authorisation.token + query.stringify({ grant_type: 'refresh_token', refresh_token: refresh_token }),
            headers: {
                'Authorization': getAuthorizationString(),
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).then((resp) =>
        {
            access_token = resp.data.access_token;
            refresh_token = resp.data.refresh_token || refresh_token;
            res.send('OK');
        });
    }
    else
    { 
        return this.login(req, res);
    }
}

module.exports.logincallback = function (req, res) 
{
    if (req.query.error != null)
    {
        res.redirect('/spotify/error' + query.stringify({ error: req.query.error }));
    }
    if (req.query.code != null) 
    {
        axios({
            method: 'post',
            url: urls.authorisation.token + query.stringify({ code: req.query.code, redirect_uri: callback_uri, grant_type: 'authorization_code' }),
            headers: {
                'Authorization': getAuthorizationString(),
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).then((resp) =>
        {
            if (resp.status === 200) 
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
                res.redirect('/spotify/error' + query.stringify({ error: 'invalid_token' }));
            }
        });
    }
}

module.exports.user = function (req, res) 
{
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

module.exports.playback = function (req, res) 
{
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

module.exports.playstate = function (req, res)
{
    axios({
        method: types[req.query.state],
        url: `${urls.user.playback}/${req.query.state}`,
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    }).then((resp) => {
        res.send(resp.data);
    });
}

function getAuthorizationString() 
{
    var auth = `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`;
    return auth;
}