from fastapi import FastAPI

from presentation.app.routes.get_version import api_router
from presentation.app.routes.locate_routes import locate_router
from presentation.app.routes.unlocate_routes import unlocate_router

app = FastAPI()

app.include_router(api_router)
app.include_router(locate_router)
app.include_router(unlocate_router)
