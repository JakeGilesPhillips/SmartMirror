const axios = require('axios');
const query = require('querystring');

var urls = {
    cityname: 'https://api.openweathermap.org/data/2.5/forecast?'
};

var apiKey = '84a0f34fd4eb18b302218f5fe791198d';

module.exports.bristol = function(req, res) {
    axios({
        method: 'get',
        url: urls.cityname + query.stringify({ q: 'Bristol,uk', appid: apiKey}),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((resp) => {
        res.json(resp.data);
    });
} 