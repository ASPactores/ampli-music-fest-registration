from fastapi import Request, HTTPException, Depends, Cookie
from fastapi.responses import RedirectResponse
from typing import Optional
from auth.supabase import supabase

async def validate_auth(
    request: Request,
    access_token: Optional[str] = Cookie(None),
    refresh_token: Optional[str] = Cookie(None)
):
    """
    Dependency to check if the user is authenticated
    """
    if access_token is None or refresh_token is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        # Validate the access token
        supabase.auth.get_user(access_token)
        return True
    except Exception:
        # Token is invalid, try to refresh
        try:
            new_auth = supabase.auth.refresh_session(refresh_token)
            if new_auth.session is None:
                raise HTTPException(status_code=401, detail="Not authenticated")
            
            # Store refreshed tokens in request state for later use
            request.state.new_access_token = new_auth.session.access_token
            request.state.new_refresh_token = new_auth.session.refresh_token
            request.state.token_expires = new_auth.session.expires_in
            
            return True
        except Exception:
            raise HTTPException(status_code=401, detail="Not authenticated")