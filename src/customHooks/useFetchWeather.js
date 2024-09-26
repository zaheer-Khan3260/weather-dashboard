import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchWeather = (location) => {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!location) return;

        const abortController = new AbortController();
        const signal = abortController.signal;

        const fetchWeather = async () => {
            setLoading(true);
            setError(null);

            try {
                const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
                const [currentWeatherResponse, forecastResponse] = await Promise.all([
                    axios.get(`https://api.weatherstack.com/current`, {
                        params: {
                            access_key: apiKey,
                            query: location
                        },
                        signal
                    }),
                    axios.get(`https://api.weatherstack.com/forecast`, {
                        params: {
                            access_key: apiKey,
                            query: location,
                            forecast_days: 5
                        },
                        signal
                    })
                ]);

                setCurrentWeather(currentWeatherResponse.data);
                setForecast(forecastResponse.data);
            } catch (err) {
                if (err.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    setError(err);
                }
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchWeather, 500); // 500ms delay

        return () => {
            abortController.abort();
            clearTimeout(timeoutId);
        };
    }, [location]);

    return { currentWeather, forecast, loading, error };
};

export default useFetchWeather;
