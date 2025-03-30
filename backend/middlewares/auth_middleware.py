from fastapi import Request
from fastapi.responses import RedirectResponse
from typing import Callable
from auth.supabase import supabase

class AuthMiddleware:
    def __init__(self, auto_error: bool = True):
        self.auto_error = auto_error
        
    async def __call__(self, request: Request, call_next: Callable):
        """
        Middleware to check if the user is authenticated
        """
        try:
            access_token = request.cookies.get("access_token")
            refresh_token = request.cookies.get("refresh_token")
            
            if access_token is None or refresh_token is None:
                return RedirectResponse(url="/login", status_code=302)
            
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
                    
                    # Create response with the original request
                    response = await call_next(request)
                    
                    # Set new cookies
                    response.set_cookie(
                        key="access_token",
                        value=f"Bearer {access_token}",
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
                    return RedirectResponse(url="/login", status_code=302)
        except Exception:
            return RedirectResponse(url="/login", status_code=302)