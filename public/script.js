// DOM elements
const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const submitBtn = document.getElementById('submitBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const weatherResult = document.getElementById('weatherResult');
const errorMessage = document.getElementById('errorMessage');

// Weather icons mapping
const weatherIcons = {
    '01d': 'fas fa-sun',
    '01n': 'fas fa-moon',
    '02d': 'fas fa-cloud-sun',
    '02n': 'fas fa-cloud-moon',
    '03d': 'fas fa-cloud',
    '03n': 'fas fa-cloud',
    '04d': 'fas fa-cloud',
    '04n': 'fas fa-cloud',
    '09d': 'fas fa-cloud-rain',
    '09n': 'fas fa-cloud-rain',
    '10d': 'fas fa-cloud-sun-rain',
    '10n': 'fas fa-cloud-moon-rain',
    '11d': 'fas fa-bolt',
    '11n': 'fas fa-bolt',
    '13d': 'fas fa-snowflake',
    '13n': 'fas fa-snowflake',
    '50d': 'fas fa-smog',
    '50n': 'fas fa-smog'
};

// Function to show loading state
function showLoading() {
    loadingSpinner.style.display = 'block';
    weatherResult.style.display = 'none';
    errorMessage.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
}

// Function to hide loading state
function hideLoading() {
    loadingSpinner.style.display = 'none';
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-search"></i> Get Weather';
}

// Function to show error message
function showError(message) {
    hideLoading();
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    weatherResult.style.display = 'none';
}

// Function to get weather icon class
function getWeatherIcon(iconCode) {
    return weatherIcons[iconCode] || 'fas fa-cloud';
}

// Function to format weather data
function formatWeatherData(data) {
    const iconClass = getWeatherIcon(data.icon);
    
    return `
        <div class="weather-header">
            <div class="weather-location">${data.city}</div>
            <div class="weather-country">${data.country}</div>
        </div>
        
        <div class="weather-main">
            <div class="weather-icon">
                <i class="${iconClass}"></i>
            </div>
            <div class="weather-temp">${data.temperature}°C</div>
        </div>
        
        <div class="weather-description">
            <p style="text-align: center; font-size: 1.2rem; color: #666; margin-bottom: 20px;">
                ${data.description.charAt(0).toUpperCase() + data.description.slice(1)}
            </p>
        </div>
        
        <div class="weather-details">
            <div class="weather-detail">
                <div class="weather-detail-label">Feels Like</div>
                <div class="weather-detail-value">${data.feelsLike}°C</div>
            </div>
            <div class="weather-detail">
                <div class="weather-detail-label">Humidity</div>
                <div class="weather-detail-value">${data.humidity}%</div>
            </div>
            <div class="weather-detail">
                <div class="weather-detail-label">Wind Speed</div>
                <div class="weather-detail-value">${data.windSpeed} m/s</div>
            </div>
            <div class="weather-detail">
                <div class="weather-detail-label">Pressure</div>
                <div class="weather-detail-value">${data.pressure} hPa</div>
            </div>
            <div class="weather-detail">
                <div class="weather-detail-label">Visibility</div>
                <div class="weather-detail-value">${data.visibility} km</div>
            </div>
        </div>
    `;
}

// Function to fetch weather data
async function fetchWeatherData(city) {
    try {
        const response = await fetch('/api/weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ city: city })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch weather data');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
}

// Function to display weather result
function displayWeatherResult(data) {
    hideLoading();
    weatherResult.innerHTML = formatWeatherData(data);
    weatherResult.style.display = 'block';
    errorMessage.style.display = 'none';
}

// Event listener for form submission
weatherForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name.');
        return;
    }
    
    showLoading();
    
    try {
        const weatherData = await fetchWeatherData(city);
        displayWeatherResult(weatherData);
    } catch (error) {
        showError(error.message);
    }
});

// Event listener for Enter key in input
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        weatherForm.dispatchEvent(new Event('submit'));
    }
});

// Focus on input when page loads
window.addEventListener('load', () => {
    cityInput.focus();
});

// Add some nice animations and interactions
cityInput.addEventListener('focus', () => {
    cityInput.style.transform = 'scale(1.02)';
});

cityInput.addEventListener('blur', () => {
    cityInput.style.transform = 'scale(1)';
});

// Add click animation to submit button
submitBtn.addEventListener('click', () => {
    submitBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        submitBtn.style.transform = 'scale(1)';
    }, 150);
});
