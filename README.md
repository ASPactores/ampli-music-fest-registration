# Sari-sari Music Festival Registration

## 📝 Description

This project manages registration and attendee tracking for the Sari-sari Music Fest 2025 event, ensuring efficient attendee management throughout the festival. The system enables organizers to check in users by simply scanning their QR codes, which streamlines the entire attendee check-in process and enhances the overall event experience.

## 🛠️ Technology Stack

### Frontend

- **React**: JavaScript library for building the user interface
- **Vite**: Next-generation frontend tooling for faster development
- **ShadcnUI**: UI component library

### Backend

- **FastAPI**: Modern, high-performance web framework for building APIs
- **Serverless Framework**: Infrastructure as code for AWS resources
- **AWS**:
  - Lambda for serverless computing
  - API Gateway for API management
  - SSM Parameter Store for secure configuration
- **Supabase Auth**: Authentication and authorization
- **PostgreSQL**: Database hosted in Supabase
- **SQLAlchemy**: SQL toolkit and Object-Relational Mapping (ORM)

## 🚀 Getting Started

Before you start, ensure you have cloned the repository:

```bash
git clone https://github.com/ASPactores/ampli-music-fest-registration.git
```

### 📋 Prerequisites

- Node.js (for frontend)
- Python 3.10 (for backend)
- uv (package manager for backend): `pip install uv`
- Linux environment or WSL (Windows Subsystem for Linux) for Windows users
  - Windows users are recommended to use WSL2 for the best development experience

### 💻 Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd ampli-music-fest-registration/frontend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### 🔧 Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd ampli-music-fest-registration/backend
   ```

2. Create a virtual environment and install dependencies:

   ```bash
   uv venv && uv sync
   ```

3. Activate the virtual environment:

   ```bash
   source venv/bin/activate
   ```

4. Run FastAPI server:

   ```bash
   ENV=development fastapi dev main.py
   ```

5. Deploy to AWS Lambda:

   ```bash
   sls deploy --stage development

   # To delete the deployed service
   sls remove --stage development
   ```

## ✨ Features

- QR code-based attendee check-in
- Real-time attendance tracking
- Mobile-friendly interface for field operations and attendance monitoring
- Administrative dashboard for event organizers
