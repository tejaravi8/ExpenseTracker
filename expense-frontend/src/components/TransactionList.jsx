function TransactionList({ expenses }) {
  return (
    <div className="transactions">
      <h2>Recent Transactions</h2>

      {expenses.map((item) => (
        <div className="transaction" key={item.id}>
          <div className="left">
            <div className="icon">
              {item.type === "income" ? "📈" : "💳"}
            </div>

            <div>
              <p className="title">{item.title}</p>
              <p className="category">
                {item.category} • {item.date}
              </p>
            </div>
          </div>

          <div
            className="amount"
            style={{
              color: item.type === "income" ? "green" : "red",
            }}
          >
            {item.type === "income" ? "+" : "-"}₹{item.amount}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TransactionList;