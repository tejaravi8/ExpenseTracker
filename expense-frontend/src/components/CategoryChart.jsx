import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function CategoryChart({ expenses }) {
  const dataMap = {};

  expenses.forEach((item) => {
    if (item.type === "expense") {
      if (!dataMap[item.category]) {
        dataMap[item.category] = 0;
      }
      dataMap[item.category] += item.amount;
    }
  });

  const data = Object.keys(dataMap).map((key) => ({
    category: key,
    amount: dataMap[key],
  }));

  return (
    <div className="chart-box">
      <h3>Expenses by Category</h3>
      <p className="chart-sub">Breakdown of spending</p>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip
          cursor={false} 
  contentStyle={{
    backgroundColor: "#fff",
    borderRadius: "8px",
  }}
/>
          <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoryChart;