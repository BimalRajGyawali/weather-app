import {Card, CardContent, Divider, Typography} from "@mui/material";
import {WiHumidity} from "react-icons/wi";
import React from "react";

const TodayWeatherCard = ({ currentWeather, error }) => {
    return (
        <Card className="" style={{ marginBottom: '20px' }}>
            <CardContent>
                <Typography variant="h8" gutterBottom style={{ fontWeight: 'bold', color: 'gray' }}>
                    Today's Weather
                </Typography>
                <Divider style={{ marginBottom: '30px', marginTop: '10px' }} />

                {error ? (
                    <p>{error}</p>
                ) : (
                    <>
                        <Typography variant="h5" gutterBottom style={{ marginBottom: '30px' }}>
                            {currentWeather.location}, {currentWeather.time}
                        </Typography>

                        <div style={{ display: 'flex' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img src={`http://openweathermap.org/img/w/${currentWeather.icon}.png`}
                                     alt="Weather Icon"
                                     style={{ width: '72px', height: '72px', border: '1px solid gray' }} />

                                <div style={{ marginLeft: '25px' }}>
                                    <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', letterSpacing: '-.7px' }}>
                                        {currentWeather.temperature}°
                                        <span style={{ fontSize: '0.5em', color: 'gray' }}>C</span>
                                    </Typography>

                                    <Typography variant="h8" gutterBottom style={{ fontSize: '1.2em', color: 'gray' }}>
                                        {currentWeather.desc}
                                    </Typography>
                                </div>
                            </div>

                            <div style={{marginLeft: '120px'}}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="subtitle1" gutterBottom style={{ marginRight: '8px' }}>
                                        Feels Like:
                                    </Typography>
                                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                                        {currentWeather.feelsLike}°C
                                    </Typography>
                                </div>
                                <Divider style={{ margin: '10px 0' }} />
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="subtitle1" gutterBottom style={{ marginRight: '8px' }}>
                                        Humidity: <WiHumidity style={{ fontSize: '24px', position: 'relative', top: '4px' }} />
                                    </Typography>
                                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                                        {currentWeather.humidity}%
                                    </Typography>
                                </div>
                                <Divider style={{ margin: '10px 0' }} />
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="subtitle1" gutterBottom style={{ marginRight: '8px' }}>
                                        Wind Speed:
                                    </Typography>
                                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                                        {currentWeather.windSpeed} m/s
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default TodayWeatherCard;
