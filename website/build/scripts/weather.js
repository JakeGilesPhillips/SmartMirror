$(document).ready(() => {
    getWeather();
});

var weather = {
    forecast: 'http://192.168.0.104:3000/weather/bristol'
};

function getWeather() {
    $.get(weather.forecast, (resp) => {
        updateWeather(resp);
        setTimeout(getWeather, 900000);
    });
}

function updateWeather(data) {
    $("#weather-forecast #location #city").html(data.city.name);
    $("#weather-forecast #current #weathericon").addClass("mdi");
    $("#weather-forecast #current #weathericon").addClass("mdi-" + icons[data.list[0].weather[0].id]);
    $("#weather-forecast #current #temperature").html((data.list[0].main.temp - 273.15).toFixed(1));
}

var icons = {
    200: "weather-lightning-rainy",
    201: "weather-lightning-rainy",
    202: "weather-lightning-rainy",
    210: "weather-partly-lightning",
    211: "weather-lightning",
    212: "weather-lightning",
    221: "weather-lightning",
    230: "weather-lightning-rainy",
    231: "weather-lightning-rainy",
    232: "weather-lightning-rainy",
    
    300: "weather-partly-rainy",
    301: "weather-rainy",
    302: "weather-rainy",
    310: "weather-partly-rainy",
    311: "weather-rainy",
    312: "weather-pouring",
    313: "weather-pouring",
    314: "weather-pouring",
    321: "weather-pouring",

    500: "weather-pouring",
    501: "weather-pouring",
    502: "weather-pouring",
    503: "weather-pouring",
    504: "weather-pouring",
    511: "weather-pouring",
    520: "weather-pouring",
    521: "weather-pouring",
    522: "weather-pouring",
    531: "weather-pouring",

    600: "weather-partly-snowy",
    601: "weather-snowy",
    602: "weather-snowy-heavy",
    611: "weather-snowy-rainy",
    612: "weather-snowy-rainy",
    613: "weather-snowy-rainy",
    615: "weather-partly-snowy-rainy",
    616: "weather-snowy-rainy",
    620: "weather-snowy",
    621: "weather-snowy-heavy",
    622: "weather-snowy-heavy",

    701: "weather-fog",
    711: "weather-fog",
    721: "weather-hazy",
    731: "weather-fog",
    741: "weather-fog",
    751: "weather-fog",
    761: "weather-fog",
    761: "weather-fog",
    771: "weather-fog",
    781: "weather-tornado",

    800: "weather-sunny",
    801: "weather-partly-cloudy",
    802: "weather-cloudy",
    803: "cloud",
}