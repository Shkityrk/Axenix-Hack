from scipy.spatial.distance import euclidean
from rdp import rdp
import numpy as np

from config import API_GRAPHHOOPER
from point_locator import PointLocator


def filter_close_points(points, min_distance=10):
    filtered_points = [points[0]]
    for point in points[1:]:
        last_coords = (filtered_points[-1]["latitude"], filtered_points[-1]["longitude"])
        point_coords = (point["latitude"], point["longitude"])

        # Проверяем расстояние
        if euclidean(last_coords, point_coords) > min_distance / 111000:  # 1 градус ≈ 111 км
            filtered_points.append(point)

    return filtered_points


def simplify_route(points, epsilon=0.0001):
    """ Упрощает маршрут, уменьшая количество точек, но сохраняя форму пути """
    coords = np.array([[p["latitude"], p["longitude"]] for p in points])  # Берем только координаты
    return rdp(coords, epsilon=epsilon)


def main_simple(route):
    filtered_route = filter_close_points(route, min_distance=10)
    simplified_route = simplify_route(filtered_route)

    return simplified_route


def ndarray_to_point_locator(ndarray):
    """Преобразует ndarray координат в список словарей в формате PointLocator"""
    return [
        {"point_number": i, "latitude": float(lat), "longitude": float(lon)}
        for i, (lat, lon) in enumerate(ndarray)
    ]


def main():
    locator = PointLocator(API_GRAPHHOOPER)
    point_A = (55.7558, 37.6173)
    point_B = (59.9343, 30.3351)
    transport_type = "car"

    routes = locator.locate_pointers_by_type(point_A, point_B, transport_type)

    simple_route_in_nd_arr = main_simple(routes["path"])
    output_path = ndarray_to_point_locator(simple_route_in_nd_arr)

    res = {}
    res["distance_km"] = routes["distance_km"]
    res["duration_min"] = routes["duration_min"]
    res["path"] = output_path

    return res


if __name__ == '__main__':
    print(main())
