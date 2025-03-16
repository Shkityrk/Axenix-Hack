from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel

from checking_with_location import (
    get_coords_to_transport_plane,
    get_coords_to_transport_train,
    get_coords_to_transport_car,
    get_coords_to_transport_bike,
    get_coords_to_transport_foot)
from presentation.app.models import RequestLocationDate, RequestLocation

locate_router = APIRouter(prefix="/locate")


@locate_router.post("/plane")
async def locate_transport(request: RequestLocationDate):
    result = get_coords_to_transport_plane(
        [request.start.latitude, request.start.longitude],
        [request.end.latitude, request.end.longitude],
        request.date
    )

    if result == {None}:
        raise HTTPException(status_code=422, detail="Invalid route data")

    return result


@locate_router.post("/train")
async def locate_transport(request: RequestLocationDate):
    result = get_coords_to_transport_train(
        [request.start.latitude, request.start.longitude],
        [request.end.latitude, request.end.longitude],
        request.date
    )

    if result == {None}:
        raise HTTPException(status_code=422, detail="Invalid route data")
    return result


@locate_router.post("/car")
async def locate_transport(request: RequestLocation):
    result = get_coords_to_transport_car(
        [request.start.latitude, request.start.longitude],
        [request.end.latitude, request.end.longitude]

    )
    if result == {None}:
        raise HTTPException(status_code=422, detail="Invalid route data")

    return result


@locate_router.post("/foot")
async def locate_transport(request: RequestLocation):
    result = get_coords_to_transport_foot(
        [request.start.latitude, request.start.longitude],
        [request.end.latitude, request.end.longitude],
    )
    if result == {None}:
        raise HTTPException(status_code=422, detail="Invalid route data")

    return result


@locate_router.post("/bike")
async def locate_transport(request: RequestLocation):
    result = get_coords_to_transport_bike(
        [request.start.latitude, request.start.longitude],
        [request.end.latitude, request.end.longitude],
    )
    if result == {None}:
        raise HTTPException(status_code=422, detail="Invalid route data")

    return result
