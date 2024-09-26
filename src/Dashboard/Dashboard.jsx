import React, { useEffect, useState, useCallback, useMemo } from "react";
import { CgPin } from "react-icons/cg";
import CloudGif from "../Icons/clouds.gif";
import CloudyGif from "../Icons/cloudy.gif";
import WeatherIcon from "../Icons/weather.gif";
import SunnyIcon from "../Icons/sun.gif";
import { IoSearch } from "react-icons/io5";
import CountryWeatherCard from "../Components/CountryWeatherCards";
import useFetchWeather from "../customHooks/useFetchWeather";
import axios from "axios";

const Dashboard = () => {
  const [location, setLocation] = useState(null);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { currentWeather, forecast, loading, error } = useFetchWeather(location);
  const [weatherData, setWeatherData] = useState(null);

  const shortDaysName = {
    Sun: Math.floor(Math.random() * 21) + 10,
    Mon: Math.floor(Math.random() * 21) + 10,
    Tue: Math.floor(Math.random() * 21) + 10,
    Wed: Math.floor(Math.random() * 21) + 10,
    Thu: Math.floor(Math.random() * 21) + 10,
    Fri: Math.floor(Math.random() * 21) + 10,
    Sat: Math.floor(Math.random() * 21) + 10,
  };

  const todayDate = new Date();
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const day = daysOfWeek[todayDate.getDay()];
  
  const getTomorrowDay = () => {
    const tomorrow = new Date(todayDate);
    tomorrow.setDate(todayDate.getDate() + 1);
    return tomorrow.toString().split(' ')[0];
  };

  useEffect(() => {
    // Fetch current location on component mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude},${longitude}`);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocation("New York"); // Default location if geolocation fails
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      setLocation("New York"); // Default location if geolocation is not supported
    }
  }, []);

  const handleSearch = useCallback(() => {
    if (search) {
      setLocation(search);
    }
  }, [search]);

  const handleSuggestionSelect = (suggestion) => {
    setSearch(suggestion);
    setLocation(suggestion);
    setSuggestions([]);
  };

  const fetchSuggestions = useCallback(async (input) => {
    if (input.length > 2) {
      try {
        const response = await axios.get(`https://api.teleport.org/api/cities/?search=${input}&limit=5`);
        const cities = response.data._embedded['city:search-results'].map(result => result.matching_full_name);
        setSuggestions(cities);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  }, []);

  useEffect(() => {
    if (currentWeather) {
      setWeatherData(currentWeather.current);
      if (currentWeather.location) {
        setSearch(`${currentWeather.location.name}, ${currentWeather.location.country}`);
      }
    }
  }, [currentWeather]);

  useEffect(() => {
    fetchSuggestions(search);
  }, [search, fetchSuggestions]);

  const countryCards = useMemo(() => {
    const countries = ["Dubai-UAE", "USA", "China", "Canada"];
    return countries.map(country => (
      <CountryWeatherCard key={country} country={country} />
    ));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!weatherData) {
    return <div>No weather data available</div>;
  }

  return (
    <>
      <header className="bg-[rgb(6,12,26)] text-white flex flex-col sm:flex-row justify-between items-center p-4">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="flex items-center">
            <CgPin className="mr-2" />
            <span>{currentWeather?.location?.name || "Loading..."}</span>
          </div>
        </div>
        <div className="flex-grow mx-4 w-full sm:w-auto relative">
          <input
            type="text"
            placeholder="Search city..."
            className="w-full sm:w-64 md:w-80 lg:w-96 p-3 rounded-full border-gray-500 border-2 bg-[rgb(14,20,33)] text-white placeholder:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <div className="absolute top-3 left-[21rem] cursor-pointer" onClick={handleSearch}>
            <IoSearch className="text-2xl text-white" />
          </div>
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-[rgb(14,20,33)] border border-gray-500 rounded-md mt-1">
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index} 
                  className="p-2 hover:bg-[rgb(20,30,50)] cursor-pointer"
                  onClick={() => handleSuggestionSelect(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center mt-4 sm:mt-0">
          <button className="text-white text-xl mr-2 md:block hidden">⚙️</button>
          <button className="text-white text-xl hidden md:block">👤</button>
        </div>
      </header>
       <div className="w-full bg-[rgb(6,12,26)]">
        <div className="flex flex-wrap max-w-[95%] xl:max-w-[90%] 2xl:max-w-[80%] min-h-[calc(100vh-90px)] mx-auto">
          <div className="w-full lg:w-1/2 xl:w-[60%] p-2 lg:p-4">
            <div className="mt-5 lg:mt-10 rounded-3xl p-3 lg:p-5 border-2 border-[rgba(14,20,33,0.3)] bg-[rgba(14,20,33,0.7)] backdrop-filter backdrop-blur-3xl h-full w-full flex flex-col sm:flex-row">
              <div className="w-full md:w-1/2 h-auto mb-4 sm:mb-2 flex flex-col justify-center items-center md:items-start">
                <div className="flex items-center border-2 border-blue-600 p-2 rounded-xl bg-blue-600 w-fit">
                  <CgPin className="text-xl lg:text-2xl" />
                  <div>
                    <h1 className="text-lg lg:text-xl mx-2">{currentWeather?.location?.name || "Loading..."}</h1>
                  </div>
                </div>

                <div className="mt-4 lg:mt-7">
                  <h4 className="text-2xl lg:text-3xl xl:text-4xl">{day}</h4>
                  <p className="text-sm lg:text-md xl:text-lg mt-2">{`${todayDate.getDate()} ${
                    todayDate.toString().split(" ")[1]
                  }, ${todayDate.getFullYear()}`}</p>
                </div>

                <div className="mt-6 lg:mt-10 relative">
                  <div className="absolute top-[-18px] left-28 lg:left-36 w-6 h-6 lg:w-8 lg:h-8 overflow-hidden rounded-full">
                    <img
                      src={CloudGif}
                      alt="Cloudy weather"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-5xl lg:text-7xl xl:text-8xl relative z-10">{weatherData?.temperature}°C</div>
                  <span className="text-xs lg:text-sm xl:text-base relative z-10 block">
                    High: {Math.floor(Math.random() * 21) + 30}°C Low:{" "}
                    {Math.floor(Math.random() * 8) + 10}°C
                  </span>
                </div>
              </div>
              <div className="w-full md:w-1/2 h-auto flex flex-col justify-center items-center sm:items-end">
                <img
                  src={WeatherIcon}
                  alt="Cloudy weather"
                  className="w-24 h-24 lg:w-36 lg:h-36 xl:w-44 xl:h-44 object-cover invert mr-0 sm:mr-3"
                />
                <div className="text-xl lg:text-2xl xl:text-3xl mt-2 sm:mt-0 sm:mr-5 text-center sm:text-right">
                  <div className="text-xl lg:text-2xl xl:text-3xl">{weatherData?.weather_descriptions[0]}</div>
                  <div className="text-xs lg:text-sm xl:text-base mt-2">Feels like {weatherData?.feelslike}°C</div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 xl:w-[40%] p-2 lg:p-4">
            <div className="mx-2 lg:mx-4 mt-5 lg:mt-10 rounded-3xl p-3 lg:p-5 border-2 border-[rgba(14,20,33,0.3)] bg-[rgba(14,20,33,0.7)] backdrop-filter backdrop-blur-3xl h-full w-full before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle,rgba(0,100,255,0.3)_0%,rgba(0,100,255,0)_70%)] before:opacity-75 before:z-[-1]">
              <div className="text-lg lg:text-xl xl:text-2xl font-bold">Today's Highlights</div>
              <div className="w-full">
                <div className="grid grid-cols-2 gap-2 lg:gap-4 mt-4 w-full">
                      <div
                        className="p-2 lg:p-4 rounded-xl bg-[rgba(255,255,255,0.1)] flex flex-col items-center justify-center"
                      >
                        <h3 className="text-sm lg:text-base xl:text-lg font-semibold mb-1 lg:mb-2">Wind Status</h3>
                        <p className="text-lg lg:text-xl xl:text-2xl">{weatherData?.wind_speed} km/h</p>
                      </div>
                      <div
                        className="p-2 lg:p-4 rounded-xl bg-[rgba(255,255,255,0.1)] flex flex-col items-center justify-center"
                      >
                        <h3 className="text-sm lg:text-base xl:text-lg font-semibold mb-1 lg:mb-2">UV Index</h3>
                        <p className="text-lg lg:text-xl xl:text-2xl">{weatherData?.uv_index}</p>
                      </div>
                      <div
                        className="p-2 lg:p-4 rounded-xl bg-[rgba(255,255,255,0.1)] flex flex-col items-center justify-center"
                      >
                        <h3 className="text-sm lg:text-base xl:text-lg font-semibold mb-1 lg:mb-2">Visibility</h3>
                        <p className="text-lg lg:text-xl xl:text-2xl">{weatherData?.visibility} km</p>
                      </div>
                      <div
                        className="p-2 lg:p-4 rounded-xl bg-[rgba(255,255,255,0.1)] flex flex-col items-center justify-center"
                      >
                        <h3 className="text-sm lg:text-base xl:text-lg font-semibold mb-1 lg:mb-2">Humidity</h3>
                        <p className="text-lg lg:text-xl xl:text-2xl">{weatherData?.humidity}%</p>
                      </div>
                    
                </div>
              </div>
            </div>
          </div>

          <div className="w-full xl:w-[60%] p-2 lg:p-4">
            <div className="mx-auto my-3 lg:my-5 rounded-3xl p-2 lg:p-3 border-2 border-[rgba(14,20,33,0.3)] bg-[rgba(14,20,33,0.7)] backdrop-filter backdrop-blur-3xl h-auto w-full flex">
              <div className="w-full h-auto">
                <div className="relative flex flex-wrap justify-center lg:justify-between items-center p-2 rounded-xl w-full mx-auto border-2 border-[rgba(14,20,33,0.7)] bg-[rgba(14,20,33,0.7)] backdrop-filter backdrop-blur-lg overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle,rgba(0,100,255,0.3)_0%,rgba(0,100,255,0)_70%)] before:opacity-75 before:z-[-1]">
                  {Object.entries(shortDaysName).map(([day, temp], index) => (
                    <div
                      key={index}
                      className="flex flex-col items-stretch justify-between w-[30%] sm:w-[13%] h-[100px] lg:h-[125px] xl:h-[150px] text-center p-1 lg:p-2 m-1 rounded-2xl bg-[rgba(255,255,255,0.1)]"
                    >
                      <div className="text-xs lg:text-sm xl:text-base font-bold">{day}</div>
                      <div className="text-lg lg:text-xl xl:text-2xl">{temp > 20 ? "☀️" : "☁️"}</div>
                      <div className="text-sm lg:text-base xl:text-lg my-1">{temp}°C</div>
                    </div>
                  ))}
                </div>

                <div className="relative flex items-center mt-8 lg:mt-16 h-16 lg:h-20 xl:h-24 m-2 p-2 rounded-xl w-full border-2 border-[rgba(14,20,33,0.7)] bg-[rgba(14,20,33,0.7)] backdrop-filter backdrop-blur-lg overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle,rgba(0,100,255,0.3)_0%,rgba(0,100,255,0)_70%)] before:opacity-75 before:z-[-1]">
                  <div className="ml-2 lg:ml-5 w-full relative">
                  {Object.entries(shortDaysName).map(([day, temp], index) =>
                    day === getTomorrowDay() ? (
                      <div className="flex items-center" key={index}>
                        <div>
                          <h2 className="text-xs lg:text-sm xl:text-base">Tomorrow</h2>
                          <div className="text-xs lg:text-sm xl:text-base">
                            {temp > 20 ? "Sunny" : "Cloudy"}
                          </div>
                        </div>
                        <div className="text-2xl lg:text-4xl xl:text-5xl ml-2 lg:ml-4">{`${temp}°C`}</div>
                        <div className="absolute top-[-25px] lg:top-[-35px] xl:top-[-45px] right-[5px] lg:right-[10px]">
                          <img
                            src={temp > 20 ? SunnyIcon : CloudyGif}
                            alt="Cloudy weather"
                            className="w-16 h-16 lg:w-24 lg:h-24 xl:w-32 xl:h-32 object-cover"
                          />
                        </div>
                      </div>
                    ) : null
                  )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full xl:w-[40%] p-2 lg:p-4 mt-5">
            <div className="mt-2 rounded-3xl p-2 lg:p-3 border-2 border-[rgba(14,20,33,0.3)] bg-[rgba(14,20,33,0.7)] backdrop-filter backdrop-blur-3xl h-auto w-full flex flex-wrap gap-2 lg:gap-4">
              {countryCards}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
