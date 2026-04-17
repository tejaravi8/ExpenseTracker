function SummaryCards({ expenses }) {
  let income = 0;
  let expense = 0;

  expenses.forEach((item) => {
    if (item.type === "income") {
      income += item.amount;
    } else {
      expense += item.amount;
    }
  });

  const balance = income - expense;

  return (
    <div className="cards">
      <div className="card">
        <h3>Total Balance</h3>
        <h2>₹{balance}</h2>
        <p className="subtext">This month</p>
      </div>

      <div className="card">
        <h3>Total Income</h3>
        <h2 style={{ color: "green" }}>₹{income}</h2>
        <p className="subtext">This month</p>
      </div>

      <div className="card">
        <h3>Total Expenses</h3>
        <h2 style={{ color: "red" }}>₹{expense}</h2>
        <p className="subtext">This month</p>
      </div>
    </div>
  );
}

export default SummaryCards;