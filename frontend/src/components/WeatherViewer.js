import React, {useEffect, useState} from 'react';
import {Container, Typography, Card, CardContent, Divider} from '@mui/material';
import {WiThermometer, WiHumidity, WiStrongWind} from 'react-icons/wi'; // Import icons from react-icons library

import './weatherviewer.css'
import axios from "axios";
import urlConstants from "../constants/UrlConstants";
import UrlConstants from "../constants/UrlConstants";


const dummyHourlyForecast = [
    {time: '12 PM', temperature: 26, icon: '01d'},
    {time: '1 PM', temperature: 27, icon: '02d'},
    {time: '2 PM', temperature: 28, icon: '03d'},
    {time: '12 PM', temperature: 26, icon: '01d'},
    {time: '1 PM', temperature: 27, icon: '02d'},
    {time: '2 PM', temperature: 28, icon: '03d'},
    {time: '12 PM', temperature: 26, icon: '01d'},
    {time: '12 PM', temperature: 26, icon: '01d'},
    {time: '1 PM', temperature: 27, icon: '02d'},
    {time: '2 PM', temperature: 28, icon: '03d'},
    {time: '12 PM', temperature: 26, icon: '01d'},
    {time: '1 PM', temperature: 27, icon: '02d'},
    {time: '2 PM', temperature: 28, icon: '03d'},
    {time: '12 PM', temperature: 26, icon: '01d'},
    {time: '12 PM', temperature: 26, icon: '01d'},
    {time: '1 PM', temperature: 27, icon: '02d'},
    {time: '2 PM', temperature: 28, icon: '03d'},
    {time: '12 PM', temperature: 26, icon: '01d'},
    {time: '1 PM', temperature: 27, icon: '02d'},
    {time: '2 PM', temperature: 28, icon: '03d'},
    {time: '12 PM', temperature: 26, icon: '01d'},

    // Add more dummy hourly forecast data
];

const dummyDailyForecast = [
    {day: 'Mon', temperature: {min: 20, max: 28}, icon: '01d'},
    {day: 'Tue', temperature: {min: 22, max: 30}, icon: '02d'},
    {day: 'Wed', temperature: {min: 21, max: 29}, icon: '03d'},
    {day: 'Thu', temperature: {min: 20, max: 28}, icon: '01d'},
    {day: 'Fri', temperature: {min: 22, max: 30}, icon: '02d'},
    {day: 'Sat', temperature: {min: 21, max: 29}, icon: '03d'},
    {day: 'Mon', temperature: {min: 20, max: 28}, icon: '01d'},
    {day: 'Tue', temperature: {min: 22, max: 30}, icon: '02d'},
    {day: 'Wed', temperature: {min: 21, max: 29}, icon: '03d'},
    {day: 'Thu', temperature: {min: 20, max: 28}, icon: '01d'},
    {day: 'Fri', temperature: {min: 22, max: 30}, icon: '02d'},
    {day: 'Sat', temperature: {min: 21, max: 29}, icon: '03d'},
    // Add more dummy daily forecast data
];

