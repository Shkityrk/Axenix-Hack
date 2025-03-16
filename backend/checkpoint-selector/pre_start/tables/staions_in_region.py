import requests

from config import API_YANDEX

API_KEY = API_YANDEX


def create_table_station_id():
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

        for country in data["countries"]:
            country_name = country["title"]
            country_code = country["codes"].get("yandex_code", "")
            regions_dict = {}

            for region in country.get("regions", []):
                region_name = region["title"]
                region_id = region.get("codes", {}).get("yandex_code", "")
                stops = {}

                for settlement in region.get("settlements", []):
                    for station in settlement.get("stations", []):
                        stop_name = station["title"]
                        stop_id = station["codes"].get("yandex_code", "")
                        stops[stop_name] = stop_id

                regions_dict[region_name] = {"id": region_id, "stops": stops}

            result[country_name] = {"code": country_code, "regions": regions_dict}

        print(result["Россия"]["regions"]["Новосибирская область"])
        return result
    except requests.exceptions.HTTPError as err:
        print(err)
