import requests

from config import API_YANDEX

# Подключение к Redis
# redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)


API_KEY = API_YANDEX


def create_table_city_id():
    API_URL_ID = "https://api.rasp.yandex.net/v3.0/stations_list/"

    params = {
        "apikey": API_KEY,
        "format": "json",
        "lang": "ru_RU",
    }

    try:
        response = requests.get(API_URL_ID, params=params)
        response.raise_for_status()
        data = response.json()

        result = {}

        for country in data.get("countries", []):
            country_name = country.get("title")
            country_dict = {}

            for region in country.get("regions", []):
                for settlement in region.get("settlements", []):
                    city_name = settlement.get("title")
                    city_id = settlement.get("codes", {}).get("yandex_code")

                    if city_name and city_id:
                        country_dict[city_name] = city_id

            if country_name:
                result[country_name] = country_dict

        return result
    except requests.exceptions.HTTPError as err:
        print(err)
