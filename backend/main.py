from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from models.model import init_db
from auth.auth_routes import router as auth_routes
from middlewares.auth_middleware import AuthMiddleware

from routes.attendee_router import router as retrieve_attendee_routes
from routes.checkin_router import router as checkin_routes


async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(
    root_path="/api/v1",
    lifespan=lifespan
)

origins = ['http://localhost:5173']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(AuthMiddleware)
app.include_router(
    auth_routes,
)
app.include_router(
    retrieve_attendee_routes,
)
app.include_router(
    checkin_routes,
)


@app.get("/")
def hello_world():
    return {"message": "Hello World"}

handler = Mangum(
    app,
    api_gateway_base_path="/api/v1",
)