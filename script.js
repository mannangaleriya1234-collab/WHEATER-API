  // Open-Meteo is free and needs no API key
  const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
  const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

  // Weather code -> [description, emoji, background class]
  const CODES = {
    0: ["Clear sky", "☀️", "sunny"],
    1: ["Mostly clear", "🌤️", "sunny"],
    2: ["Partly cloudy", "⛅", "cloudy"],
    3: ["Overcast", "☁️", "cloudy"],
    45: ["Fog", "🌫️", "cloudy"],
    48: ["Icy fog", "🌫️", "cloudy"],
    51: ["Light drizzle", "🌦️", "rainy"],
    53: ["Drizzle", "🌦️", "rainy"],
    55: ["Heavy drizzle", "🌦️", "rainy"],
    61: ["Light rain", "🌧️", "rainy"],
    63: ["Rain", "🌧️", "rainy"],
    65: ["Heavy rain", "🌧️", "rainy"],
    71: ["Light snow", "🌨️", "snowy"],
    73: ["Snow", "🌨️", "snowy"],
    75: ["Heavy snow", "❄️", "snowy"],
    80: ["Rain showers", "🌦️", "rainy"],
    81: ["Rain showers", "🌧️", "rainy"],
    82: ["Violent showers", "🌧️", "rainy"],
    95: ["Thunderstorm", "⛈️", "stormy"],
    96: ["Thunderstorm with hail", "⛈️", "stormy"],
    99: ["Thunderstorm with hail", "⛈️", "stormy"]
  };

  let unit = "celsius";      // or "fahrenheit"
  let lastPlace = null;      // remember so the unit toggle can refetch

  const $ = (id) => document.getElementById(id);
  const msg = (text) => { $("message").textContent = text; };

  function info(code) {
    return CODES[code] || ["Unknown", "🌡️", "cloudy"];
  }

  async function searchCity(name) {
    msg("Searching...");
    try {
      const res = await fetch(`${GEO_URL}?name=${encodeURIComponent(name)}&count=1`);
      const data = await res.json();
      if (!data.results || data.results.length === 0) {
        msg(`Couldn't find "${name}". Check the spelling and try again.`);
        return;
      }
      const p = data.results[0];
      const label = p.country ? `${p.name}, ${p.country}` : p.name;
      getWeather(p.latitude, p.longitude, label);
    } catch (err) {
      msg("Network problem. Check your internet and try again.");
    }
  }

  async function getWeather(lat, lon, label) {
    lastPlace = { lat, lon, label };
    msg("Loading weather...");
    const params = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      current: "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day",
      daily: "weather_code,temperature_2m_max,temperature_2m_min",
      timezone: "auto",
      forecast_days: 5,
      temperature_unit: unit
    });
    try {
      const res = await fetch(`${WEATHER_URL}?${params}`);
      if (!res.ok) throw new Error("bad response");
      show(await res.json(), label);
      msg("");
    } catch (err) {
      msg("Couldn't load the weather. Try again in a moment.");
    }
  }

  function show(data, label) {
    const c = data.current;
    const sym = unit === "celsius" ? "°C" : "°F";
    const [desc, icon, theme] = info(c.weather_code);

    $("cityName").textContent = label;
    $("icon").textContent = icon;
    $("temp").textContent = `${Math.round(c.temperature_2m)}${sym}`;
    $("desc").textContent = desc;
    $("feels").textContent = `${Math.round(c.apparent_temperature)}${sym}`;
    $("humidity").textContent = `${c.relative_humidity_2m}%`;
    $("wind").textContent = `${Math.round(c.wind_speed_10m)} km/h`;

    // Background follows the weather (and goes dark at night)
    document.body.className = c.is_day ? theme : "night";

    const box = $("forecast");
    box.innerHTML = "";
    data.daily.time.forEach((date, i) => {
      const dayName = i === 0
        ? "Today"
        : new Date(date + "T00:00").toLocaleDateString(undefined, { weekday: "long" });
      const row = document.createElement("div");
      row.className = "day";
      row.innerHTML =
        `<span>${dayName}</span>` +
        `<span>${info(data.daily.weather_code[i])[1]}</span>` +
        `<span>${Math.round(data.daily.temperature_2m_max[i])}° ` +
        `<span class="lo">${Math.round(data.daily.temperature_2m_min[i])}°</span></span>`;
      box.appendChild(row);
    });

    $("weather").classList.remove("hidden");
  }

  // --- Events ---
  $("searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("cityInput").value.trim();
    if (name) searchCity(name);
  });

  $("unitBtn").addEventListener("click", () => {
    unit = unit === "celsius" ? "fahrenheit" : "celsius";
    $("unitBtn").textContent = unit === "celsius" ? "Switch to °F" : "Switch to °C";
    if (lastPlace) getWeather(lastPlace.lat, lastPlace.lon, lastPlace.label);
  });

  $("locBtn").addEventListener("click", () => {
    if (!navigator.geolocation) {
      msg("Your browser doesn't support location. Search for a city instead.");
      return;
    }
    msg("Finding your location...");
    navigator.geolocation.getCurrentPosition(
      (pos) => getWeather(pos.coords.latitude, pos.coords.longitude, "Your location"),
      () => msg("Location access was blocked. Search for a city instead.")
    );
  });

  // Start with a default city so the page isn't empty
  searchCity("Surat");
