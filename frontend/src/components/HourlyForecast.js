import {Card, CardContent, Divider, Typography} from "@mui/material";
import {WiHumidity} from "react-icons/wi";
import React from "react";

const HourlyForecast = ({ hourlyWeather, error }) => {
    return (
        <Card className="" style={{ marginBottom: '20px' }}>
            <CardContent>
                <Typography variant="h8" gutterBottom style={{ fontWeight: 'bold', color: 'gray' }}>
                    Hourly Forecast
                </Typography>
                <Divider style={{ marginBottom: '30px', marginTop: '10px' }} />
                {error ? (
                    <p>{error}</p>
                ) : (
                    <div style={{ display: 'flex', overflowX: 'auto', justifyContent: 'flex-start', marginBottom: '0px' }}>
                        {hourlyWeather.map((hour, index) => (
                            <div key={index} style={{ marginRight: '50px', marginBottom: '30px', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h8" gutterBottom style={{ fontWeight: 'bold', color: 'gray', fontSize: '0.8em', width: '60px' }}>
                                    {hour.time}
                                </Typography>
                                <Typography variant="h8" gutterBottom style={{ marginTop: '3px', color: 'gray', fontSize: '0.8em' }}>
                                    {hour.date}
                                </Typography>
                                <img src={`http://openweathermap.org/img/w/${hour.icon}.png`} alt="Weather Icon" style={{ width: '48px', height: '48px', marginTop: '10px' }} />
                                <Typography variant="h8" gutterBottom style={{ fontSize: '1.2em' }}>
                                    {hour.temperature}°
                                </Typography>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px', color: 'gray', fontSize: '0.8em' }} title="Humidity">
                                    <WiHumidity size={24} style={{}} />
                                    <span> {hour.humidity} % </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default HourlyForecast;