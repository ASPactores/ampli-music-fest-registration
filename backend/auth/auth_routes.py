from .supabase import supabase
from fastapi import APIRouter, HTTPException, Request, Response
from fastapi.responses import RedirectResponse

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

@router.post(
    "/login",
    response_class=RedirectResponse,
)
def login(response: Response, email: str, password: str):
    """
    Login to the application
    """
    try:
        auth_response = supabase.auth.sign_in_with_password(
            {"email": email, "password": password}
        )
        if auth_response.user is None:
            raise HTTPException(status_code=400, detail="Login Failed")

        access_token = auth_response.session.access_token
        refresh_token = auth_response.session.refresh_token

        response = RedirectResponse(url="/", status_code=302)
        response.set_cookie(
            key="access_token",
            value=f"Bearer {access_token}",
            expires=auth_response.session.expires_in,
            httponly=True,
        )
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
        )

        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get(
    "/logout",
    response_class=RedirectResponse,
)
def logout(response: Response, request: Request):
    try:
        access_token = request.cookies.get("access_token")
        refresh_token = request.cookies.get("refresh_token")
        if access_token is None or refresh_token is None:
            raise HTTPException(status_code=400, detail="Not logged in")
        supabase.auth.sign_out()
        response = RedirectResponse(url="/login", status_code=302)
        response.delete_cookie(key="access_token")
        response.delete_cookie(key="refresh_token")
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
