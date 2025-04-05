from fastapi import Request
from fastapi.responses import RedirectResponse
from starlette.middleware.base import BaseHTTPMiddleware
from auth.supabase import supabase
from urllib.parse import urljoin

exclude_path = [
    "/docs",
    "/api/v1/auth",
    "/api/v1/openapi.json",
]

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        """
        Middleware to check if the user is authenticated
        """
        try:
            if request.url.path.startswith(tuple(exclude_path)) or request.url.path == "/":
                return await call_next(request)

            base_url = str(request.base_url).rstrip('/')
            login_url = urljoin(base_url, "/login")


            access_token = request.cookies.get("access_token")
            refresh_token = request.cookies.get("refresh_token")
            
            if access_token is None or refresh_token is None:
                return RedirectResponse(url=login_url, status_code=302)
            
            try:
                supabase.auth.get_user(access_token)
                return await call_next(request)
            except Exception:
                # Token is invalid, try to refresh
                try:
                    new_auth = supabase.auth.refresh_session(refresh_token)
                    if new_auth.session is None:
                        return RedirectResponse(url="/login", status_code=302)
                    
                    access_token = new_auth.session.access_token
                    refresh_token = new_auth.session.refresh_token
                    
                    response = await call_next(request)
                    
                    response.set_cookie(
                        key="access_token",
                        value=access_token,
                        httponly=True,
                        expires=new_auth.session.expires_in,
                    )
                    response.set_cookie(
                        key="refresh_token",
                        value=refresh_token,
                        httponly=True,
                    )
                    
                    return response
                except Exception:
                    return RedirectResponse(url=login_url, status_code=302)
        except Exception:
            return RedirectResponse(url=login_url, status_code=302)
