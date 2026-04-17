import { useState } from "react";

function AddExpense({ refreshData }) {
  const [type, setType] = useState("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");

  const expenseCategories = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Other",
  ];

  const incomeCategories = [
    "Salary",
    "Freelance",
    "Business",
    "Other",
  ];

  const categories =
    type === "expense" ? expenseCategories : incomeCategories;

  const handleSubmit = () => {
    const finalCategory =
      category === "Other" ? customCategory : category;

    // ✅ Basic validation
    if (!title || !amount || !finalCategory) {
      alert("Please fill all required fields");
      return;
    }

    const token = localStorage.getItem("access");

    fetch("http://127.0.0.1:8000/api/expenses/", {
      method: "POST", // 🔥 FIXED
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // 🔐 AUTH
      },
      body: JSON.stringify({
        title,
        amount: parseFloat(amount) || 0,
        category: finalCategory,
        type,
        description,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add expense");
        }
        return res.json();
      })
      .then(() => {
        // ✅ Refresh list
        refreshData();

        // ✅ Reset form
        setTitle("");
        setAmount("");
        setCategory("");
        setCustomCategory("");
        setDescription("");
      })
      .catch((err) => {
        console.error(err);
        alert("Error adding expense");
      });
  };

  return (
    <div className="add-page">
      
      {/* LEFT */}
      <div className="form-section">
        <h1 className="page-title">Add Transaction</h1>
        <p className="page-sub">
          Record a new expense or income
        </p>

        <div className="form-card">

          {/* Type */}
          <label>Transaction Type</label>
          <div className="type-buttons">
            <button
              type="button"
              className={type === "expense" ? "active-expense" : ""}
              onClick={() => setType("expense")}
            >
              Expense
            </button>

            <button
              type="button"
              className={type === "income" ? "active-income" : ""}
              onClick={() => setType("income")}
            >
              Income
            </button>
          </div>

          {/* Title */}
          <label>Title</label>
          <input
            type="text"
            placeholder="e.g., Grocery Shopping"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Amount */}
          <label>Amount</label>
          <input
            type="number"
            placeholder="₹ 0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {/* Category */}
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setCustomCategory("");
            }}
          >
            <option value="">Select a category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Custom Category */}
          {category === "Other" && (
            <input
              type="text"
              placeholder="Enter custom category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
            />
          )}

          {/* Description */}
          <label>Description</label>
          <textarea
            placeholder="Add notes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Submit */}
          <button
            type="button"
            className={`submit-btn ${
              type === "income" ? "income-btn" : "expense-btn"
            }`}
            onClick={handleSubmit}
          >
            Add Transaction
          </button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="preview-section">
        <div className="preview-box">
          <h3>👁️ Preview</h3>

          <div className="preview-row">
            <span>Title</span>
            <p>{title || "—"}</p>
          </div>

          <div className="preview-row">
            <span>Amount</span>
            <p>₹{amount || 0}</p>
          </div>

          <div className="preview-row">
            <span>Type</span>
            <p>{type === "income" ? "Income" : "Expense"}</p>
          </div>

          <div className="preview-row">
            <span>Category</span>
            <p>
              {category === "Other"
                ? customCategory || "—"
                : category || "—"}
            </p>
          </div>

          <div className="preview-row">
            <span>Description</span>
            <p>{description || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddExpense;