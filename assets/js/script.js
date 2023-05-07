var APIKey = "cd99b5c9c820159fbd1ce1b9e8a229c0";

var lat
var lon

var temp = [];
var wind = [];  
var humidity = [];
var weatherImg = [];
var historyBtn = [];

var city = document.getElementById('city-search');
var searchBtn = document.getElementById('search-button');
var weather = document.getElementById('weather');
var searchHistory = document.getElementById('history');


function init () {
    weather.setAttribute('style', 'display:none');

    var storedSearch = JSON.parse(localStorage.getItem('search'));

    if (storedSearch !== null) {
        searchHistory.setAttribute('style', 'display:block');

        for (let i = 0; i < storedSearch.length; i++) {

            historyBtn[i] = document.createElement('button');
            historyBtn[i].setAttribute('class', 'search-history btn');
            searchHistory.appendChild(historyBtn[i]);
            historyBtn[i].textContent = storedSearch[i];
            historyBtn[i].setAttribute('style', 'display:block');

            historyBtn[i].addEventListener('click', function() {
                call('http://api.openweathermap.org/geo/1.0/direct?q=' + storedSearch[i] + '&limit=5&appid=' + APIKey)
                
                weather.setAttribute('style', 'display:block');
            })
            
        }
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

function deleteBtns () {

    for (let i = 0; i < historyBtn.length; i++) {
        searchHistory.removeChild(historyBtn[i]);
    }
}

init();
makeElements();

searchBtn.addEventListener('click', function searchWeather(event) {

    event.preventDefault();
    
    var storedSearch = JSON.parse(localStorage.getItem('search'));

    function saveHistory () {

        if (city.value == "") {
            return;
        } else if (storedSearch !== null) {

            storedSearch.push(city.value);

            localStorage.setItem('search', JSON.stringify(storedSearch));

            for (let i = 0; i < storedSearch.length; i++) {

                historyBtn[i] = document.createElement('button');
                historyBtn[i].setAttribute('class', 'search-history btn');
                searchHistory.appendChild(historyBtn[i]);
                historyBtn[i].textContent = storedSearch[i];
                historyBtn[i].setAttribute('style', 'display:block');

                historyBtn[i].addEventListener('click', function() {
                    call('http://api.openweathermap.org/geo/1.0/direct?q=' + storedSearch[i] + '&limit=5&appid=' + APIKey)
                    
                    weather.setAttribute('style', 'display:block');
                })
                
            }
        } else {

            var array = [];

            array.push(city.value);

            localStorage.setItem('search', JSON.stringify(array));

            historyBtn[0] = document.createElement('button');
            historyBtn[0].setAttribute('class', 'search-history btn');
            searchHistory.appendChild(historyBtn[0]);
            historyBtn[0].textContent = array[0];
            historyBtn[0].setAttribute('style', 'display:block');

            historyBtn[0].addEventListener('click', function() {
                call('http://api.openweathermap.org/geo/1.0/direct?q=' + storedSearch[0] + '&limit=5&appid=' + APIKey)
                
                weather.setAttribute('style', 'display:block');
            })
            
        }
    }

    weather.setAttribute('style', 'display:block');
    
    console.log(city.value);
    
    call('http://api.openweathermap.org/geo/1.0/direct?q=' + city.value + '&limit=5&appid=' + APIKey)

    if (storedSearch !== null && storedSearch.includes(city.value)) {
        return;
    } else {
        deleteBtns();
        saveHistory();
    } 
});

function call (geoCoding) {
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
}

// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=cd99b5c9c820159fbd1ce1b9e8a229c0;

// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}