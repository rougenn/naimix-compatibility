import requests
import os
import base64
from dotenv import load_dotenv

load_dotenv()

ASTROLOGY_API_URL = "https://json.astrologyapi.com/v1/astro_details"
ASTROLOGY_API_USER_ID = os.getenv("ASTROLOGY_API_USER_ID")
ASTROLOGY_API_KEY = os.getenv("ASTROLOGY_API_KEY")

def generate_cosmogram(date_of_birth, time_of_birth, latitude, longitude):
    payload = {
        "day": str(int(date_of_birth.split("-")[2])),
        "month": str(int(date_of_birth.split("-")[1])),
        "year": str(int(date_of_birth.split("-")[0])),
        "hour": str(int(time_of_birth.split(":")[0])),
        "min": str(int(time_of_birth.split(":")[1])),
        "lat": str(float(latitude)),
        "lon": str(float(longitude)),
        "tzone": str(3.0)
    }

    auth_string = f"{ASTROLOGY_API_USER_ID}:{ASTROLOGY_API_KEY}"
    encoded_auth = base64.b64encode(auth_string.encode('utf-8')).decode('utf-8')

    headers = {
        "Authorization": f"Basic {encoded_auth}",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    print("Payload:", payload)
    print("Headers:", headers)

    try:
        response = requests.post(ASTROLOGY_API_URL, data=payload, headers=headers)
        print("Response Status Code:", response.status_code)
        print("Response Text:", response.text)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error generating cosmogram: {e}")
        return None

cosmogram = generate_cosmogram("1990-01-01", "12:00", 40.7128, -74.0060)
if cosmogram:
    print("Cosmogram generated:", cosmogram)
else:
    print("Failed to generate cosmogram.")
