from fastapi import APIRouter, Request, Depends, Form
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User, Expense, Budget, CategoryLimit
from datetime import datetime
from fastapi.responses import HTMLResponse, RedirectResponse
router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/profile")
def profile(request: Request, db: Session = Depends(get_db)):
    user_id = request.session.get("user_id")
    if not user_id:
        return request.app.templates.TemplateResponse("login.html", {"request": request})

    # User object
    user = db.query(User).filter(User.id == user_id).first()

    # Category limits
    limit_rows = db.query(CategoryLimit).filter(CategoryLimit.user_id == user_id).all()
    limits = {row.category: row.limit_amount for row in limit_rows}

    categories = ["Food", "Travel", "Shopping", "Bills", "Other"]
    for c in categories:
        if c not in limits:
            row = CategoryLimit(user_id=user_id, category=c, limit_amount=0)
            db.add(row)
            db.commit()
            limits[c] = 0

    # Budget
    today = datetime.today()
    cur_month = today.strftime("%Y-%m")

    budget_row = db.query(Budget).filter(Budget.user_id == user_id).first()
    if not budget_row:
        budget_row = Budget(user_id=user_id, amount=10000)
        db.add(budget_row)
        db.commit()

    budget = budget_row.amount

    # Current month spent
    expenses = db.query(Expense).filter(Expense.user_id == user_id).all()
    cur_used = sum(e.amount for e in expenses if e.date.startswith(cur_month))

    remaining = budget - cur_used
    pct = min(100, (cur_used / budget) * 100) if budget else 0

    return request.app.templates.TemplateResponse("profile.html", {
        "request": request,
        "user": user,                    # ⭐ MUST BE A MODEL OBJECT
        "limits": limits,
        "budget": budget,
        "cur_month_spent": cur_used,
        "budget_remaining": remaining,
        "progress_pct": pct
    })


@router.post("/profile/update-limit")
def update_limit(request: Request, category: str = Form(...),
                 limit_amount: float = Form(...), db: Session = Depends(get_db)):

    user_id = request.session.get("user_id")
    row = db.query(CategoryLimit).filter(
        CategoryLimit.user_id == user_id,
        CategoryLimit.category == category
    ).first()

    if row:
        row.limit_amount = limit_amount
        db.commit()

    return RedirectResponse("/profile", status_code=302)
