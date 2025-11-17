from fastapi import APIRouter, Request, Form, Depends
from fastapi.responses import RedirectResponse, FileResponse
from sqlalchemy.orm import Session
import pandas as pd
import os

from database import SessionLocal
from models import Expense

router = APIRouter()
os.makedirs("exports", exist_ok=True)


def db():
    s = SessionLocal()
    try:
        yield s
    finally:
        s.close()


def user(request: Request):
    return request.session.get("user_id")


@router.get("/expenses")
def expenses_list(
    request: Request,
    db: Session = Depends(db),
    q: str = "",
    category: str = "",
    date: str = "",
    min: str = None,
    max: str = None
):

    user_id = request.session.get("user_id")
    if not user_id:
        return RedirectResponse("/login")

    query = db.query(Expense).filter(Expense.user_id == user_id)

    if q:
        query = query.filter(Expense.description.contains(q))
    if category:
        query = query.filter(Expense.category == category)
    if date:
        query = query.filter(Expense.date == date)

    # safe conversion
    min_val = float(min) if min not in (None, "") else None
    max_val = float(max) if max not in (None, "") else None

    if min_val is not None:
        query = query.filter(Expense.amount >= min_val)

    if max_val is not None:
        query = query.filter(Expense.amount <= max_val)

    expenses = query.all()

    return request.app.templates.TemplateResponse(
        "expenses.html",
        {
            "request": request,
            "expenses": expenses
        }
    )


@router.post("/expenses/add")
def add(request: Request, amount: float = Form(...), category: str = Form(...),
        date: str = Form(...), description: str = Form(""),
        db: Session = Depends(db)):

    uid = user(request)
    if not uid:
        return RedirectResponse("/login")

    db.add(Expense(user_id=uid, amount=amount, category=category, date=date, description=description))
    db.commit()

    return RedirectResponse("/expenses", status_code=302)


@router.get("/expenses/update/{id}")
def update_page(id: int, request: Request, db: Session = Depends(db)):
    uid = user(request)
    if not uid:
        return RedirectResponse("/login")

    exp = db.query(Expense).filter(Expense.id == id, Expense.user_id == uid).first()
    return request.app.templates.TemplateResponse("update.html",
        {"request": request, "expense": exp})


@router.post("/expenses/update/{id}")
def update(id: int, request: Request, amount: float = Form(...),
           category: str = Form(...), date: str = Form(...),
           description: str = Form(""), db: Session = Depends(db)):

    uid = user(request)
    if not uid:
        return RedirectResponse("/login")

    exp = db.query(Expense).filter(Expense.id == id, Expense.user_id == uid).first()
    exp.amount = amount
    exp.category = category
    exp.date = date
    exp.description = description
    db.commit()

    return RedirectResponse("/expenses", status_code=302)


@router.get("/expenses/delete/{id}")
def delete(id: int, request: Request, db: Session = Depends(db)):
    uid = user(request)
    if not uid:
        return RedirectResponse("/login")

    exp = db.query(Expense).filter(Expense.id == id, Expense.user_id == uid).first()
    db.delete(exp)
    db.commit()

    return RedirectResponse("/expenses", status_code=302)


@router.get("/expenses/export/csv")
def export_csv(request: Request, db: Session = Depends(db)):
    uid = user(request)
    if not uid:
        return RedirectResponse("/login")

    data = db.query(Expense).filter(Expense.user_id == uid).all()
    df = pd.DataFrame([vars(e) for e in data])

    path = "exports/expenses.csv"
    df.to_csv(path, index=False)
    return FileResponse(path, filename="expenses.csv")
