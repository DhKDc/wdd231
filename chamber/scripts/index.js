document.addEventListener('DOMContentLoaded', () => {
    displaySpotlights();
    fetchWeatherData();
});

const displaySpotlights = async () => {
    const spotlightsGrid = document.querySelector('.spotlights-grid');
    const membersDataURL = 'data/members.json';

    if (!spotlightsGrid) {
        return;
    }

    try {
        const response = await fetch(membersDataURL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const members = await response.json();
        const eligibleMembers = members.filter(member => member.membershipLevel >= 2);
        const shuffledMembers = eligibleMembers.sort(() => 0.5 - Math.random());
        const selectedMembers = shuffledMembers.slice(0, Math.random() < 0.5 ? 2 : 3);
        spotlightsGrid.innerHTML = '';

        selectedMembers.forEach(member => {
            const card = document.createElement('div');
            card.classList.add('card', 'business-card');
            const imagePath = `images/${member.imageFileName}`;

            let membershipText = '';
            if (member.membershipLevel === 3) {
                membershipText = 'Gold Member';
            } else if (member.membershipLevel === 2) {
                membershipText = 'Silver Member';
            }

            card.innerHTML = `
                <img src="${imagePath}" alt="Logo for ${member.name}" class="business-image" loading="lazy">
                <h4 class="business-name">${member.name}</h4>
                <p class="business-tagline">${membershipText}</p>
                <div class="business-contact">
                    <p>ADDRESS: ${member.address}</p>
                    <p>PHONE: <a href="tel:${member.phone}">${member.phone}</a></p>
                    <p>URL: <a href="${member.websiteURL}" target="_blank">${member.websiteURL.replace(/^https?:\/\//, '')}</a></p>
                </div>
            `;
            spotlightsGrid.appendChild(card);
        });

    } catch (error) {
        console.error('Error fetching or displaying spotlight members:', error);
        spotlightsGrid.innerHTML = '<p>Business spotlights are currently unavailable. Please check back later.</p>';
    }
};

const fetchWeatherData = async () => {
    const currentWeatherContainer = document.querySelector('.weather-main');
    const forecastContainer = document.querySelector('.forecast-list');
    const currentTempElement = document.getElementById('current-temp');
    const weatherIconElement = document.getElementById('weather-icon');
    const weatherDescElement = document.getElementById('weather-desc');

    const apiKey = '8ebc7ac3c98464fdbecf8d3b592db9ae';
    const lat = -34.17;
    const lon = -70.74;
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    try {
        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(weatherURL),
            fetch(forecastURL)
        ]);

        if (weatherResponse.ok && forecastResponse.ok) {
            const weatherData = await weatherResponse.json();
            const forecastData = await forecastResponse.json();
            displayCurrentWeather(weatherData);
            displayForecast(forecastData);
        } else {
            throw new Error('Network response was not ok.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        if (currentWeatherContainer) currentWeatherContainer.innerHTML = '<p>Weather data unavailable.</p>';
        if (forecastContainer) forecastContainer.innerHTML = '';
    }
}

function displayCurrentWeather(data) {
    const currentTempElement = document.getElementById('current-temp');
    const weatherIconElement = document.getElementById('weather-icon');
    const weatherDescElement = document.getElementById('weather-desc');

    if (!currentTempElement || !weatherIconElement || !weatherDescElement) return;

    currentTempElement.textContent = Math.round(data.main.temp);
    const iconCode = data.weather[0].icon;
    const iconSrc = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIconElement.setAttribute('src', iconSrc);
    weatherIconElement.setAttribute('alt', data.weather[0].description);
    let desc = data.weather[0].description;
    weatherDescElement.textContent = desc.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function displayForecast(data) {
    const forecastContainer = document.querySelector('.forecast-list');
    if (!forecastContainer) return;

    forecastContainer.innerHTML = '';
    const dailyForecasts = data.list.filter(item => {
        return item.dt_txt.includes("12:00:00");
    }).slice(0, 3);

    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt_txt);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const temp = Math.round(forecast.main.temp);
        const iconCode = forecast.weather[0].icon;
        const iconSrc = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <p class="forecast-day">${dayName}</p>
            <img src="${iconSrc}" alt="${forecast.weather[0].description}" class="forecast-icon">
            <p class="forecast-temp">${temp}&deg;C</p>
        `;
        forecastContainer.appendChild(forecastItem);
    });
}