const WeatherViewer = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [currentWeatherError, setCurrentWeatherError] = useState('')

    const [currentWeather, setCurrentWeather] = useState({})

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ latitude, longitude });

                axios.get(`${UrlConstants.HOST}/weather?lat=${latitude}&lon=${longitude}`)
                    .then(response => {
                        const weatherData = response.data;

                        const currentWeather = {
                            location: weatherData.location,
                            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                            temperature: weatherData.temperature,
                            humidity: weatherData.humidity,
                            windSpeed: weatherData.wind_speed,
                            icon: weatherData.icon,
                            desc: weatherData.desc,
                            feelsLike: weatherData.feels_like
                        };

                        setCurrentWeather(currentWeather)
                        console.log('Received Weather Data:', currentWeather);
                    })
                    .catch(error => {
                        console.error('Error fetching weather data:', error.response ? error.response.data : error.message);
                        setCurrentWeatherError('Error fetching weather data from server. Please contact support.')
                    });


            }, (error) => {
                setCurrentWeatherError('Unable to get User Location. Please make sure location is allowed.')
                console.error('Error getting user location:', error);
            });
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, []);
    return (
        <div style={{padding: '20px'}}>
            <Container maxWidth="md">

                <Card className="" style={{marginBottom: '20px'}}>
                    <CardContent>
                        <Typography variant="h8" gutterBottom style={{fontWeight: 'bold', color: 'gray'}}>
                            Today's Weather
                        </Typography>
                        <Divider style={{marginBottom: '30px', marginTop: '10px'}}/>

                        {
                            currentWeatherError ? <p>{currentWeatherError}</p>

                                :
                                <>
                                    <Typography variant="h5" gutterBottom style={{marginBottom: '30px'}}>
                                        {currentWeather.location}, {currentWeather.time}
                                    </Typography>

                                    <div style={{display: 'flex', flexDirection: 'row'}}>

                                        <div style={{display: 'flex', marginRight: '100px', alignItems: 'center'}}>

                                            <img src={`http://openweathermap.org/img/w/${currentWeather.icon}.png`}
                                                 alt="Weather Icon"
                                                 style={{width: '72px', height: '72px', border: '1px solid gray'}}/>

                                            <div>
                                                <Typography variant="h4" gutterBottom
                                                            style={{fontWeight: 'bold', marginLeft: '25px'}}>
                                                    {currentWeather.temperature}°<span
                                                    style={{fontSize: '0.5em', color: 'gray'}}>C</span>
                                                </Typography>
                                            </div>
                                        </div>


                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: '10px',
                                            marginRight: '60px'
                                        }}>
                                            <WiHumidity size={32} style={{marginRight: '8px'}}/>
                                            <Typography variant="h8" gutterBottom style={{fontSize: '1.2em'}}>
                                                {currentWeather.humidity}%
                                            </Typography>
                                        </div>

                                        <div style={{display: 'flex', alignItems: 'center'}}>
                                            <WiStrongWind size={32} style={{marginRight: '8px'}}/>
                                            <Typography variant="h8" gutterBottom style={{fontSize: '1.2em'}}>
                                                {isSecureContext.windSpeed} m/s
                                            </Typography>
                                        </div>
                                    </div>

                                </>




                        }
                    </CardContent>
                </Card>

                <Card className="" style={{marginBottom: '20px'}}>
                    <CardContent>
                        <Typography variant="h8" gutterBottom style={{fontWeight: 'bold', color: 'gray'}}>
                            Hourly Forecast
                        </Typography>
                        <Divider style={{marginBottom: '30px', marginTop: '10px'}}/>
                        <div
                            style={{
                                display: 'flex',
                                overflowX: 'auto',
                                justifyContent: 'flex-start',
                                marginBottom: '20px'
                            }}
                            className='custom-scrollbar'

                        >

                            {dummyHourlyForecast.map((hour, index) => (
                                <div key={index} style={{
                                    marginRight: '40px',
                                    marginBottom: '30px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>

                                    <Typography variant="h8" gutterBottom
                                                style={{fontWeight: 'bold', color: 'gray', fontSize: '0.8em'}}>
                                        {hour.time}
                                    </Typography>

                                    <img src={`http://openweathermap.org/img/w/${hour.icon}.png`} alt="Weather Icon"
                                         style={{width: '48px', height: '48px', margin: ''}}/>

                                    <Typography variant="h8" gutterBottom style={{fontSize: '1.2em'}}>
                                        {hour.temperature}°
                                    </Typography>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginTop: '15px',
                                        color: 'gray',
                                        fontSize: '0.8em'
                                    }}>
                                        <WiHumidity size={24} style={{}}/>
                                        <span> 70  </span>
                                    </div>


                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="">
                    <CardContent>
                        <Typography variant="h8" gutterBottom style={{fontWeight: 'bold', color: 'gray'}}>
                            Daily Forecast
                        </Typography>
                        <Divider style={{marginBottom: '30px', marginTop: '10px'}}/>
                        <div
                            style={{
                                display: 'flex',
                                overflowX: 'auto',
                                justifyContent: 'flex-start',
                                marginBottom: '20px'
                            }}

                        >

                            {dummyDailyForecast.map((day, index) => (
                                <div key={index} style={{
                                    marginRight: '40px',
                                    marginBottom: '30px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>

                                    <Typography variant="h8" gutterBottom
                                                style={{fontWeight: 'bold', color: 'gray', fontSize: '0.8em'}}>
                                        {day.day}
                                    </Typography>

                                    <img src={`http://openweathermap.org/img/w/${day.icon}.png`} alt="Weather Icon"
                                         style={{width: '48px', height: '48px', margin: ''}}/>

                                    <div>
                                        <Typography variant="h8" gutterBottom
                                                    style={{fontSize: '1.5em', marginRight: '5px'}}>
                                            {day.temperature.max}°
                                        </Typography>
                                        <Typography variant="h8" gutterBottom style={{fontSize: '1em'}}>
                                            {day.temperature.min}°
                                        </Typography>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginTop: '15px',
                                        color: 'gray',
                                        fontSize: '0.8em'
                                    }}>
                                        <WiHumidity size={24} style={{}}/>
                                        <span> 70  </span>
                                    </div>


                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </Container>
        </div>
    );
};

export default WeatherViewer;
