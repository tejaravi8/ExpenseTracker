from fastapi import APIRouter, Request, Form, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from database import SessionLocal
from models import User

router = APIRouter()
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")


def db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


@router.get("/", response_class=HTMLResponse)
def home(request: Request):
    if request.session.get("user_id"):
        return RedirectResponse("/dashboard")
    return request.app.templates.TemplateResponse("home.html", {"request": request})


@router.get("/login", response_class=HTMLResponse)
def login_page(request: Request):
    return request.app.templates.TemplateResponse("login.html", {"request": request})


@router.post("/login")
def login(request: Request, email: str = Form(...), password: str = Form(...), db: Session = Depends(db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not pwd.verify(password, user.password):
        return request.app.templates.TemplateResponse("login.html", {"request": request, "error": "Invalid login"})
    request.session["user_id"] = user.id
    return RedirectResponse("/dashboard", status_code=302)


@router.get("/register", response_class=HTMLResponse)
def register_page(request: Request):
    return request.app.templates.TemplateResponse("register.html", {"request": request})


@router.post("/register")
def register(request: Request, username: str = Form(...), email: str = Form(...),
             password: str = Form(...), db: Session = Depends(db)):

    if db.query(User).filter(User.email == email).first():
        return request.app.templates.TemplateResponse("register.html",
            {"request": request, "error": "Email already exists"}
        )

    hashed = pwd.hash(password)
    db.add(User(username=username, email=email, password=hashed))
    db.commit()

    return RedirectResponse("/login", status_code=302)


@router.get("/logout")
def logout(request: Request):
    request.session.clear()
    return RedirectResponse("/login")
