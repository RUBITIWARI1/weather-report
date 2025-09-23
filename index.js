const readline = require('readline');
const axios = require('axios');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Weather API configuration
const WEATHER_API_KEY = 'WEATHER_API_KEY'; // Replace with your API key
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

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

// Function to format weather data
function formatWeather(data) {
  const city = data.name;
  const country = data.sys.country;
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const humidity = data.main.humidity;
  const description = data.weather[0].description;
  const windSpeed = data.wind.speed;
  
  return `${colors.cyan}╔══════════════════════════════════════╗${colors.reset}
${colors.cyan}║${colors.reset} ${colors.bright}${colors.yellow}Weather Report for ${city}, ${country}${colors.reset} ${colors.cyan}║${colors.reset}
${colors.cyan}╠══════════════════════════════════════╣${colors.reset}
${colors.cyan}║${colors.reset} Temperature: ${colors.bright}${temp}°C${colors.reset} (feels like ${feelsLike}°C) ${colors.cyan}║${colors.reset}
${colors.cyan}║${colors.reset} Description: ${colors.green}${description}${colors.reset} ${colors.cyan}║${colors.reset}
${colors.cyan}║${colors.reset} Humidity: ${colors.blue}${humidity}%${colors.reset} ${colors.cyan}║${colors.reset}
${colors.cyan}║${colors.reset} Wind Speed: ${colors.magenta}${windSpeed} m/s${colors.reset} ${colors.cyan}║${colors.reset}
${colors.cyan}╚══════════════════════════════════════╝${colors.reset}`;
}

// Main function to ask for location and display weather
async function askForWeather() {
  rl.question(`${colors.bright}${colors.cyan}Enter city name (or 'quit' to exit): ${colors.reset}`, async (city) => {
    if (city.toLowerCase() === 'quit' || city.toLowerCase() === 'exit') {
      console.log(`${colors.green}Thank you for using Weather Bot! Goodbye! 👋${colors.reset}`);
      rl.close();
      return;
    }
    
    if (!city.trim()) {
      console.log(`${colors.red}Please enter a valid city name.${colors.reset}`);
      askForWeather();
      return;
    }
    
    try {
      console.log(`${colors.yellow}Fetching weather data for ${city}...${colors.reset}`);
      const weatherData = await getWeather(city);
      console.log(formatWeather(weatherData));
    } catch (error) {
      console.log(`${colors.red}Error: ${error.message}${colors.reset}`);
    }
    
    console.log(''); // Empty line for better readability
    askForWeather();
  });
}

// Welcome message
function showWelcome() {
  console.log(`
${colors.bright}${colors.cyan}╔══════════════════════════════════════════╗${colors.reset}
${colors.bright}${colors.cyan}║${colors.reset}            ${colors.bright}🌤️  WEATHER BOT  🌤️${colors.reset}             ${colors.bright}${colors.cyan}║${colors.reset}
${colors.bright}${colors.cyan}║${colors.reset}        Get current weather information!        ${colors.bright}${colors.cyan}║${colors.reset}
${colors.bright}${colors.cyan}╚══════════════════════════════════════════╝${colors.reset}

${colors.yellow}Note: You'll need a free API key from OpenWeatherMap.org${colors.reset}
${colors.yellow}1. Visit: https://openweathermap.org/api${colors.reset}
${colors.yellow}2. Sign up for a free account${colors.reset}
${colors.yellow}3. Replace 'your_api_key_here' in this script with your key${colors.reset}
`);
}

// Check if API key is set
function checkApiKey() {
  if (WEATHER_API_KEY === 'WEATHER_API_KEY') {
    console.log(`${colors.red}⚠️  Warning: Please set your OpenWeatherMap API key!${colors.reset}`);
    console.log(`${colors.yellow}Edit the WEATHER_API_KEY variable in index.js with your actual API key.${colors.reset}`);
    console.log('');
  }
}

// Start the application
function main() {
  showWelcome();
  checkApiKey();
  console.log(`${colors.green}Weather Bot is ready! 🚀${colors.reset}`);
  console.log('');
  askForWeather();
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log(`\n${colors.green}Thank you for using Weather Bot! Goodbye! 👋${colors.reset}`);
  process.exit(1);
});

// Start the bot
main();
