from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from auth.supabase import supabase

from fnmatch import fnmatch

exclude_path = [
    "*/docs",
    "*/openapi.json",
    "*/auth*",
    "*/openapi.json*",
]

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        """
        Middleware to check if the user is authenticated
        """
        try:
            if any(fnmatch(request.url.path, pattern) for pattern in exclude_path) or request.url.path == "/":
                return await call_next(request)

            access_token = request.headers.get("Authorization")
            
            if access_token is None:
                return JSONResponse(
                    content={"message": "Unauthorized"},
                    status_code=401,
                )

            access_token = access_token.split(" ")[1]
            # Check if the token is valid
            user = supabase.auth.get_user(access_token)
            if user is None:
                return JSONResponse(
                    content={"message": "Unauthorized"},
                    status_code=401,
                )
                
            # If the token is valid, proceed with the request
            await call_next(request)
        except Exception:
            return JSONResponse(
                content={"message": "Unauthorized"},
                status_code=401,
            )
