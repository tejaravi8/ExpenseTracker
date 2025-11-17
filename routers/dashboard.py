from fastapi import APIRouter, Request, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from database import SessionLocal
from models import Expense, Budget, CategoryLimit

router = APIRouter()


def db():
    s = SessionLocal()
    try:
        yield s
    finally:
        s.close()


def user(request: Request):
    return request.session.get("user_id")


@router.get("/dashboard")
def dashboard(request: Request, db: Session = Depends(db)):
    uid = user(request)
    if not uid:
        return RedirectResponse("/login")

    expenses = db.query(Expense).filter(Expense.user_id == uid).all()

    total = sum(e.amount for e in expenses)
    count = len(expenses)
    biggest = max(expenses, key=lambda e: e.amount) if expenses else None

    category_sum = {}
    for e in expenses:
        category_sum[e.category] = category_sum.get(e.category, 0) + e.amount

    top = max(category_sum, key=category_sum.get) if category_sum else "None"

    labels_cat = list(category_sum.keys())
    values_cat = list(category_sum.values())

    today = datetime.today()
    last7 = [(today - timedelta(days=i)).strftime("%Y-%m-%d") for i in range(6, -1, -1)]

    last7_values = [0] * 7
    for e in expenses:
        if e.date in last7:
            last7_values[last7.index(e.date)] += e.amount

    highest_val = max(last7_values) if last7_values else 0
    highest_day = last7[last7_values.index(highest_val)] if highest_val else "None"

    monthly = {}
    for e in expenses:
        m = e.date[:7]
        monthly[m] = monthly.get(m, 0) + e.amount

    months = sorted(monthly.keys())
    month_values = [monthly[m] for m in months]

    avg_daily = round(total / 30, 2) if total else 0
    pct_change = round(((month_values[-1] - month_values[-2]) / month_values[-2]) * 100,
                       2) if len(month_values) >= 2 and month_values[-2] else 0

    budget = db.query(Budget).filter(Budget.user_id == uid).first()
    if not budget:
        budget = Budget(user_id=uid, amount=10000)
        db.add(budget)
        db.commit()

    cur_month = today.strftime("%Y-%m")
    cur_month_spent = sum(e.amount for e in expenses if e.date.startswith(cur_month))
    remaining = budget.amount - cur_month_spent
    progress = min(100, (cur_month_spent / budget.amount) * 100) if budget.amount else 0

    limits = db.query(CategoryLimit).filter(CategoryLimit.user_id == uid).all()
    category_limits = {l.category: l.limit_amount for l in limits}

    warnings = []
    for c, limit in category_limits.items():
        spent = category_sum.get(c, 0)
        if limit > 0 and spent > limit:
            warnings.append(f"{c} exceeded limit by ₹{spent - limit}")

    return request.app.templates.TemplateResponse("dashboard.html", {
        "request": request,
        "total": total,
        "count": count,
        "biggest_tx": biggest,
        "top_category": top,
        "labels_cat": labels_cat,
        "values_cat": values_cat,
        "last7_labels": last7,
        "last7_values": last7_values,
        "highest_day": highest_day,
        "highest_day_val": highest_val,
        "months": months,
        "month_values": month_values,
        "avg_daily": avg_daily,
        "pct_change": pct_change,
        "budget": budget.amount,
        "cur_month_spent": cur_month_spent,
        "budget_remaining": remaining,
        "progress_pct": progress,
        "limit_warnings": warnings
    })
