from fastapi import APIRouter, Request

from checking_without_location import get_coords_to_transport_plane, get_coords_to_transport_train, \
    get_coords_to_transport_car, get_coords_to_transport_bike, get_coords_to_transport_foot
from presentation.app.models import RequestName, RequestNameDate

unlocate_router = APIRouter(prefix="/unlocate")


@unlocate_router.get("/version")
async def locations():
    return {
        "ChillGuys are best xd"
    }


@unlocate_router.post("/plane")
async def locate_transport(route: RequestNameDate):
    result = get_coords_to_transport_plane(route.start, route.end, route.date)

    return result


@unlocate_router.post("/train")
async def locate_transport(request: RequestNameDate):
    result = get_coords_to_transport_train(
        request.start,
        request.end,
        request.date
    )
    return result


@unlocate_router.post("/car")
async def locate_transport(request: RequestName):
    result = get_coords_to_transport_car(
        request.start,
        request.end
    )

    return result


@unlocate_router.post("/foot")
async def locate_transport(request: RequestName):
    result = get_coords_to_transport_foot(
        request.start,
        request.end
    )

    return result


@unlocate_router.post("/bike")
async def locate_transport(request: RequestName):
    result = get_coords_to_transport_bike(
        request.start,
        request.end
    )

    return result
