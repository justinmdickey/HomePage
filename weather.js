// weather.js
const apiKey = '248cd52189f2e12c93c5f17a33cf2f51';  // Updated API Key
const city = 'Greenfield,IN';
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

function displayWeather(data) {
  const temp = data.main.temp;
  const conditions = data.weather[0].description;
  document.getElementById('temperature').innerText = `Temperature: ${temp}°F`;
  document.getElementById('conditions').innerText = `Conditions: ${conditions}`;
}

// Call the function to get and display the weather
getWeather();
