from config.env import StrEnv, IntEnv

__all__ = [
    "API_YANDEX",
    "API_AVIASALES",
    "API_GRAPHHOOPER",
]

API_YANDEX: str = StrEnv("API_YANDEX")
API_AVIASALES: str = StrEnv("API_AVIASALES")
API_GRAPHHOOPER: str = StrEnv("API_GRAPHHOOPER")
