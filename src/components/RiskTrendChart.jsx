import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

function RiskTrendChart({ data }) {
  return (
    <div className="chart-card">
      <div className="section-heading left">
        <h3>Historical Trend Analysis</h3>
        <p>
          This chart displays the historical trend of market, weather, land, and
          total agricultural risk from 2014 through 2024.
        </p>
      </div>

      <ResponsiveContainer width="100%" height={420}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="market" stroke="#2f6b3d" strokeWidth={3} />
          <Line type="monotone" dataKey="weather" stroke="#648f3d" strokeWidth={3} />
          <Line type="monotone" dataKey="land" stroke="#9a6a3a" strokeWidth={3} />
          <Line type="monotone" dataKey="total" stroke="#1f2f46" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RiskTrendChart;