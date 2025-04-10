from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from mangum import Mangum

from lambda_decorators import cors_headers

from models.model import init_db
from auth.auth_routes import router as auth_routes

from routes.attendee_router import router as retrieve_attendee_routes
from routes.checkin_router import router as checkin_routes

from constants.settings import get_settings
from utils.logger import logger

SETTINGS = get_settings()

async def lifespan(app: FastAPI):
    logger.info(f"Starting application in {SETTINGS.STAGE} environment")
    await init_db()
    yield

app = FastAPI(
    # root_path=f"/{SETTINGS.STAGE}",
    lifespan=lifespan,
    # openapi_url=None,
)

app.include_router(auth_routes)
app.include_router(retrieve_attendee_routes)
app.include_router(checkin_routes)

@app.get("/", include_in_schema=False)
def hello():
    html_content = """
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Welcome | Your App</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    background-color: #f9fafb;
                }
                .container {
                    text-align: center;
                }
                h1 {
                    font-size: 2.5rem;
                    color: #333;
                }
                p {
                    font-size: 1.2rem;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Welcome to the Sari-sari 2025 Registration System</h1>
                <p>The backend API is up and running 🚀</p>
            </div>
        </body>
    </html>
    """
    return HTMLResponse(content=html_content, status_code=200)

mangum_handler = Mangum(app, lifespan="off")

@cors_headers(origin=SETTINGS.FRONTEND_URL, credentials=True)
def handler(event, context):
    return mangum_handler(event, context)