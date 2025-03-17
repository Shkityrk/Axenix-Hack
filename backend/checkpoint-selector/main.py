from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from presentation.app.routes.get_version import api_router
from presentation.app.routes.locate_routes import locate_router
from presentation.app.routes.unlocate_routes import unlocate_router

app = FastAPI()

origins = ["http://localhost:5173"]

# Добавляем CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
app.include_router(locate_router)
app.include_router(unlocate_router)
