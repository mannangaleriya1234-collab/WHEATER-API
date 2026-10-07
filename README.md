# Weather App 🌤️

A simple weather website I made using plain HTML, CSS and JavaScript. You type in a city and it shows the current weather and a 5 day forecast. The background color also changes depending on the weather (sunny, rainy, cloudy, etc).

## About

I made this as one of my web development projects to practice using APIs with JavaScript. It was my first time using `fetch()` to get real data from the internet, so I learned a lot about how async/await works and how to handle errors when the city isn't found. I also tried to make it look decent on phones too.

## Features

- Search weather by city name
- Use your current location (button)
- Current temperature, feels like, humidity and wind speed
- 5 day forecast
- Switch between °C and °F
- Background changes with the weather (and goes dark at night)

## Files

```
weather-app/
├── index.html   -> the page
├── style.css    -> all the styling
├── script.js    -> API calls and logic
└── README.md    -> this file
```

## How to run it

There's nothing to compile or install, it's just a normal website.

1. Unzip the folder
2. Open `index.html` in any browser (Chrome, Edge, Firefox)
3. Type a city and press Search

You need internet because it gets the data live from the API.

**Note:** the "Use my location" button might not work if you open the file directly (`file://`). If that happens, run a small local server instead:

```
cd weather-app
python -m http.server 8000
```

Then go to `http://localhost:8000` in your browser. (If you use VS Code, the "Live Server" extension does the same thing.)

## API used

I used [Open-Meteo](https://open-meteo.com/). It's free and you don't need an API key, which made it really easy to start with.

- Geocoding API: turns a city name into latitude/longitude
- Forecast API: gives the weather for those coordinates

## Things I want to add later

- Hourly forecast
- Recent searches list
- Dark/light mode toggle

## Made with

HTML, CSS, JavaScript
