import Navbar from "./components/Navbar";
import SummaryCards from "./components/SummaryCards";
import TransactionList from "./components/TransactionList";
import AddExpense from "./components/AddExpense";
import SplitBill from "./components/SplitBill";
import MonthlyChart from "./components/MonthlyChart";
import CategoryChart from "./components/CategoryChart";
import Login from "./components/login";
import Signup from "./components/Signup";

import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access")
  );

  const fetchExpenses = () => {
    const token = localStorage.getItem("access");

    fetch("http://127.0.0.1:8000/api/expenses/", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("access");
          setIsAuthenticated(false);
        }
        return res.json();
      })
      .then((data) => setExpenses(data));
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchExpenses();
    }
  }, [isAuthenticated]);

  return (
    <div>
      {isAuthenticated && <Navbar />}

      <Routes>
        {/* 🔐 Public Routes */}
        {!isAuthenticated && (
          <>
            <Route
              path="/login"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />

            {/* 🔥 UPDATED HERE */}
            <Route
              path="/signup"
              element={<Signup setIsAuthenticated={setIsAuthenticated} />}
            />

            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}

        {/* 🔒 Private Routes */}
        {isAuthenticated && (
          <>
            <Route
              path="/"
              element={
                <div className="dashboard">
                  <h1 className="dashboard-title">Dashboard</h1>

                  <SummaryCards expenses={expenses} />

                  <div className="charts">
                    <MonthlyChart expenses={expenses} />
                    <CategoryChart expenses={expenses} />
                  </div>

                  <TransactionList expenses={expenses} />
                </div>
              }
            />

            <Route
              path="/add"
              element={<AddExpense refreshData={fetchExpenses} />}
            />

            <Route path="/split" element={<SplitBill />} />

            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;