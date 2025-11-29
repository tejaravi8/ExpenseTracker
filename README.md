# 💰 Expense Tracker — FastAPI

A clean and modern **Expense Tracking Web Application** built using  
**FastAPI + SQLite + SQLAlchemy + Jinja2 + Chart.js + Bootstrap**.

The app helps users track expenses, analyze spending, set budgets, and manage categories — all with a **premium UI** and **smooth experience**.


## ✨ Features

### 🔐 Authentication
- User Registration & Login  
- Password hashing using bcrypt  
- Secure session-based login  

### 📊 Dashboard
- Total expenses  
- Top spending category  
- Last 7 days chart  
- Monthly trend (12 months)  
- Category comparison  
- Biggest transaction  
- Budget progress bar  

### 🧾 Expense Management
- Add / Update / Delete expenses  
- Filters (category, date, range, search)  
- Sorting  
- Serial number display  
- Excel / CSV / PDF export  

### 🎨 UI Design
- Clean & responsive  
- Premium cards and tables  
- Dark Mode  
- Mobile-optimized  
- Glass-style navbar  

### 📁 Profile Section
- Category limits  
- Set Monthly Budget  
- Add custom categories with colors  


## 📸 Screenshots

### 🏠 Home Page
<img width="1919" height="930" alt="Screenshot 2025-11-29 211948" src="https://github.com/user-attachments/assets/6f897177-2d09-47ef-88f7-dcaa11702fcd" />

### 🔐 Login / Register  
<img width="1920" height="1080" alt="Screenshot 2025-11-29 200906" src="https://github.com/user-attachments/assets/d530e4e4-9d41-471c-ae16-f9b3fb73be02" />


### 📊 Dashboard  
<img width="1920" height="1080" alt="Screenshot 2025-11-29 200846" src="https://github.com/user-attachments/assets/7911158f-767c-4d2c-b105-18780f79ecd9" />


### 🧾 Expenses Page  
<img width="1920" height="1080" alt="Screenshot 2025-11-29 200855" src="https://github.com/user-attachments/assets/a3fb6b45-6a34-4f4e-8131-1d9e50993fb4" />

### 👤 Profile Page  
<img width="1920" height="1080" alt="Screenshot 2025-11-29 200832" src="https://github.com/user-attachments/assets/7c934e57-da8d-47b5-b71c-7972d2fb433e" />


## 📂 Project Structure
```
ExpenseTracker/
│
├── main.py
├── database.py
├── expense.db
├── models.py
├── routers/
│   ├── auth.py
│   ├── dashboard.py
│   ├── expenses.py
│   ├── profile.py
│
├── templates/
│ ├── base.html
│ ├── home.html
│ ├── login.html
│ ├── register.html
│ ├── dashboard.html
│ ├── expenses.html
│ ├── update.html
│ ├── profile.html
│
├── static/
│ ├── style.css
│ ├── home.css
│ └── logo.png
│
├── exports/
│ ├── expenses.csv
│ ├── expenses.xlsx
│ └── expenses.pdf
│
├── requirements.txt
└── README.md
```

## 🛠️ Installation

### 1️⃣ Clone project
```bash
git clone <your-repo-url>
cd ExpenseTracker
```

2️⃣ Install dependencies
```
pip install -r requirements.txt
```
3️⃣ Start server
```
uvicorn main:app --reload
```
Visit in browser:
```
http://127.0.0.1:8000
```

## ⚙ Tech Stack

- Python + FastAPI
- SQLite + SQLAlchemy
- Jinja2 Templates
- Bootstrap 5
- Chart.js
- Pandas, ReportLab

## 📦 Export Support

- CSV
- Excel
- PDF

## 🙌 Author
```
Botsa Raviteja
FastAPI Developer | Python | SQL | UI Design
```
📧 Gmail: botsaraviteja@gmail.com
🔗 GitHub: https://github.com/tejaravi8

🔗 LinkedIn: https://www.linkedin.com/in/ravitejabotsa
