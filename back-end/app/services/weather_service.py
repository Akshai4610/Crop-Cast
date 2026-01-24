"""
weather_service.py

PURPOSE:
- Fetch real-time weather data without API keys
- Uses Open-Meteo (free & open-source)
- Converts city name to coordinates using free geocoding
"""

import requests


GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search"
WEATHER_URL = "https://api.open-meteo.com/v1/forecast"


def get_coordinates(city: str) -> tuple:
    """
    Convert city name to latitude and longitude

    Args:
        city (str): City name

    Returns:
        tuple: (latitude, longitude)
    """
    params = {"name": city, "count": 1}

    response = requests.get(GEOCODE_URL, params=params)
    response.raise_for_status()

    data = response.json()

    if "results" not in data:
        raise ValueError("Invalid city name")

    lat = data["results"][0]["latitude"]
    lon = data["results"][0]["longitude"]

    return lat, lon


def get_weather_by_city(city: str) -> dict:
    """
    Fetch current weather data for a given city

    Args:
        city (str): City name

    Returns:
        dict: temperature, humidity, rainfall
    """
    lat, lon = get_coordinates(city)

    params = {
        "latitude": lat,
        "longitude": lon,
        "current": ["temperature_2m", "relative_humidity_2m", "rain"],
    }

    response = requests.get(WEATHER_URL, params=params)
    response.raise_for_status()

    data = response.json()["current"]

    return {
        "temperature": data["temperature_2m"],
        "humidity": data["relative_humidity_2m"],
        "rainfall": data.get("rain", 0)
    }
