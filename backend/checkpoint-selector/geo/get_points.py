from pre_start.tables import cities, staions_in_region
from nearest_city import nearest_city


def get_id(cities, name):
    return cities["Россия"][name]


def get_points_from_names(from_station: str, to_station: str, ):
    ct = cities.create_table_city_id()
    # st = staions_in_region.create_table_station_id()

    from_station_id = get_id(ct, from_station)
    to_station_id = get_id(ct, to_station)

    return [from_station_id, to_station_id]


def get_points_from_geometry(point_A, point_B):
    near_city_start = nearest_city.get_data_of_nearest_city(point_A)
    near_city_end = nearest_city.get_data_of_nearest_city(point_B)

    ct = cities.create_table_city_id()
    from_station_id = get_id(ct, near_city_start["nearest_city"])
    to_station_id = get_id(ct, near_city_end["nearest_city"])

    return [from_station_id, to_station_id]
