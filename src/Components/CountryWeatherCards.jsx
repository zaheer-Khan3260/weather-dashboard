import React, { useMemo } from 'react';
import useFetchWeather from '../customHooks/useFetchWeather';
import weatherIcon from "../Icons/weather.gif"

const CountryWeatherCard = ({ country }) => {
  const { currentWeather, loading, error } = useFetchWeather(country);

  const weatherData = useMemo(() => {
    if (!currentWeather || !currentWeather.current || !currentWeather.location) {
      return null;
    }
    const { current, location } = currentWeather;
    return {
      temperature: current.temperature,
      country: location.country,
      weatherIcon: current.weather_icons?.[0] || '',
      description: current.weather_descriptions?.[0] || '',
      feelsLike: current.feelslike,
      humidity: current.humidity,
    };
  }, [currentWeather]);

  if (loading) return <div className="animate-pulse bg-gray-700 w-64 h-40 rounded-2xl"></div>;
  if (error) return <div className="text-red-500">Error fetching weather data</div>;
  if (!weatherData) return null;

  return (
    <div className="bg-gray-900 text-white p-4 rounded-2xl w-64 border border-blue-500 relative overflow-hidden">
      {/* Blue glow effect */}
      <div className="absolute inset-0 bg-blue-500 opacity-10 blur-xl"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-bold">{weatherData.temperature}°</h1>
            <p className="text-sm text-gray-400 mt-1">{weatherData.description}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">{country}</p>
            
              <img src={weatherIcon} alt="Weather icon" className="w-12 h-12 mt-2" />
            
          </div>
        </div>
        <div className="mt-4 text-sm">
          <p>Feels like: {weatherData.feelsLike}°</p>
          <p>Humidity: {weatherData.humidity}%</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CountryWeatherCard);