import os
import dotenv
from supabase import create_client, Client

if os.getenv("ENV") == "development":
    dotenv_path = '.env.development'
elif os.getenv("ENV") == "production":
    dotenv_path = '.env.production'
else:
    dotenv_path = '.env'

dotenv.load_dotenv(dotenv_path)

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_ANON_KEY")
)