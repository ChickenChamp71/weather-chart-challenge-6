var APIKey = "cd99b5c9c820159fbd1ce1b9e8a229c0";

var lat

var lon

var city = document.getElementById('city-search');

var temp = {};
                    
var wind = {};
                    
var humidity = {};

var weatherImg = {};

var searchBtn = document.getElementById('search-button');

var weather = document.getElementById('weather');

var searchHistory = document.getElementsById('history');

function init () {
    weather.setAttribute('style', 'display:none');

    var storedSearch = JSON.parse(localStorage.getItem('search'));

    if (storedSearch !== null) {
        searchHistory.setAttribute('style', 'display:block');
    }
}



function makeElements () {
    for (let i = 0; i < 6; i++) {
        temp[i] = document.getElementById('temp-' + [i]);
        wind[i] = document.getElementById('wind-' + [i]);
        humidity[i] = document.getElementById('humidity-' + [i]);

        weatherImg[i] = document.getElementById('weather-img-' + [i]);
    }
}

init();

makeElements();

searchBtn.addEventListener('click', function searchWeather() {

    weather.setAttribute('style', 'display:block');
    
    console.log(city.value);

    var geoCoding = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city.value + '&limit=5&appid=' + APIKey;

    fetch(geoCoding)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)

            var lat = data[0].lat;
            var lon = data[0].lon;
            
            var recAPI = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + APIKey + '&units=imperial';

            function setDate () {
                var date = dayjs().format('M/D/YYYY');
                var cityDate = document.getElementById('city-date');                 
                cityDate.textContent = data[0].name + ' (' + date + ')';
            }
            
            setDate();

            var fiveDate = {};

            for (let i = 0; i < 5; i++) {
                fiveDate[i] = document.getElementById('date-' + (i + 1));

                fiveDate[i].textContent = dayjs().add((i + 1), 'day').format('M/D/YYYY');
            }
            fetch(recAPI)
                .then(function (response) {
                    return response.json()
                })
                .then (function (data) {
                    console.log(data)

                    for (let i = 0; i < 6; i++) {
                        temp[i].textContent = 'Temp: ' + data.list[i].main.temp + '° F';
                        wind[i].textContent = 'Wind: ' + data.list[i].wind.speed + 'MPH';
                        humidity[i].textContent = 'Humidity: ' + data.list[i].main.humidity + '%';

                        weatherImg[i].setAttribute('src', 'https://openweathermap.org/img/wn/' + data.list[i].weather[0].icon + '.png');
                    }
                })
        })
    
    function historyStore() {

    }
});



// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=cd99b5c9c820159fbd1ce1b9e8a229c0;

// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}