import React, {useEffect, useState} from 'react';
import {Card, CardContent, Container, Divider, Grid, Typography} from '@mui/material';
import {WiHumidity} from 'react-icons/wi'; // Import icons from react-icons library
import axios from "axios";
import UrlConstants from "../constants/UrlConstants";


const WeatherViewer = () => {
    const [currentWeatherError, setCurrentWeatherError] = useState('')
    const [currentWeather, setCurrentWeather] = useState({})
    const [hourlyWeather, setHourlyWeather] = useState([])
    const [dailyWeather, setDailyWeather] = useState([])

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;

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


                axios.get(`${UrlConstants.HOST}/forecast?lat=${latitude}&lon=${longitude}`)
                    .then(response => {
                        setHourlyWeather(response.data.hourly)
                        setDailyWeather(response.data.daily)
                    })
                    .catch(error => {
                        console.error('Error fetching weather data:', error.response ? error.response.data : error.message);
                        setCurrentWeatherError('Error fetching weather data from server. Please contact support.')                    });


            }, (error) => {
                setCurrentWeatherError('Unable to get User Location. Please make sure location is allowed.')
                console.error('Error getting user location:', error);
            });
        } else {
            setCurrentWeatherError('Geolocation is not supported by this browser.')
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
                            Hourly Forecast
                        </Typography>
                        <Divider style={{marginBottom: '30px', marginTop: '10px'}}/>

                        {currentWeatherError ? (
                            <p>{currentWeatherError}</p>
                        ) : <>

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
                                                    style={{fontWeight: 'bold', color: 'gray', fontSize: '0.8em', width: '60px'}}>
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
                                        }}
                                             title="Humidity" >
                                            <WiHumidity size={24} style={{}}/>
                                            <span> {hour.humidity} % </span>
                                        </div>


                                    </div>
                                ))}
                            </div>
                        </>

                        }
                    </CardContent>
                </Card>

                <Card className="">
                    <CardContent>
                        <Typography variant="h8" gutterBottom style={{fontWeight: 'bold', color: 'gray'}}>
                            7-Day Forecast
                        </Typography>
                        <Divider style={{marginBottom: '30px', marginTop: '10px'}}/>
                        <table style={{width: '', maxWidth: '100%'}}>
                            <tbody>
                            {dailyWeather.map((day, index) => (
                                <tr key={index}>
                                    <td style={{textAlign: 'center', width: '10%', borderBottom: index !== dailyWeather.length - 1 ? '1px solid lightgray' : ''}}>
                                        <span style={{fontWeight: '', color: '', fontSize: '1.2em'}}>{day.day}</span>
                                        <br />
                                        <span style={{fontWeight: '', color: 'gray', fontSize: '0.8em'}}>{day.date}</span>
                                    </td>

                                    <td style={{textAlign: 'center', width: '20%', marginLeft: '', borderBottom: index !== dailyWeather.length - 1 ? '1px solid lightgray' : ''}}>
                                        <div style={{display: 'flex', alignItems: 'center'}}>
                                            <img src={`http://openweathermap.org/img/w/${day.icon}.png`} alt="Weather Icon" style={{width: '64px', height: '64px', marginRight: '10px'}}/>
                                            <div>
                                                <span style={{fontSize: '1.5em', fontWeight: ''}}>{day.temperature.max}°</span>
                                                <span style={{fontSize: '1em', marginLeft: '8px', color: '#36454F'}}>{day.temperature.min}°</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td style={{textAlign: '', color: 'gray', fontSize: '0.8em', fontWeight: 'bold', width: '40%', borderBottom: index !== dailyWeather.length - 1 ? '1px solid lightgray' : ''}}>
                                        <span> {day.summary} </span>
                                    </td>

                                    <td  title="Humidity" style={{textAlign: 'center', color: '', fontSize: '', width: '10%', borderBottom: index !== dailyWeather.length - 1 ? '1px solid lightgray' : ''}}>
                                        <WiHumidity size={24} style={{position: 'relative', top: '4px'}}/>
                                        <span> {day.humidity}% </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

            </Container>
        </div>
    );
};

export default WeatherViewer;
