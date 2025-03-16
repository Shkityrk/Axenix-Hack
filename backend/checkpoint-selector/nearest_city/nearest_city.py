import requests

from config import API_YANDEX

API_KEY = API_YANDEX

def get_data_of_nearest_city(point,
                             DISTANCE=50,
                             URL = "https://api.rasp.yandex.net/v3.0/nearest_settlement/"
                             ):
    lat,lon = point[0], point[1]
    params = {
        "apikey": API_KEY,
        "lat": lat,
        "lng": lon,
        "distance": DISTANCE,
        "lang": "ru_RU",
        "format": "json"
    }

    try:
        response = requests.get(URL, params=params)

        # Проверка статуса ответа
        if response.status_code == 200:
            data = response.json()  # Преобразование ответа в JSON

            res = {}
            res["nearest_city"] = data.get('title', None)
            res["distance"] = data.get('distance', None)
            res["lat"] = data.get('lat', None)
            res["lng"] = data.get('lng', None)

            return res
        else:
            return f"err: {response.status_code}, {response.text}"
    except requests.exceptions.RequestException as e:
        print(f"Ошибка сети: {e}")


if __name__ == "__main__":
    # Координаты точки поиска (широта и долгота)
    LATITUDE = 55.790936
    LONGITUDE = 37.502700

    point = [LATITUDE, LONGITUDE]

    get_data_of_nearest_city(point)