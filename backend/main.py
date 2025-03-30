from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from auth.auth_routes import router as auth_routes

app = FastAPI(
    root_path="/api/v1",
)
origins = ['*']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(
    auth_routes,
)

@app.get("/")
def hello_world():
    return {"message": "Hello World"}

handler = Mangum(
    app,
    api_gateway_base_path="/api/v1",
)