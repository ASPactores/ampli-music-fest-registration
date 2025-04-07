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
    "*/"
]

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        """
        Middleware to check if the user is authenticated
        """
        try:
            if any(fnmatch(request.url.path, pattern) for pattern in exclude_path) or request.url.path == "/":
                return await call_next(request)


            access_token = request.cookies.get("access_token")
            refresh_token = request.cookies.get("refresh_token")
            
            if access_token is None or refresh_token is None:
                return JSONResponse(
                    content={"message": "Unauthorized"},
                    status_code=401,
                )
            
            try:
                supabase.auth.get_user(access_token)
                return await call_next(request)
            except Exception:
                # Token is invalid, try to refresh
                try:
                    new_auth = supabase.auth.refresh_session(refresh_token)
                    if new_auth.session is None:
                        return JSONResponse(
                            content={"message": "Unauthorized"},
                            status_code=401,
                        )
                    
                    access_token = new_auth.session.access_token
                    refresh_token = new_auth.session.refresh_token
                    uid = new_auth.user.id
                    
                    response = await call_next(request)
                    
                    response.set_cookie(
                        key="access_token",
                        value=access_token,
                        httponly=True,
                        expires=new_auth.session.expires_in,
                        secure=True,
                        samesite="none",
                        path="/",
                    )
                    response.set_cookie(
                        key="refresh_token",
                        value=refresh_token,
                        httponly=True,
                        secure=True,
                        samesite="none",
                        path="/",
                    )
                    response.set_cookie(
                        key="uid",
                        value=uid,
                        httponly=False,
                        expires=new_auth.session.expires_in,
                        secure=True,
                        samesite="none",
                        path="/",
                    )
                    
                    return response
                except Exception:
                    return JSONResponse(
                        content={"message": "Unauthorized"},
                        status_code=401,
                    )
        except Exception:
            return JSONResponse(
                content={"message": "Unauthorized"},
                status_code=401,
            )
