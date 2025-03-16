import datetime
from datetime import datetime, date
import requests
from .list_airports import get_data_airport_by_code_from_yandex


class YandexTransportAPI:
    BASE_URL = "https://api.rasp.yandex.net/v3.0/search/"

    def __init__(self, api_key):
        """
        Конструктор класса для работы с API Яндекс.Расписания.

        :param api_key: API-ключ для доступа к сервису.
        """
        self.api_key = api_key

    def get_schedule(self,
                     from_station_id,
                     to_station_id,
                     date_str,
                     type_to_return="dict"):
        """
        Получает расписание маршрутов между станциями.

        :param from_station_id: Код станции отправления.
        :param to_station_id: Код станции назначения.
        :param transport_type: Тип транспорта (по умолчанию "plane").
        :param type_to_return: Формат возвращаемых данных: "dict" или "str".
        :param date: Дата отправления (формат "YYYY-MM-DD"), по умолчанию — сегодня.
        :return: Список рейсов (словарь или строка).
        """
        if date_str is None:
            date = datetime.date.today().strftime("%Y-%m-%d")
        else:
            date_obj = datetime.strptime(date_str, "%d.%m.%Y")  # Преобразуем строку в объект datetime
            date = date_obj.strftime("%Y-%m-%d")

        params = {
            "apikey": self.api_key,
            "format": "json",
            "from": from_station_id,
            "to": to_station_id,
            "date": date,
            "lang": "ru_RU",
            "transport_types": "plane"
        }

        try:
            response = requests.get(self.BASE_URL, params=params)
            response.raise_for_status()
            data = response.json()

            if not data.get("segments"):
                return "Нет данных о рейсах."

            fr_city = data["search"]["from"]["title"]
            to_city = data["search"]["to"]["title"]
            flights = []

            for segment in data["segments"]:
                fr = f"{segment['from']['station_type']} {segment['from']['title']}"
                to = f"{segment['to']['station_type']} {segment['to']['title']}"
                departure = segment["departure"]
                arrival = segment["arrival"]
                duration = segment["duration"] // 60  # Перевод в минуты
                transport = segment["thread"]["vehicle"]
                number = segment["thread"]["number"]
                carrier = segment["thread"]["carrier"]["title"]
                link = segment["thread"]["thread_method_link"]

                airport_data_from = get_data_airport_by_code_from_yandex(segment["from"]["title"])
                airport_data_to = get_data_airport_by_code_from_yandex(segment["to"]["title"])

                if type_to_return == "str":
                    flights.append(
                        f"{fr_city} {fr} - {to_city} {to}: {departure} → {arrival} | {duration} мин | {transport} | № {number} | {carrier} | {link}"
                    )
                else:  # type_to_return == "dict"
                    flights.append({
                        "fr_city": fr_city,
                        "to_city": to_city,
                        "departure": departure,
                        "arrival": arrival,
                        "duration": duration,
                        "transport": transport,
                        "number": number,
                        "carrier": carrier,
                        "price": 0,
                        "link": link,
                        "airport_data_from": airport_data_from,
                        "airport_data_to": airport_data_to
                    })

            return "\n".join(flights) if type_to_return == "str" else flights

        except requests.exceptions.RequestException as e:
            return f"Ошибка при запросе: {e}"

    def get_best_route(self, from_id, to_id, date):
        """
        Определяет лучший маршрут (по минимальному времени в пути).

        :param from_id: Код станции отправления.
        :param to_id: Код станции назначения.
        :return: Лучший маршрут (словарь) или None, если рейсов нет.
        """
        flights = self.get_schedule(from_id, to_id, date)
        if not flights or isinstance(flights, str):
            return None

        return min(flights, key=lambda flight: flight["duration"])
