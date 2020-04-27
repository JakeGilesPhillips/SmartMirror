const axios = require('axios');
const query = require('querystring');
var config = require('../../dev_config.json');

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
        playback: `https://api.spotify.com/v1/me/player`,
        devices: `https://api.spotify.com/v1/me/player/devices`,
        volume: `https://api.spotify.com/v1/me/player/volume?`,
    }
}

var types =
{
    play: "put",
    pause: "put",
    next: "post",
    previous: "post",
}
var devices = [];

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
            getDevices();
            res.send('OK');
        });
    }
    else
    { 
        res.redirect('/spotify/login');
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
                getDevices();

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
        getDevices();
        res.send(resp.data);
    });
}

module.exports.playstate = function (req, res)
{
    axios({
        method: types[req.query.state],
        url: `${urls.user.playback}/${req.query.state}${getActiveDevice() != null ? "?device_id" + getActiveDevice().id : ''}`,
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    }).then((resp) => {
        getDevices();
        res.send(resp.data);
    });
}

module.exports.volume = function (req, res)
{
    if (getActiveDevice())
    {
        const value = Math.min(100, Math.max(0, req.query.volume * 10));
        axios({
            method: "put",
            url: urls.user.volume + query.stringify({
                volume_percent: value,
                device_id: getActiveDevice().id
            }),
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then((resp) => {
            getDevices();
            res.send(resp.data);
        });
    }
}

module.exports.volumeup = function (req, res)
{
    if (getActiveDevice())
    {
        const value = Math.min(100, Math.max(0, getActiveDevice().volume_percent + 10));
        axios({
            method: "put",
            url: urls.user.volume + query.stringify({
                volume_percent: value,
                device_id: getActiveDevice().id
            }),
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then((resp) => {
            getDevices();
            res.send(resp.data);
        });
    }
}

module.exports.volumedown = function (req, res)
{
    if (getActiveDevice())
    {
        const value = Math.min(100, Math.max(0, getActiveDevice().volume_percent - 10));
        axios({
            method: "put",
            url: urls.user.volume + query.stringify({
                volume_percent: value,
                device_id: getActiveDevice().id
            }),
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then((resp) => {
            getDevices();
            res.send(resp.data);
        });
    }
}

function getDevices()
{
    axios({
        method: 'get',
        url: urls.user.devices,
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }).then((resp) =>
    {
        devices = resp.data.devices;
    });
}

function getActiveDevice()
{
    if (devices.length > 0)
    {
        const active = devices.filter(a => a.is_active)[0];
        if (active) { return active; }
        else { return devices[0]; }
    }
    else { return null; }
}

function getAuthorizationString() 
{
    var auth = `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`;
    return auth;
}