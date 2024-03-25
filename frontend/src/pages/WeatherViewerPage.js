import React, {useEffect, useState} from 'react';
import {Container} from '@mui/material';
import axios from "axios";
import UrlConstants from "../constants/UrlConstants";
import TodayWeatherCard from "../components/TodayWeatherCard";
import HourlyForecast from "../components/HourlyForecast";
import SevenDayForecast from "../components/SevenDayForecast";

const WeatherViewerPage = () => {
    const [currentWeatherError, setCurrentWeatherError] = useState('');
    const [currentWeather, setCurrentWeather] = useState({});
    const [hourlyWeather, setHourlyWeather] = useState([]);
    const [dailyWeather, setDailyWeather] = useState([]);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const position = await getCurrentPosition();
                const { latitude, longitude } = position.coords;

                let currentData, forecastData;

                try {
                    currentData = await fetchCurrentWeather(latitude, longitude);
                    forecastData = await fetchForecast(latitude, longitude);
                    setCurrentWeather(currentData);
                    setHourlyWeather(forecastData.hourly);
                    setDailyWeather(forecastData.daily);

                } catch (error) {
                    setCurrentWeatherError('Unable to fetch weather data. Please contact support')
                }

            } catch (error) {
                handleWeatherError(error);
            }
        };

        fetchWeatherData();
    }, []);

    const getCurrentPosition = () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => resolve(position),
                    (error) => {
                        if (error.code === 1) {
                            reject(new Error('Geolocation access is not enabled. Please enable location access in your browser settings.'));
                        } else {
                            reject(error);
                        }
                    }
                );
            } else {
                reject(new Error('Geolocation is not supported by this browser.'));
            }
        });
    };
    const fetchCurrentWeather = async (latitude, longitude) => {
        const response = await axios.get(`${UrlConstants.HOST}/weather?lat=${latitude}&lon=${longitude}`);
        return parseCurrentWeather(response.data);
    };

    const parseCurrentWeather = (data) => {
        return {
            location: data.location,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            temperature: data.temperature,
            humidity: data.humidity,
            windSpeed: data.windSpeed,
            icon: data.icon,
            desc: data.desc,
            feelsLike: data.feelsLike
        };
    };

    const fetchForecast = async (latitude, longitude) => {
        const response = await axios.get(`${UrlConstants.HOST}/forecast?lat=${latitude}&lon=${longitude}`);
        return response.data;
    };

    const handleWeatherError = (error) => {
        setCurrentWeatherError(error.message);
        console.error('Error fetching weather data:', error);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Container maxWidth="md">
                <TodayWeatherCard currentWeather={currentWeather} error={currentWeatherError} />
                <HourlyForecast hourlyWeather={hourlyWeather} error={currentWeatherError} />
                <SevenDayForecast dailyWeather={dailyWeather} error={currentWeatherError} />
            </Container>
        </div>
    );
};


export default WeatherViewerPage;