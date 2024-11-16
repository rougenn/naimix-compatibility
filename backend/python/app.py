from dotenv import load_dotenv
import os

load_dotenv()

from fastapi import FastAPI, HTTPException
from compatibility.local_geocoding import get_coordinates
from compatibility.cosmogram import generate_cosmogram

app = FastAPI()

@app.post("/cosmogram")
def get_cosmogram(data: dict):
    city = data.get("city")
    date_of_birth = data.get("date_of_birth")
    time_of_birth = data.get("time_of_birth")

    if not city or not date_of_birth or not time_of_birth:
        raise HTTPException(status_code=400, detail="All fields are required.")

    latitude, longitude = get_coordinates(city)
    if latitude is None or longitude is None:
        raise HTTPException(status_code=400, detail=f"City '{city}' not found.")

    cosmogram = generate_cosmogram(date_of_birth, time_of_birth, latitude, longitude)
    if cosmogram is None:
        raise HTTPException(status_code=500, detail="Failed to generate cosmogram.")

    return cosmogram
