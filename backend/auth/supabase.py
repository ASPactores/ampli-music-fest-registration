from supabase import create_client, Client
from constants import settings

SETTINGS = settings.get_settings()

supabase: Client = create_client(
    SETTINGS.SUPABASE_URL,
    SETTINGS.SUPABASE_ANON_KEY
)