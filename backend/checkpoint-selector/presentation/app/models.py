from pydantic import BaseModel


class LocationPoint(BaseModel):
    latitude: float
    longitude: float


class RequestLocationDate(BaseModel):
    start: LocationPoint
    end: LocationPoint
    date: str


class RequestLocation(BaseModel):
    start: LocationPoint
    end: LocationPoint


class RequestNameDate(BaseModel):
    start: str
    end: str
    date: str


class RequestName(BaseModel):
    start: str
    end: str
