import os
from typing import Tuple, Dict, List
import requests
import numpy as np
from rdp import rdp  # Установить через pip install rdp
from geopy.distance import geodesic  # Установить через pip install geopy

from config import API_YANDEX


class PointLocator:
    API_URL = "https://graphhopper.com/api/1/route"
    ALLOWED_TYPES = {"car", "bike", "foot"}

    def __init__(self, api_key: str):
        """
        Инициализация класса с API-ключом.
        :param api_key: Ключ для доступа к GraphHopper API
        """
        self.api_key = api_key

    def locate_pointers_by_type(self, point_A: Tuple[float, float], point_B: Tuple[float, float],
                                transport_type: str) -> Dict:
        """
        Получает маршрут между двумя точками для заданного типа транспорта.
        :param point_A: Координаты начальной точки (широта, долгота)
        :param point_B: Координаты конечной точки (широта, долгота)
        :param transport_type: Тип транспорта (car, bike, foot)
        :return: Словарь с данными о маршруте
        """
        if transport_type not in self.ALLOWED_TYPES:
            raise ValueError(f"Некорректный тип транспорта: {transport_type}. Доступны только: {self.ALLOWED_TYPES}")

        params = {
            "point": [f"{point_A[0]},{point_A[1]}", f"{point_B[0]},{point_B[1]}"],
            "profile": transport_type,
            "points_encoded": "false",
            "key": self.api_key
        }

        response = requests.get(self.API_URL, params=params)

        if response.status_code == 200:
            data = response.json()
            route = data["paths"][0]

            return {
                "distance_km": route["distance"] / 1000,
                "duration_min": route["time"] / 60000,
                "path": [
                    {"point_number": i, "latitude": coord[1], "longitude": coord[0]}
                    for i, coord in enumerate(route["points"]["coordinates"])
                ]
            }
        else:
            raise RuntimeError(f"Ошибка {response.status_code}: {response.text}")

    @staticmethod
    def filter_close_points(points: List[Dict], min_distance: float = 10) -> List[Dict]:
        """
        Убираем точки, которые находятся ближе чем min_distance (в метрах).
        :param points: Список точек маршрута
        :param min_distance: Минимальное расстояние между точками (в метрах)
        :return: Отфильтрованный список точек
        """
        filtered_points = [points[0]]
        for point in points[1:]:
            last_coords = (filtered_points[-1]["latitude"], filtered_points[-1]["longitude"])
            point_coords = (point["latitude"], point["longitude"])

            if geodesic(last_coords, point_coords).meters > min_distance:
                filtered_points.append(point)

        return filtered_points

    @staticmethod
    def simplify_route(points: List[Dict], epsilon: float = 0.0001) -> List[Dict]:
        """
        Упрощает маршрут, уменьшая количество точек, но сохраняя форму пути.
        :param points: Список точек маршрута
        :param epsilon: Чувствительность алгоритма RDP
        :return: Упрощенный список точек маршрута
        """
        coords = np.array([[p["latitude"], p["longitude"]] for p in points])
        simplified_coords = rdp(coords, epsilon=epsilon)

        return [{"point_number": i, "latitude": float(lat), "longitude": float(lon)} for i, (lat, lon) in
                enumerate(simplified_coords)]

    def get_simplified_route(self, point_A: Tuple[float, float], point_B: Tuple[float, float],
                             transport_type: str) -> Dict:
        """
        Получает маршрут и применяет к нему фильтрацию точек и упрощение.
        :param point_A: Координаты начальной точки (широта, долгота)
        :param point_B: Координаты конечной точки (широта, долгота)
        :param transport_type: Тип транспорта (car, bike, foot)
        :return: Словарь с отфильтрованным и упрощенным маршрутом
        """
        route_data = self.locate_pointers_by_type(point_A, point_B, transport_type)

        filtered_route = self.filter_close_points(route_data["path"], min_distance=10)
        simplified_route = self.simplify_route(filtered_route, epsilon=0.0001)

        return {
            "distance_km": route_data["distance_km"],
            "duration_min": route_data["duration_min"],
            "path": simplified_route
        }


def main():
    API_KEY = API_YANDEX
    locator = PointLocator(API_KEY)

    point_A = [55.7558, 37.6173]  # Москва
    point_B = [59.9343, 30.3351]  # Санкт-Петербург
    transport_type = "car"

    try:
        route_info = locator.get_simplified_route(point_A, point_B, transport_type)
        print(route_info)
    except Exception as e:
        print("Ошибка запроса:", e)


if __name__ == "__main__":
    main()
