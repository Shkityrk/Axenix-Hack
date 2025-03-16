from fastapi import APIRouter

api_router = APIRouter(prefix="/api")


@api_router.get("/version")
async def get_version():
    return {"version": 1}
