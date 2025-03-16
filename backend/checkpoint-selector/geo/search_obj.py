import requests


def get_query(query):
    url = f"https://nominatim.openstreetmap.org/search?q={query}&format=json"

    response = requests.get(url, headers={"User-Agent": "YourApp/1.0"})
    data = response.json()

    if data:
        lat, lon = data[0]["lat"], data[0]["lon"]
        res = [float(lat[:8]), float(lon[:8])]
        return res
    else:
        return None
