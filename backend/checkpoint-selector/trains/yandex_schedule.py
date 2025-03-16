import datetime
from datetime import datetime, date
import requests

from config import API_YANDEX


class YandexRaspAPI:
    API_URL = "https://api.rasp.yandex.net/v3.0/search/"
    API_KEY = API_YANDEX

    def __init__(self, api_key=None):
        if api_key:
            self.API_KEY = api_key

    def get_schedule(self,
                     from_station_id,
                     to_station_id,
                     date_str=None,
                     transport_type="train"):
        """
        Получает расписание маршрутов между двумя станциями.
        :param from_station_id: ID начальной станции
        :param to_station_id: ID конечной станции
        :param transport_type: Тип транспорта (по умолчанию 'train')
        :param date: Дата запроса (по умолчанию - сегодня)
        :return: Список найденных маршрутов или сообщение об ошибке
        """
        if date_str is None:
            date = datetime.date.today().strftime("%Y-%m-%d")
        else:
            date_obj = datetime.strptime(date_str, "%d.%m.%Y")  # Преобразуем строку в объект datetime
            date = date_obj.strftime("%Y-%m-%d")
        params = {
            "apikey": self.API_KEY,
            "format": "json",
            "from": from_station_id,
            "to": to_station_id,
            "date": date,
            "lang": "ru_RU",
            "transport_types": transport_type
        }

        try:
            response = requests.get(self.API_URL, params=params)
            response.raise_for_status()
            data = response.json()

            if not data.get("segments"):
                return "Нет данных о рейсах."

            fr_city = data["search"]["from"]["title"]
            to_city = data["search"]["to"]["title"]
            flights = []

            for segment in data["segments"]:
                res = {
                    "fr_city": fr_city,
                    "to_city": to_city,
                    "departure": segment["departure"],
                    "arrival": segment["arrival"],
                    "duration": segment["duration"] // 60,  # Перевод в минуты
                    "number": segment["thread"]["number"],
                    "carrier": segment["thread"]["carrier"]["title"],
                    "link": segment["thread"]["thread_method_link"],
                    "from": segment["from"]["title"],
                    "to": segment["to"]["title"],

                }
                flights.append(res)

            return flights

        except requests.exceptions.RequestException as e:
            return f"Ошибка при запросе: {e}"

    def get_best_route(self, from_id, to_id, date):
        """
        Возвращает наиболее быстрый маршрут по длительности поездки.
        :param from_id: ID начальной станции
        :param to_id: ID конечной станции
        :return: Самый быстрый маршрут или None, если нет данных
        """
        flights = self.get_schedule(from_id, to_id, date)
        if not flights or isinstance(flights, str):
            return None

        return min(flights, key=lambda flight: flight["duration"])


if __name__ == "__main__":
    api = YandexRaspAPI()
    # best_route = api.get_best_route("c213", "c65")
    # print(best_route)
