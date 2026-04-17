import { useState } from "react";

function SplitBill() {
  const [billTitle, setBillTitle] = useState("");
  const [splitType, setSplitType] = useState("equal");

  const [people, setPeople] = useState([
    { name: "Person 1", paid: 0, share: 0 },
    { name: "Person 2", paid: 0, share: 0 },
  ]);

  // 🔹 TOTAL PAID
  const totalPaid = people.reduce((sum, p) => sum + p.paid, 0);

  // 🔹 TOTAL SHARE (for custom validation)
  const totalShare = people.reduce((sum, p) => sum + p.share, 0);

  // 🔹 PER PERSON (equal mode)
  const perPerson =
    splitType === "equal"
      ? people.length > 0
        ? totalPaid / people.length
        : 0
      : 0;

  // 🔹 BREAKDOWN
  const breakdown = people.map((p) => {
    const share = splitType === "equal" ? perPerson : p.share;

    return {
      name: p.name,
      paid: p.paid,
      share: share,
      balance: p.paid - share,
    };
  });

  // 🔹 SETTLEMENT LOGIC
  const settlements = [];

  const creditors = breakdown
    .filter((p) => p.balance > 0)
    .map((p) => ({ ...p }));

  const debtors = breakdown
    .filter((p) => p.balance < 0)
    .map((p) => ({ ...p }));

  debtors.forEach((debtor) => {
    let debt = Math.abs(debtor.balance);

    creditors.forEach((creditor) => {
      if (debt === 0) return;

      if (creditor.balance > 0) {
        let amount = Math.min(debt, creditor.balance);

        settlements.push({
          from: debtor.name,
          to: creditor.name,
          amount,
        });

        creditor.balance -= amount;
        debt -= amount;
      }
    });
  });

  return (
    <div className="split-layout">
      {/* LEFT SIDE */}
      <div className="split-container">
        <h2>Bill Splitter</h2>

        {/* Bill Title */}
        <input
          type="text"
          placeholder="Enter bill title"
          value={billTitle}
          onChange={(e) => setBillTitle(e.target.value)}
        />

        {/* Split Type */}
        <div className="split-buttons">
          <button
            type="button"
            className={splitType === "equal" ? "active" : ""}
            onClick={() => setSplitType("equal")}
          >
            Equal Split
          </button>

          <button
            type="button"
            className={splitType === "custom" ? "active" : ""}
            onClick={() => setSplitType("custom")}
          >
            Custom Amount
          </button>
        </div>

        <h3>People & Payments</h3>
    <div className="table-header">
  <span>Name</span>
  <span>Paid</span>
  {splitType === "custom" && <span>Share</span>}
  <span></span> {/* for delete icon */}
</div>
        {/* People List */}
       {people.map((person, index) => (
  <div key={index} className="person-row">
    {/* Name */}
    <input
      type="text"
      value={person.name}
      onChange={(e) => {
        const updated = [...people];
        updated[index].name = e.target.value;
        setPeople(updated);
      }}
    />

    {/* Paid */}
    <input
      type="number"
      value={person.paid}
      onChange={(e) => {
        const updated = [...people];
        updated[index].paid = 0 || parseFloat(e.target.value) ;
        setPeople(updated);
      }}
    />

    {/* Share */}
    {splitType === "custom" && (
      <input
        type="number"
        value={person.share}
        onChange={(e) => {
          const updated = [...people];
          updated[index].share = parseFloat(e.target.value) || 0;
          setPeople(updated);
        }}
      />
    )}

    {/* 🔥 DELETE BUTTON */}
    <button
      type="button"
      className="delete-btn"
      onClick={() => {
        const updated = people.filter((_, i) => i !== index);
        setPeople(updated);
      }}
    >
      🗑️
    </button>
  </div>
))}

        {/* Add Person */}
        <button className="butt"
          type="button"
          onClick={() =>
            setPeople([
              ...people,
              { name: "New Person", paid: 0, share: 0 },
            ])
          }
        >
          + Add Person
        </button>

        {/* ⚠️ Validation */}
        {splitType === "custom" && totalShare !== totalPaid && (
          <p style={{ color: "red" }}>
            Total share must equal total paid!
          </p>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="summary-section">
        {/* Summary */}
        <div className="summary-box">
          <h3>Summary</h3>
          <p>Total Paid: ₹{totalPaid}</p>
          <p>People: {people.length}</p>
          <p>
            Per Person: ₹
            {splitType === "equal"
              ? perPerson.toFixed(2)
              : "Custom"}
          </p>
        </div>

        {/* Settlements */}
        <div className="summary-box">
          <h3>Settlements</h3>

          {settlements.length === 0 && <p>No settlements</p>}

          {settlements.map((s, index) => (
            <p key={index}>
              {s.from} → {s.to} ₹{s.amount.toFixed(2)}
            </p>
          ))}
        </div>

        {/* Breakdown */}
        <div className="summary-box">
          <h3>Individual Breakdown</h3>

          {breakdown.map((p, index) => (
            <div key={index} className="breakdown-item">
              <p><b>{p.name}</b></p>
              <p>Paid: ₹{p.paid}</p>
              <p>Share: ₹{p.share.toFixed(2)}</p>
              <p
                style={{
                  color: p.balance >= 0 ? "green" : "red",
                }}
              >
                Balance: ₹{p.balance.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SplitBill;