const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Weather API configuration
const WEATHER_API_KEY = 'your_api_key_here'; // Replace with your API key
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Function to get weather data
async function getWeather(city) {
  try {
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        q: city,
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error(`City "${city}" not found. Please check the spelling.`);
    } else if (error.response && error.response.status === 401) {
      throw new Error('Invalid API key. Please check your API key.');
    } else {
      throw new Error('Unable to fetch weather data. Please try again later.');
    }
  }
}

// Function to format weather data for API response
function formatWeatherData(data) {
  return {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    description: data.weather[0].description,
    windSpeed: data.wind.speed,
    icon: data.weather[0].icon,
    pressure: data.main.pressure,
    visibility: data.visibility ? Math.round(data.visibility / 1000) : 'N/A'
  };
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/weather', async (req, res) => {
  try {
    const { city } = req.body;
    
    if (!city || !city.trim()) {
      return res.status(400).json({ 
        error: 'Please enter a valid city name.' 
      });
    }
    
    const weatherData = await getWeather(city.trim());
    const formattedData = formatWeatherData(weatherData);
    
    res.json(formattedData);
  } catch (error) {
    res.status(400).json({ 
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Page not found' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌤️  Weather Bot Server running on http://localhost:${PORT}`);
  console.log(`📱 Open your browser and visit the URL above to use the web interface`);
  console.log(`💻 For CLI version, run: npm run cli`);
  
  if (WEATHER_API_KEY === 'WEATHER_API_KEY') {
    console.log(`⚠️  Warning: Please set your OpenWeatherMap API key in server.js`);
  }
});
