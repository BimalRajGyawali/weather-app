import React, {useEffect, useState} from 'react';
import {Container, Typography, Card, CardContent, Divider, Grid} from '@mui/material';
import {WiThermometer, WiHumidity, WiStrongWind} from 'react-icons/wi'; // Import icons from react-icons library

import './weatherviewer.css'
import axios from "axios";
import urlConstants from "../constants/UrlConstants";
import UrlConstants from "../constants/UrlConstants";


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
    const [hourlyWeather, setHourlyWeather] = useState([])

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
                            windSpeed: weatherData.windSpeed,
                            icon: weatherData.icon,
                            desc: weatherData.desc,
                            feelsLike: weatherData.feelsLike
                        };

                        setCurrentWeather(currentWeather)
                        console.log('Received Weather Data:', currentWeather);
                    })
                    .catch(error => {
                        console.error('Error fetching weather data:', error.response ? error.response.data : error.message);
                        setCurrentWeatherError('Error fetching weather data from server. Please contact support.')
                    });



                axios.get(`${UrlConstants.HOST}/hourly-forecast?lat=${latitude}&lon=${longitude}`)
                    .then(response => {
                        console.log('Hourly forecast:', response.data);
                        setHourlyWeather(response.data)
                    })
                    .catch(error => {
                        console.error('Error fetching weather data:', error.response ? error.response.data : error.message);
                        setCurrentWeatherError('Error fetching weather data from server. Please contact support.')                    });


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

                        {currentWeatherError ? (
                            <p>{currentWeatherError}</p>
                        ) : (
                            <>
                                <Typography variant="h5" gutterBottom style={{marginBottom: '30px'}}>
                                    {currentWeather.location}, {currentWeather.time}
                                </Typography>

                                <Grid container spacing={3}> {/* Use Grid container for responsiveness */}
                                    <Grid item xs={12} md={6} lg={6}> {/* Specify grid item width for different screen sizes */}
                                        <div style={{display: 'flex', alignItems: 'center'}}>
                                            <img src={`http://openweathermap.org/img/w/${currentWeather.icon}.png`}
                                                 alt="Weather Icon"
                                                 style={{width: '72px', height: '72px', border: '1px solid gray'}}/>

                                            <div>
                                                <Typography variant="h4" gutterBottom
                                                            style={{fontWeight: 'bold', marginLeft: '25px', letterSpacing: '-.7px'}}>
                                                    {currentWeather.temperature}°
                                                    <span style={{fontSize: '0.5em', color: 'gray'}}>C</span>
                                                </Typography>

                                                <Typography variant="h8" gutterBottom
                                                            style={{marginLeft: '25px', fontSize: '1.2em', color: 'gray'}}>
                                                    {currentWeather.desc}
                                                </Typography>
                                            </div>
                                        </div>
                                    </Grid>

                                    <Grid item xs={12} md={6} lg={6}> {/* Specify grid item width for different screen sizes */}
                                        <div style={{display: 'flex', flexDirection: 'column'}}>
                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                <Typography variant="subtitle1" gutterBottom style={{marginRight: '8px'}}>
                                                    Feels Like:
                                                </Typography>
                                                <Typography variant="subtitle1" gutterBottom style={{fontWeight: 'bold'}}>
                                                    {currentWeather.feelsLike}°C
                                                </Typography>
                                            </div>
                                            <Divider style={{margin: '10px 0'}} />
                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                <Typography variant="subtitle1" gutterBottom style={{marginRight: '8px'}}>
                                                    Humidity: <WiHumidity style={{fontSize: '24px', position: 'relative', top: '4px'}}/>
                                                </Typography>
                                                <Typography variant="subtitle1" gutterBottom style={{fontWeight: 'bold'}}>
                                                    {currentWeather.humidity}%
                                                </Typography>
                                            </div>
                                            <Divider style={{margin: '10px 0'}} />
                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                <Typography variant="subtitle1" gutterBottom style={{marginRight: '8px'}}>
                                                    Wind Speed:
                                                </Typography>
                                                <Typography variant="subtitle1" gutterBottom style={{fontWeight: 'bold'}}>
                                                    {currentWeather.windSpeed} m/s
                                                </Typography>
                                            </div>
                                        </div>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                    </CardContent>
                </Card>
                <Card className="" style={{marginBottom: '20px'}}>
                    <CardContent>
                        <Typography variant="h8" gutterBottom style={{fontWeight: 'bold', color: 'gray'}}>
                            Hourly Forecast - 24 Hours
                        </Typography>
                        <Divider style={{marginBottom: '30px', marginTop: '10px'}}/>
                        <div
                            style={{
                                display: 'flex',
                                overflowX: 'auto',
                                justifyContent: 'flex-start',
                                marginBottom: '0px'
                            }}
                            className='custom-scrollbar'

                        >

                            {hourlyWeather.map((hour, index) => (
                                <div key={index} style={{
                                    marginRight: '50px',
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

                                    <Typography variant="h8" gutterBottom
                                                style={{marginTop: '3px', color: 'gray', fontSize: '0.8em'}}>
                                        {hour.date}
                                    </Typography>

                                    <img src={`http://openweathermap.org/img/w/${hour.icon}.png`} alt="Weather Icon"
                                         style={{width: '48px', height: '48px', marginTop: '10px'}}/>

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
                                        <span> {hour.humidity} % </span>
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
