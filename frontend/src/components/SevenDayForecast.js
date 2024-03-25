import {Card, CardContent, Divider, Typography} from "@mui/material";
import {WiHumidity} from "react-icons/wi";
import React from "react";

const SevenDayForecast = ({ dailyWeather, error }) => {
    return (
        <Card className="">
            <CardContent>
                <Typography variant="h8" gutterBottom style={{ fontWeight: 'bold', color: 'gray' }}>
                    7-Day Forecast
                </Typography>
                <Divider style={{ marginBottom: '30px', marginTop: '10px' }} />
                {
                    error ? (
                        <p>{error}</p>
                    )
                         :
                        <>
                            <table style={{ width: '', maxWidth: '100%' }}>
                                <tbody>
                                {dailyWeather.map((day, index) => (
                                    <tr key={index}>
                                        <td style={{ textAlign: 'center', width: '10%', borderBottom: index !== dailyWeather.length - 1 ? '1px solid lightgray' : '' }}>
                                            <span style={{ fontWeight: '', color: '', fontSize: '1.2em' }}>{day.day}</span>
                                            <br />
                                            <span style={{ fontWeight: '', color: 'gray', fontSize: '0.8em' }}>{day.date}</span>
                                        </td>

                                        <td style={{ textAlign: 'center', width: '20%', marginLeft: '', borderBottom: index !== dailyWeather.length - 1 ? '1px solid lightgray' : '' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <img src={`http://openweathermap.org/img/w/${day.icon}.png`} alt="Weather Icon" style={{ width: '64px', height: '64px', marginRight: '10px' }} />
                                                <div>
                                                    <span style={{ fontSize: '1.5em', fontWeight: '' }}>{day.temperature.max}°</span>
                                                    <span style={{ fontSize: '1em', marginLeft: '8px', color: '#36454F' }}>{day.temperature.min}°</span>
                                                </div>
                                            </div>
                                        </td>

                                        <td style={{ textAlign: '', color: 'gray', fontSize: '0.8em', fontWeight: 'bold', width: '40%', borderBottom: index !== dailyWeather.length - 1 ? '1px solid lightgray' : '' }}>
                                            <span> {day.summary} </span>
                                        </td>

                                        <td title="Humidity" style={{ textAlign: 'center', color: '', fontSize: '', width: '10%', borderBottom: index !== dailyWeather.length - 1 ? '1px solid lightgray' : '' }}>
                                            <WiHumidity size={24} style={{ position: 'relative', top: '4px' }} />
                                            <span> {day.humidity}% </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </>
                }
            </CardContent>
        </Card>
    );
};

export default SevenDayForecast;