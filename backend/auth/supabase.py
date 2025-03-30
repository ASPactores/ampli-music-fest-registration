import os
import dotenv
from supabase import create_client, Client

dotenv.load_dotenv()

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_ANON_KEY")
)