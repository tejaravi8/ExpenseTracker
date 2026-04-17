import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function MonthlyChart({ expenses }) {
  const dataMap = {};

  expenses.forEach((item) => {
    const month = new Date(item.date).toLocaleString("default", {
      month: "short",
    });

    if (!dataMap[month]) {
      dataMap[month] = { month, income: 0, expense: 0 };
    }

    if (item.type === "income") {
      dataMap[month].income += item.amount;
    } else {
      dataMap[month].expense += item.amount;
    }
  });

  const data = Object.values(dataMap);

  return (
    <div className="chart-box">
      <h3>Monthly Overview</h3>
      <p className="chart-sub">Income vs Expenses over time</p>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="income"
              stroke="green"
              strokeWidth={2}
              dot={{ r: 4 }}
            />

            <Line
                type="monotone"
                dataKey="expense"
                stroke="red"
                strokeWidth={2}
                dot={{ r: 4 }}
            />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyChart;