from config import API_YANDEX, API_GRAPHHOOPER
from geo import search_obj, get_points
from airports import yandex_transport
from trains import yandex_schedule
from locate_by_points import point_locator

api_key = API_YANDEX
api_locator = API_GRAPHHOOPER


def check_planes(start, end, date):
    ids = get_points.get_points_from_names(start, end)
    from_station_id = ids[0]
    to_station_id = ids[1]
    api = yandex_transport.YandexTransportAPI(api_key)

    result = api.get_best_route(from_station_id, to_station_id, date)

    if not result:
        return {None}
    else:
        return result


def check_trains(start, end, date):
    ids = get_points.get_points_from_names(start, end)
    from_station_id = ids[0]
    to_station_id = ids[1]

    api = yandex_schedule.YandexRaspAPI(api_key)

    result = api.get_best_route(from_station_id, to_station_id, date)

    if not result:
        return {None}
    else:
        return result


def coords_planes(start, end, date):
    plane = check_planes(start, end, date)

    start = [plane["airport_data_from"]["latitude"], plane["airport_data_from"]["longitude"]]
    end = [plane["airport_data_to"]["latitude"], plane["airport_data_to"]["longitude"]]

    pt_0 = {
        "point_number": 0,
        "latitude": start[0],
        "longitude": start[1],
    }
    pt_1 = {
        "point_number": 1,
        "latitude": end[0],
        "longitude": end[1],
    }
    return {
        "duration_min": plane["duration"],
        "path": [pt_0, pt_1],
    }


def coords_trains(start, end, date):
    train = check_trains(start, end, date)

    start_name = train["from"]
    end_name = train["to"]

    start = search_obj.get_query(start_name)
    end = search_obj.get_query(end_name)

    pt_0 = {
        "point_number": 0,
        "latitude": start[0],
        "longitude": start[1],
    }
    pt_1 = {
        "point_number": 1,
        "latitude": end[0],
        "longitude": end[1],
    }
    return {
        "duration_min": train["duration"],
        "path": [pt_0, pt_1],
    }


def get_coords_to_transport_plane(start, end, date, tr_type="car"):
    locator = point_locator.PointLocator(api_locator)

    pl = coords_planes(start, end, date)

    initial_coords_start = search_obj.get_query(start)
    initial_coords_end = search_obj.get_query(end)

    route_A_airp1 = locator.get_simplified_route(initial_coords_start,
                                                 [pl["path"][0]["latitude"], pl["path"][0]["longitude"]], tr_type)
    route_airp2_B = locator.get_simplified_route([pl["path"][1]["latitude"], pl["path"][1]["longitude"]],
                                                 initial_coords_end, tr_type)

    route_A_airp1["type"] = tr_type
    route_airp2_B["type"] = tr_type
    pl["type"] = "plane"

    result = []
    result.append(route_A_airp1)
    result.append(pl)
    result.append(route_airp2_B)

    return result


def get_coords_to_transport_train(start, end, date, tr_type="car"):
    locator = point_locator.PointLocator(api_locator)
    tr = coords_trains(start, end, date)

    initial_coords_start = search_obj.get_query(start)
    initial_coords_end = search_obj.get_query(end)

    route_A_airp1 = locator.get_simplified_route(initial_coords_start,
                                                 [tr["path"][0]["latitude"], tr["path"][0]["longitude"]], tr_type)
    route_airp2_B = locator.get_simplified_route([tr["path"][1]["latitude"], tr["path"][1]["longitude"]],
                                                 initial_coords_end, tr_type)

    route_A_airp1["type"] = tr_type
    route_airp2_B["type"] = tr_type
    tr["type"] = "train"

    result = []
    result.append(route_A_airp1)
    result.append(tr)
    result.append(route_airp2_B)
    return result


def get_coords_to_transport_car(start, end, tr_type="car"):
    initial_coords_start = search_obj.get_query(start)
    initial_coords_end = search_obj.get_query(end)

    locator = point_locator.PointLocator(api_locator)
    route = locator.get_simplified_route(initial_coords_start, initial_coords_end, tr_type)
    route["type"] = "car"

    return route


def get_coords_to_transport_foot(start, end, tr_type="foot"):
    initial_coords_start = search_obj.get_query(start)
    initial_coords_end = search_obj.get_query(end)

    locator = point_locator.PointLocator(api_locator)
    route = locator.get_simplified_route(initial_coords_start, initial_coords_end, tr_type)
    route["type"] = "foot"

    return route


def get_coords_to_transport_bike(start, end, tr_type="bike"):
    initial_coords_start = search_obj.get_query(start)
    initial_coords_end = search_obj.get_query(end)

    locator = point_locator.PointLocator(api_locator)
    route = locator.get_simplified_route(initial_coords_start, initial_coords_end, tr_type)
    route["type"] = "bike"

    return route

# print(get_coords_to_transport_plane("Москва", "Новосибирск", "20.03.2025"))
# print(get_coords_to_transport_train("Москва", "Новосибирск", "20.03.2025"))
# print(get_coords_to_transport_car("Москва", "Новосибирск"))
# print(get_coords_to_transport_foot("Москва", "Новосибирск"))
# print(get_coords_to_transport_bike("Москва", "Новосибирск"))
