from .supabase import supabase
from fastapi import APIRouter, HTTPException, Request, Response
from fastapi.responses import RedirectResponse, JSONResponse
from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    password: str

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

@router.post(
    "/login",
    response_class=RedirectResponse,
)
def login(request: Request, response: Response, credentials: LoginRequest):
    """
    Login to the application
    """
    try:
        auth_response = supabase.auth.sign_in_with_password(
            {"email": credentials.email, "password": credentials.password}
        )
        if auth_response.user is None:
            raise HTTPException(status_code=400, detail="Login Failed")

        access_token = auth_response.session.access_token
        refresh_token = auth_response.session.refresh_token
        uid = auth_response.user.id
        
        response = JSONResponse(
            content={"message": "Login successful"},
            status_code=200,
        )
        response.set_cookie(
            key="access_token",
            value=access_token,
            expires=auth_response.session.expires_in,
            httponly=True,
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
            expires=auth_response.session.expires_in,
            secure=True,
            samesite="none",
            path="/",
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
        response = JSONResponse(
            content={"message": "Logout successful"},
            status_code=200,
        )
        response.delete_cookie(key="access_token")
        response.delete_cookie(key="refresh_token")
        response.delete_cookie(key="uid")
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
