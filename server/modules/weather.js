const axios = require('axios');
const query = require('querystring');
const config = require('../../config.json');

const urls =
{
    forecast:
    {
        current: "https://api.openweathermap.org/data/2.5/weather?",
        oneDay:  "https://api.openweathermap.org/data/2.5/forecast/daily?",
        fiveDay: 'https://api.openweathermap.org/data/2.5/forecast?'
    }
};

module.exports.city = function (req, res) 
{
    axios({
        method: 'get',
        url: urls.forecast.fiveDay + query.stringify({ q: config.apis.weather.location, appid: config.apis.weather.apikey }),
        headers:
        {
            'Content-Type': 'application/json',
        }
    }).then((resp) => {
        res.json(resp.data);
    });
} 