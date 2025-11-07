import requests

API_BASE_URL = "http://localhost:8000/api/v1/"

response = requests.get(f"{API_BASE_URL}/users")
data = response.json()