# Sari-sari Music Festival Registration

## To Get Started

Before you start, ensure you have the cloned the repository:

```bash
git clone https://github.com/ASPactores/ampli-music-fest-registration.git
```

### Prerequisites

- Node.js (for frontend)
- Python 3.10 (for backend)
- uv (package manager for backend): `pip install uv`

### Frontend

1. Navigate to the frontend directory
   ```bash
   cd ampli-music-fest-registration/frontend
   ```
2. Install the dependencies
   ```bash
   npm install
   ```
3. Start the development server
   ```bash
   npm run dev
   ```

### Backend

1. Navigate to the backend directory
   ```bash
   cd ampli-music-fest-registration/backend
   ```
2. Create a virtual environment and Install dependencies
   ```bash
   uv venv && uv sync
   ```
3. Activate the virtual environment
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On MacOS/Linux:
     ```bash
     source venv/bin/activate
     ```
4. Run fastapi server
   ```bash
   ENV=development fastapi dev main.py
   ```
