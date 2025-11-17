from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from fastapi.templating import Jinja2Templates

from routers import auth, dashboard, expenses, profile
from fastapi.responses import HTMLResponse
from fastapi.exception_handlers import http_exception_handler
from fastapi.exceptions import HTTPException

app = FastAPI()

# Session middleware
app.add_middleware(SessionMiddleware, secret_key="supersecretkey123")

# Static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Templates
templates = Jinja2Templates(directory="templates")
app.templates = templates   # ⭐ Required for routers to access templates

# Routers
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(expenses.router)
app.include_router(profile.router)
