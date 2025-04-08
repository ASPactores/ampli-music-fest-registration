from .supabase import supabase
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    password: str
    
class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    uid: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class MessageResponse(BaseModel):
    message: str

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

@router.post(
    "/login",
    response_model=LoginResponse,
    status_code=200,
)
async def login(credentials: LoginRequest):
    """
    Login to the application
    """
    try:
        auth_response = supabase.auth.sign_in_with_password(
            {"email": credentials.email, "password": credentials.password}
        )
        
        if auth_response.user is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        return LoginResponse(
            access_token=auth_response.session.access_token,
            refresh_token=auth_response.session.refresh_token,
            uid=auth_response.user.id
        )
    except Exception as e:
        print(f"Login error: {str(e)}")  # Consider using proper logging
        raise HTTPException(status_code=401, detail="Authentication failed")

@router.post(
    "/refresh",
    response_model=LoginResponse,
    status_code=200,
)
async def refresh_token(request: RefreshTokenRequest):
    """
    Refresh the access token
    """
    try:
        auth_response = supabase.auth.refresh_session(request.refresh_token)
        
        if auth_response.user is None:
            raise HTTPException(status_code=400, detail="Invalid refresh token")
        
        return LoginResponse(
            access_token=auth_response.session.access_token,
            refresh_token=auth_response.session.refresh_token,
            uid=auth_response.user.id
        )
    except Exception as e:
        print(f"Refresh token error: {str(e)}")  # Consider using proper logging
        raise HTTPException(status_code=400, detail="Token refresh failed")

@router.post(
    "/logout",
    response_model=MessageResponse,
    status_code=200,
)
async def logout():
    """
    Logout the current user
    """
    try:
        supabase.auth.sign_out()
        return MessageResponse(message="Logout successful")
    except Exception as e:
        print(f"Logout error: {str(e)}")  # Consider using proper logging
        raise HTTPException(status_code=400, detail="Logout failed")