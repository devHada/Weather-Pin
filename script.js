const inputText = document.querySelector("#input");
const dashboardScreen = document.querySelector("#dashboard");
const loadingScreen = document.querySelector("#loading");
const resultScreen = document.querySelector("#result");
const btnDash = document.querySelector("#search");

const setDay = document.querySelector("#day");
const setDate = document.querySelector("#date");
const setLocation = document.querySelector("#location");
const setTemp = document.querySelector("#temp");
const setHumidity = document.querySelector("#humidity");
const setPrecipitation = document.querySelector("#precipitation");
const setWind = document.querySelector("#wind");
const setLogo = document.querySelector("#logo");
const setTempName = document.querySelector("#tempName");
const changeLocationBtn = document.querySelector("#change_location");

const dayToday = document.querySelector("#day_today");
const dayTomorrow = document.querySelector("#day_tomorrow");
const dayAfterTomorrow = document.querySelector("#day_after_tomorrow");
const forecastDayToday = document.querySelector("#forcast_day_today");
const forecastDayTomorrow = document.querySelector("#forcast_day_tomorrow");
const forecastDayAfterTomorrow = document.querySelector(
  "#forcast_day_after_tomorrow",
);
const forecastTempToday = document.querySelector("#forcast_temp_today");
const forecastTempTomorrow = document.querySelector("#forcast_temp_tomorrow");
const forecastTempAfterTomorrow = document.querySelector(
  "#forcast_temp_after_tomorrow",
);

const API = `181c010f4f054966a7d191409251609`;

function createSnow() {
  const snowContainer = document.getElementById("snow");
  snowContainer.innerHTML = "";
  for (let i = 0; i < 120; i++) {
    const flake = document.createElement("div");
    flake.classList.add("snowflake");
    flake.style.left = Math.random() * 100 + "vw";
    flake.style.top = -20 + Math.random() * 100 + "vh";
    flake.style.animationDuration = 2 + Math.random() * 3 + "s";
    flake.style.animationDelay = Math.random() * 2 + "s";
    flake.style.opacity = 0.3 + Math.random() * 0.6;
    snowContainer.appendChild(flake);
  }
}

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
  return days[new Date(dateString).getDay()];
}

function getShortDay(dateString) {
  const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return shortDays[new Date(dateString).getDay()];
}

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

function displayWeatherData(data, forecastData) {
  setDay.textContent = getDayName(data.location.localtime);
  setDate.textContent = formatDate(data.location.localtime);
  setLocation.innerHTML = `<i class="bi bi-geo-alt-fill"></i> ${data.location.name}, ${data.location.country}`;
  setTemp.textContent = `${Math.round(data.current.temp_c)}°C`;
  setTempName.textContent = data.current.condition.text;
  setLogo.src = `https:${data.current.condition.icon}`;
  setLogo.alt = data.current.condition.text;

  setHumidity.textContent = `${data.current.humidity}%`;
  setPrecipitation.textContent = `${data.current.precip_mm}mm`;
  setWind.textContent = `${data.current.wind_kph}km/h`;

  const forecast = forecastData.forecast.forecastday;

  dayToday.src = `https:${forecast[0].day.condition.icon}`;
  dayToday.alt = forecast[0].day.condition.text;
  forecastDayToday.textContent = getShortDay(forecast[0].date);
  forecastTempToday.textContent = `${Math.round(forecast[0].day.avgtemp_c)}°C`;

  dayTomorrow.src = `https:${forecast[1].day.condition.icon}`;
  dayTomorrow.alt = forecast[1].day.condition.text;
  forecastDayTomorrow.textContent = getShortDay(forecast[1].date);
  forecastTempTomorrow.textContent = `${Math.round(forecast[1].day.avgtemp_c)}°C`;

  dayAfterTomorrow.src = `https:${forecast[2].day.condition.icon}`;
  dayAfterTomorrow.alt = forecast[2].day.condition.text;
  forecastDayAfterTomorrow.textContent = getShortDay(forecast[2].date);
  forecastTempAfterTomorrow.textContent = `${Math.round(forecast[2].day.avgtemp_c)}°C`;
}

async function fetchWeather(cityName) {
  try {
    dashboardScreen.style.display = "none";
    loadingScreen.style.display = "flex";
    createSnow();

    const currentURL = `https://api.weatherapi.com/v1/current.json?key=${API}&q=${cityName}&aqi=yes`;
    const currentResponse = await fetch(currentURL);

    if (!currentResponse.ok) throw new Error("City not found");

    const currentData = await currentResponse.json();

    const forecastURL = `https://api.weatherapi.com/v1/forecast.json?key=${API}&q=${cityName}&days=3&aqi=no`;
    const forecastResponse = await fetch(forecastURL);
    const forecastData = await forecastResponse.json();

    console.log("Current Weather:", currentData);
    console.log("Forecast:", forecastData);

    setTimeout(() => {
      loadingScreen.style.display = "none";
      resultScreen.style.display = "flex";
      displayWeatherData(currentData, forecastData);
    }, 2500);
  } catch (error) {
    loadingScreen.style.display = "none";
    dashboardScreen.style.display = "flex";
    alert(`Error: ${error.message}. Please enter a valid city name.`);
    console.error("Error fetching weather:", error);
  }
}

btnDash.addEventListener("click", () => {
  const value = inputText.value.trim();
  if (!value) {
    alert("Please enter a city name");
    return;
  }
  fetchWeather(value);
});

inputText.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const value = inputText.value.trim();
    if (!value) {
      alert("Please enter a city name");
      return;
    }
    fetchWeather(value);
  }
});

changeLocationBtn.addEventListener("click", () => {
  resultScreen.style.display = "none";
  dashboardScreen.style.display = "flex";
  inputText.value = "";
});
