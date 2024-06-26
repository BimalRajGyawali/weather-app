import json
import logging
import math

import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

import constants
import helper
import redis

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

redis_client = redis.Redis(host=constants.REDIS_SERVICE, port=constants.REDIS_PORT, db=0)

@app.route('/weather', methods=['GET'])
def get_weather():
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    if not lat or not lon:
        return jsonify({'error': 'Latitude and longitude parameters are required.'}), 400

    url = f'{constants.OPEN_WEATHER_MAP_ROOT_URL}?lat={lat}&lon={lon}&appid={constants.OPEN_WEATHER_MAP_API_KEY}&units=metric'

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        # Extracting required fields
        location_name = data.get('name')
        feels_like = data['main']['feels_like']
        temperature = math.floor(data['main']['temp'])
        humidity = data['main']['humidity']
        wind_speed = data['wind']['speed']
        weather_icon = data['weather'][0]['icon']
        weather_desc = data['weather'][0]['description']

        # Constructing response
        weather_data = {
            'location': location_name,
            'feelsLike': feels_like,
            'temperature': temperature,
            'humidity': humidity,
            'windSpeed': wind_speed,
            'icon': weather_icon,
            'desc': weather_desc
        }

        return jsonify(weather_data)

    except requests.RequestException as e:
        logger.error(f'Request failed: {e}')
        return jsonify({'error': 'Failed to fetch weather data. Please try again later.'}), 500

    except Exception as e:
        logger.exception('An unexpected error occurred:')
        return jsonify({'error': 'An unexpected error occurred. Please contact the server administrator.'}), 500


@app.route('/forecast', methods=['GET'])
def get_forecast():
    latitude = request.args.get('lat')
    longitude = request.args.get('lon')

    if not latitude or not longitude:
        return jsonify({'error': 'Latitude and longitude are required parameters.'}), 400

    # Generate cache key from latitude and longitude
    cache_key = f"{latitude}_{longitude}"

    # Check if data is cached in Redis
    cached_data = redis_client.get(cache_key)
    if cached_data:
        print("===\n==Getting from redis\n\n==")
        return cached_data

    # Construct the API URL
    url = f"{constants.OPEN_WEATHER_MAP_ONECALL_URL}?lat={latitude}&lon={longitude}&appid={constants.OPEN_WEATHER_MAP_API_KEY}&units=metric"

    # Fetch forecast data from the API
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        timezone = data['timezone']

        # Extract and map hourly data
        mapped_hourly_data = []
        for hour in data['hourly']:
            date, time, _ = helper.extract_from_datetime(hour['dt'], timezone, date_to_today=True, day_to_today=True)
            mapped_hourly_data.append({
                'date': date,
                'time': time,
                'temperature': math.floor(hour['temp']),
                'desc': hour['weather'][0]['description'],
                'icon': hour['weather'][0]['icon'],
                'humidity': hour['humidity'],
                'timezone': timezone,
                'dt': hour['dt']
            })

        # Extract and map daily data
        mapped_daily_data = []
        for day in data['daily']:
            date, time, week_day = helper.extract_from_datetime(day['dt'], timezone, day_to_today=True)
            mapped_daily_data.append({
                'date': date,
                'day': week_day,
                'temperature': {
                    'min': math.floor(day['temp']['min']),
                    'max': math.floor(day['temp']['max']),
                },
                'humidity': day['humidity'],

                'desc': day['weather'][0]['description'],
                'icon': day['weather'][0]['icon'],
                'summary': day['summary']
            })

        mapped_hourly_data = mapped_hourly_data[:24]  # only for next 24 hours

        # Calculate expiration time for caching
        if mapped_hourly_data:
            first_element = mapped_hourly_data[0]

            expiration_time_delta = helper.current_datetime_from_timezone(timezone) - helper.convert_unix_to_datetime(first_element['dt'], timezone=timezone)
            expiration_time_secs = int(3600 - expiration_time_delta.total_seconds())

            # Cache the response data in Redis for one hour
            redis_client.setex(cache_key, expiration_time_secs, bytes(json.dumps({'hourly': mapped_hourly_data, 'daily': mapped_daily_data}), 'utf-8'))

        # Return the response data
        return jsonify({
            'hourly': mapped_hourly_data,
            'daily': mapped_daily_data
        })
    except requests.RequestException as e:
        return jsonify({'error': 'Failed to fetch hourly forecast data. Please try again later.'}), 500
    except Exception as e:
        logger.error(e)
        return jsonify({'error': 'An unexpected error occurred. Please contact the server administrator.'}), 500


if __name__ == '__main__':
    app.run(debug=True)
