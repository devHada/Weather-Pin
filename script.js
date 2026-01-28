let inputText = document.querySelector("#input");
let dashboardScreen = document.querySelector(".dashboard_screen");
let loadingScreen = document.querySelector(".loading_screen");
let resultScreen = document.querySelector(".result_screen");
let btnDash = document.querySelector("#search");
let setDay = document.querySelector("#day");
let setDate = document.querySelector("#date");
let setLocation = document.querySelector("#location");
let setTemp = document.querySelector("#temp");
let setHumidity = document.querySelector("#humidity");
let setPrecipitation = document.querySelector("#precipitation");
let setWind = document.querySelector("#wind");
let setLogo = document.querySelector("#logo");
let setTempName = document.querySelector("#tempName");
let changeLocationBtn = document.querySelector("#change_location");

// Forecast elements
let dayToday = document.querySelector("#day_today");
let dayTomorrow = document.querySelector("#day_tomorrow");
let dayAfterTomorrow = document.querySelector("#day_after_tomorrow");
let forecastDayToday = document.querySelector("#forcast_day_today");
let forecastDayTomorrow = document.querySelector("#forcast_day_tomorrow");
let forecastDayAfterTomorrow = document.querySelector(
  "#forcast_day_after_tomorrow"
);
let forecastTempToday = document.querySelector("#forcast_temp_today");
let forecastTempTomorrow = document.querySelector("#forcast_temp_tomorrow");
let forecastTempAfterTomorrow = document.querySelector(
  "#forcast_temp_after_tomorrow"
);

let API = `181c010f4f054966a7d191409251609`;

function createSnow() {
  const snowContainer = document.getElementById("snow");
  snowContainer.innerHTML = ""; // Clear previous snowflakes

  for (let i = 0; i < 500; i++) {
    const flake = document.createElement("div");
    flake.classList.add("snowflake");

    flake.style.left = Math.random() * 100 + "vw";
    flake.style.top = -20 + Math.random() * 120 + "vh";
    flake.style.animationDuration = 2 + Math.random() * 2 + "s";
    flake.style.opacity = 0.3 + Math.random() * 0.7;

    snowContainer.appendChild(flake);
  }
}

// Function to get day name from date
function getDayName(dateString) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = new Date(dateString);
  return days[date.getDay()];
}

// Function to get short day name
function getShortDay(dateString) {
  const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const date = new Date(dateString);
  return shortDays[date.getDay()];
}

// Function to format date
function formatDate(dateString) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date(dateString);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Function to display weather data
function displayWeatherData(data, forecastData) {
  // Current weather
  setDay.textContent = getDayName(data.location.localtime);
  setDate.textContent = formatDate(data.location.localtime);
  setLocation.innerHTML = `<i class="bi bi-geo-alt"></i>${data.location.name}, ${data.location.country}`;
  setTemp.textContent = `${Math.round(data.current.temp_c)}°C`;
  setTempName.textContent = data.current.condition.text;
  setLogo.src = `https:${data.current.condition.icon}`;
  setLogo.alt = data.current.condition.text;

  // Weather details
  setHumidity.textContent = `${data.current.humidity}%`;
  setPrecipitation.textContent = `${data.current.precip_mm}mm`;
  setWind.textContent = `${data.current.wind_kph}km/h`;

  // 3-day forecast
  const forecast = forecastData.forecast.forecastday;

  // Today
  dayToday.src = `https:${forecast[0].day.condition.icon}`;
  dayToday.alt = forecast[0].day.condition.text;
  forecastDayToday.textContent = getShortDay(forecast[0].date);
  forecastTempToday.textContent = `${Math.round(forecast[0].day.avgtemp_c)}°C`;

  // Tomorrow
  dayTomorrow.src = `https:${forecast[1].day.condition.icon}`;
  dayTomorrow.alt = forecast[1].day.condition.text;
  forecastDayTomorrow.textContent = getShortDay(forecast[1].date);
  forecastTempTomorrow.textContent = `${Math.round(
    forecast[1].day.avgtemp_c
  )}°C`;

  // Day after tomorrow
  dayAfterTomorrow.src = `https:${forecast[2].day.condition.icon}`;
  dayAfterTomorrow.alt = forecast[2].day.condition.text;
  forecastDayAfterTomorrow.textContent = getShortDay(forecast[2].date);
  forecastTempAfterTomorrow.textContent = `${Math.round(
    forecast[2].day.avgtemp_c
  )}°C`;
}

// Main weather fetch function
async function fetchWeather(cityName) {
  try {
    // Show loading screen
    dashboardScreen.style.display = "none";
    loadingScreen.style.display = "flex";
    createSnow();

    // Fetch current weather
    let currentURL = `https://api.weatherapi.com/v1/current.json?key=${API}&q=${cityName}&aqi=yes`;
    let currentResponse = await fetch(currentURL);

    if (!currentResponse.ok) {
      throw new Error("City not found");
    }

    let currentData = await currentResponse.json();

    // Fetch 3-day forecast
    let forecastURL = `https://api.weatherapi.com/v1/forecast.json?key=${API}&q=${cityName}&days=3&aqi=no`;
    let forecastResponse = await fetch(forecastURL);
    let forecastData = await forecastResponse.json();

    console.log("Current Weather:", currentData);
    console.log("Forecast:", forecastData);

    // Wait for animation (3 seconds)
    setTimeout(() => {
      document.body.style.backgroundColor = "#000000";
      loadingScreen.style.display = "none";
      resultScreen.style.display = "flex";
      displayWeatherData(currentData, forecastData);
    }, 3000);
  } catch (error) {
    // Hide loading screen
    loadingScreen.style.display = "none";
    dashboardScreen.style.display = "flex";

    // Show error message
    alert(`Error: ${error.message}. Please enter a valid city name.`);
    console.error("Error fetching weather:", error);
  }
}

// Search button click event
btnDash.addEventListener("click", () => {
  let value = inputText.value.trim();

  if (value === "") {
    alert("Please Enter A City Name");
    return;
  }

  fetchWeather(value);
});

// Enter key press event
inputText.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    let value = inputText.value.trim();

    if (value === "") {
      alert("Please Enter A City Name");
      return;
    }

    fetchWeather(value);
  }
});

// Change location button
changeLocationBtn.addEventListener("click", () => {
  resultScreen.style.display = "none";
  dashboardScreen.style.display = "flex";
  inputText.value = ""; // Clear the input field
});
