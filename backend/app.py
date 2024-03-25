from flask import Flask, request, jsonify
import requests
import logging
from flask_cors import CORS


import constants

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


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
        temperature = data['main']['temp']
        humidity = data['main']['humidity']
        wind_speed = data['wind']['speed']
        weather_icon = data['weather'][0]['icon']
        weather_desc = data['weather'][0]['description']

        # Constructing response
        weather_data = {
            'location': location_name,
            'feels_like': feels_like,
            'temperature': temperature,
            'humidity': humidity,
            'wind_speed': wind_speed,
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


if __name__ == '__main__':
    app.run(debug=True)
