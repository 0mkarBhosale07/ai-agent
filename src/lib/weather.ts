import axios from "axios";

interface WeatherResponse {
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
  }>;
  name: string;
}

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function getWeather(cities: string | string[]) {
  const cityList = Array.isArray(cities) ? cities : [cities];

  try {
    const weatherPromises = cityList.map(async (city) => {
      const response = await axios.get<WeatherResponse>(
        `${OPENWEATHER_BASE_URL}/weather`,
        {
          params: {
            q: city,
            appid: OPENWEATHER_API_KEY,
            units: "metric",
          },
        }
      );

      return {
        temperature: response.data.main.temp,
        humidity: response.data.main.humidity,
        description: response.data.weather[0].description,
        city: response.data.name,
      };
    });

    const results = await Promise.all(weatherPromises);
    return results;
  } catch (error) {
    throw new Error("Failed to fetch weather data");
  }
}
