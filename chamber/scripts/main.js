// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // Initialize Lucide Icons
    // Ensure Lucide is loaded before this script or handle potential errors
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    } else {
        console.warn('Lucide icons library not found. Icons will not be rendered.');
    }

    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            // Toggle 'active' class on the button for icon switching
            mobileMenuButton.classList.toggle('active');
            
            // Toggle 'open' class on the menu to show/hide it
            const isMenuOpen = mobileMenu.classList.toggle('open');
            
            // Update ARIA attribute for accessibility
            mobileMenuButton.setAttribute('aria-expanded', isMenuOpen);
        });
    } else {
        console.warn('Mobile menu button or menu element not found.');
    }

    // --- Dark Mode Toggle ---
    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;

    if (darkModeToggle) {
        // Function to apply the theme
        const applyTheme = (isDark) => {
            if (isDark) {
                htmlElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                htmlElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
        };

        // Check for saved preference or system setting
        if (localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            applyTheme(true);
        } else {
            applyTheme(false);
        }

        // Toggle theme on button click
        darkModeToggle.addEventListener('click', () => {
            const isCurrentlyDark = htmlElement.classList.contains('dark');
            applyTheme(!isCurrentlyDark);
        });
    } else {
        console.warn('Dark mode toggle button not found.');
    }

    // Footer: Current Year and Last Modified
    const currentYearSpan = document.getElementById('currentYear');
    const lastModifiedSpan = document.getElementById('lastModified');

    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    if (lastModifiedSpan) {
        // For 'Last Modification', in a real scenario, this would be server-generated or from build time.
        // document.lastModified refers to the HTML document itself.
        const lastModDate = new Date(document.lastModified);
        if (document.lastModified && lastModDate.getFullYear() > 1970) { // Check if a valid date is returned
             lastModifiedSpan.textContent = lastModDate.toLocaleDateString('en-US', {
                month: '2-digit', day: '2-digit', year: 'numeric'
            }) + ' ' + lastModDate.toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
        } else {
             // Fallback if document.lastModified is not useful (e.g. dynamically generated page)
            const now = new Date();
             lastModifiedSpan.textContent = now.toLocaleDateString('en-US', {
                month: '2-digit', day: '2-digit', year: 'numeric'
            }) + ' ' + now.toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
        }
    }

    // Modal logic
    const modalLinks = document.querySelectorAll('.modal-link');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-button');

    modalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = link.getAttribute('data-modal');
            document.getElementById(modalId).style.display = 'block';
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Timestamp logic
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }

    const urlParams = new URLSearchParams(window.location.search);
    const summaryContainer = document.getElementById('submission-summary');
    let summaryHTML = '<dl class="submission-details">';

    const labels = {
        firstName: "First Name",
        lastName: "Last Name",
        title: "Title",
        email: "Email",
        mobile: "Mobile Phone",
        organization: "Organization",
        membershipLevel: "Membership Level",
        description: "Description",
        timestamp: "Submission Time"
    };

    for (const [key, value] of urlParams.entries()) {
        if (value) {
            const label = labels[key] || key;
            let displayValue = value;
            if (key === 'timestamp') {
                displayValue = new Date(value).toLocaleString();
            }
            summaryHTML += `<dt>${label}</dt><dd>${displayValue}</dd>`;
        }
    }
    summaryHTML += '</dl>';
    summaryContainer.innerHTML = summaryHTML;
    
    displaySpotlights();
    fetchWeatherData();
});

// --- Business Spotlights ---
const displaySpotlights = async () => {
    const spotlightsGrid = document.querySelector('.spotlights-grid');
    const membersDataURL = 'data/members.json'; // Relative path from index.html

    if (!spotlightsGrid) {
        console.warn('Spotlights grid not found on this page.');
        return;
    }

    try {
        const response = await fetch(membersDataURL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const members = await response.json();

        // Filter for Gold (3) and Silver (2) members
        const eligibleMembers = members.filter(member => member.membershipLevel >= 2);

        // Shuffle the array to randomize
        const shuffledMembers = eligibleMembers.sort(() => 0.5 - Math.random());

        // Select 2 or 3 members
        const selectedMembers = shuffledMembers.slice(0, Math.random() < 0.5 ? 2 : 3);

        // Clear existing placeholder content
        spotlightsGrid.innerHTML = '';

        // Create and append new spotlight cards
        selectedMembers.forEach(member => {
            const card = document.createElement('div');
            card.classList.add('card', 'business-card');
            
            const imagePath = `images/${member.imageFileName}`; // Assumes images are in the 'images' folder

            // Define membership level text
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
// --- WEATHER API ---

// Select HTML elements for weather display
const currentWeatherContainer = document.querySelector('.weather-main');
const forecastContainer = document.querySelector('.forecast-list');
const currentTempElement = document.getElementById('current-temp');
const weatherIconElement = document.getElementById('weather-icon');
const weatherDescElement = document.getElementById('weather-desc');

// Define API URL and key
const apiKey = '8ebc7ac3c98464fdbecf8d3b592db9ae';
const lat = -34.17;
const lon = -70.74;
const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

// Asynchronous function to fetch data
async function fetchWeatherData() {
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
        // Optionally display an error message to the user
        if(currentWeatherContainer) currentWeatherContainer.innerHTML = '<p>Weather data unavailable.</p>';
        if(forecastContainer) forecastContainer.innerHTML = '';

    }
}

// Function to display current weather
function displayCurrentWeather(data) {
    if (!currentTempElement || !weatherIconElement || !weatherDescElement) return;

    // Update current temperature
    currentTempElement.textContent = Math.round(data.main.temp);

    // Update weather icon
    const iconCode = data.weather[0].icon;
    const iconSrc = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIconElement.setAttribute('src', iconSrc);
    weatherIconElement.setAttribute('alt', data.weather[0].description);

    // Update weather description and capitalize it
    let desc = data.weather[0].description;
    weatherDescElement.textContent = desc.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Function to display 3-day forecast
function displayForecast(data) {
    if (!forecastContainer) return;

    // Clear previous forecast content
    forecastContainer.innerHTML = '';

    // Filter to get one forecast per day (e.g., for 12:00 PM)
    const dailyForecasts = data.list.filter(item => {
        return item.dt_txt.includes("12:00:00");
    }).slice(0, 3); // Get the next 3 days

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

