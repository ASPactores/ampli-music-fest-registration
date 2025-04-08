from fastapi import HTTPException, status, Security
from fastapi.security.api_key import APIKeyHeader
from auth.supabase import supabase

token_key = APIKeyHeader(name="Authorization")

async def validate_token(auth_key: str = Security(token_key)):
    """
    Dependency to validate the Bearer token using Supabase authentication.
    Returns the authenticated user if valid, otherwise raises HTTPException.
    """
    try:
        if not auth_key:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unauthorized: Missing authentication token",
            )

        if " " in auth_key:
            scheme, access_token = auth_key.split(" ", 1)
            if scheme.lower() != "bearer":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Unauthorized: Invalid authentication scheme",
                )
        else:
            access_token = auth_key 

        user_response = supabase.auth.get_user(access_token)
        if not user_response or not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unauthorized: Invalid or expired token",
            )

        return user_response.user

    except Exception as e:
        print(f"Token validation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized: Authentication failed",
        )