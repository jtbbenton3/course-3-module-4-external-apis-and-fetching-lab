const API_KEY = 'dce204058927becc796d9cd2c7a7f8b7';
const BASE    = 'https://api.openweathermap.org/data/2.5/weather';

/* ---------- HELPERS ---------- */
function toCelsius(rawTemp) {
  // If the value looks like Kelvin (>120 K), convert; otherwise assume °C already.
  return Math.round(rawTemp > 120 ? rawTemp - 273.15 : rawTemp);
}

/* ---------- CORE FETCH ---------- */
async function fetchWeatherData(city) {
  if (!city) throw new Error('Please enter a city name');

  const url = `${BASE}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('City not found');
    return await res.json();
  } catch (err) {
    throw new Error(err.message || 'Network Error');
  }
}

/* ---------- DOM RENDERERS ---------- */
function displayWeather(data) {
  const weatherDisplay = document.getElementById('weather-display');
  const errorDiv       = document.getElementById('error-message');
  if (errorDiv) errorDiv.classList.add('hidden');

  const tempC = toCelsius(data.main.temp);

  weatherDisplay.innerHTML = `
    <h2>${data.name}</h2>
    <p><strong>Temperature:</strong> ${tempC}°C</p>
    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
    <p><strong>Condition:</strong> ${data.weather[0].description}</p>
  `;
}

function displayError(message) {
  const errorDiv = document.getElementById('error-message');
  if (!errorDiv) return;
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
}

/* ---------- UI WIRING ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const btn       = document.getElementById('fetch-weather');
  const cityInput = document.getElementById('city-input');
  const spinner   = document.getElementById('loading-spinner');

  btn.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    if (!city) {
      displayError('Please enter a city name');
      return;
    }

    if (spinner) spinner.style.display = 'block';

    try {
      const data = await fetchWeatherData(city);
      displayWeather(data);
    } catch (err) {
      displayError(err.message);
    } finally {
      if (spinner) spinner.style.display = 'none';
    }
  });
});


if (typeof module !== 'undefined' && module.exports) {
  module.exports = { fetchWeatherData, displayWeather, displayError, toCelsius };
}