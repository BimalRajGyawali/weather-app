## The Weather App

[High Level Flow Diagram](#high-level-feature-flow)

[Features](#features)

[Response to Errors](#response-to-errors)

[Technology Stack](#technology-stack)

[Running the project](#running-the-project)


### High Level Feature Flow:

1. Current/Today Weather

![Current Weather](docs/flow1.jpeg)


2. Hourly and Daily Weather Forecast

![Hourly and Daily Weather Forecast](docs/flow2.jpeg)



### Features:

1. Current/Today Weather

![Current Weather](docs/feature1.png)


2. Hourly Weather Forecast for next 24 hours

![Hourly Forecast](docs/feature2.png)


3. Daily Weather Forecast for next 7 days

![Daily Forecast](docs/feature3.png)


### Response to Errors:


1. Location not enabled from browser

![location error](docs/error2.png)

2. Server error

![Server error](docs/error1.png)


### Technology Stack:
1. Frontend: React JS, Material UI
2. Backend: Python, Flask
3. Caching: Redis
4. Weather API: OpenWeatherMap


### Running the project

The project can be run using following `docker-compose` command.

`docker-compose up -d`

View the app from [http://localhost:3000](http://localhost:3000)


