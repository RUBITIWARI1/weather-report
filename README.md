# Weather Report Bot 🌤️

A simple and interactive weather bot that provides current weather information for any city worldwide.

## Features

- 🌍 Get weather for any city worldwide
- 🌡️ Temperature (actual and feels-like)
- 💧 Humidity percentage
- 💨 Wind speed
- ☁️ Weather description
- 🎨 Beautiful colored console output
- 🔄 Interactive command-line interface

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Get a free API key:**
   - Visit [OpenWeatherMap API](https://openweathermap.org/api)
   - Sign up for a free account
   - Get your API key

3. **Configure the API key:**
   - Open `index.js`
   - Replace `your_api_key_here` with your actual API key:
   ```javascript
   const WEATHER_API_KEY = 'your_actual_api_key_here';
   ```

## Usage

Run the bot:
```bash
npm start
```

Then simply enter any city name when prompted:
- `London`
- `New York`
- `Tokyo`
- `Paris`
- etc.

Type `quit` or `exit` to stop the bot.

## Example Output

```
╔══════════════════════════════════════╗
║ Weather Report for London, GB        ║
╠══════════════════════════════════════╣
║ Temperature: 15°C (feels like 13°C)  ║
║ Description: light rain              ║
║ Humidity: 78%                        ║
║ Wind Speed: 3.2 m/s                  ║
╚══════════════════════════════════════╝
```

## Requirements

- Node.js (v12 or higher)
- Internet connection
- OpenWeatherMap API key (free)

## Error Handling

The bot handles various error scenarios:
- Invalid city names
- Network connectivity issues
- Invalid API keys
- API rate limits

## License

MIT License - feel free to use and modify!
