import requests
import os
from dotenv import load_dotenv

load_dotenv()

GEOCODING_API_URL = "https://api.opencagedata.com/geocode/v1/json"
GEOCODING_API_KEY = os.getenv("GEOCODING_API_KEY")

def get_coordinates(city):
    try:
        response = requests.get(
            GEOCODING_API_URL,
            params={"q": city, "key": GEOCODING_API_KEY}
        )
        response.raise_for_status()
        data = response.json()
        if data['results']:
            latitude = data['results'][0]['geometry']['lat']
            longitude = data['results'][0]['geometry']['lng']
            return latitude, longitude
        return None, None
    except Exception as e:
        print(f"Error fetching coordinates: {e}")
        return None, None
