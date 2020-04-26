/** SETUP PRE-REQUISITES */
const cors    = require('cors'); 
const axios   = require('axios'); 
const parser  = require('body-parser')
const express = require('express');
const cookies = require('cookie-parser');

/** SETUP MODULES */
const spotify = require('./modules/spotify');
const weather = require('./modules/weather');
const voicecontrol = require('./modules/voicecontrol');

/** CREATE APP */
var config = require('../config.json');
var app  = express();

/** SETUP APP */
app.use(cors());
app.use(cookies());
app.use(parser.json({ type: 'application/*+json' }));
app.use(logger);
app.use((req, res, next) => 
{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.listen(config.server.port, () => 
{
    console.log(`Smart Mirror API Running on: ${config.server.port}`);
});

/** SETUP ENDPOINTS */
// Root ('/')
app.get('/', function(req, res, next) {
    res.redirect('/spotify/login');
});

// Smart Mirror Home
app.get('/home', function(req, res, next) {
    res.redirect(`${config.web_application.path}`);
});

// Weather
app.get('/weather/bristol', function(req, res, next) {
    weather.city(req, res);
});

// Spotify
app.get('/spotify/login', function(req, res, next) {
    spotify.login(req, res);
});
app.get('/spotify/refresh', function(req, res, next) {
    spotify.refresh(req, res);
});
app.get('/spotify/callback', function(req, res, next) {
    spotify.logincallback(req, res);
});
app.get('/spotify/error', function(req, res, next) {
    spotify.loginerror(req, res);
});
app.get('/spotify/user', function(req, res, next) {
    spotify.user(req, res);
});
app.get('/spotify/user/playing', function(req, res, next) {
    spotify.playback(req, res);
});
app.get('/spotify/user/playstate', function(req, res, next) {
    spotify.playstate(req, res);
});

function logger(req, res, next)
{
    console.log(new Date().toISOString().substr(11, 5) + " - " + req.url);
    next();
}