from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import ip, benchmark, script, avatar

# Create DB Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Self-Media Workbench Demo")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(ip.router)
app.include_router(benchmark.router)
app.include_router(script.router)
app.include_router(avatar.router)

@app.get("/")
def read_root():
    return {"message": "AI Self-Media Workbench API is running"}
