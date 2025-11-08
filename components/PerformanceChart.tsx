import { ResponsiveContainer, LineChart, Line, Tooltip, CartesianGrid, YAxis, XAxis, Legend } from "recharts";
import styles from "./PerformanceChart.module.css";
import type { SimulationResult } from "@/lib/types";

interface PerformanceChartProps {
  results: SimulationResult[];
}

function formatCurrency(value: number) {
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function PerformanceChart({ results }: PerformanceChartProps) {
  if (results.length === 0) {
    return null;
  }

  const chartData = results[0].equityCurve.map((point, index) => {
    const row: Record<string, number | string> = { index: point.index, label: point.label };
    results.forEach((result) => {
      row[result.agent.name] = result.equityCurve[index]?.equity ?? 0;
    });
    return row;
  });

  const colors = ["#4da8f3", "#a855f7", "#f97316", "#2ecc71", "#ec4899"];

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2>Equity Curve Comparison</h2>
        <p>Agent allocations are normalized to highlight risk-adjusted compounding under the chosen market regime.</p>
      </header>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={360}>
          <LineChart data={chartData} margin={{ top: 20, left: 8, right: 8 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              minTickGap={24}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              width={90}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(10, 15, 35, 0.85)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                color: "#fff"
              }}
              formatter={(value: number, name: string) => [formatCurrency(value), name]}
              labelFormatter={(label) => `Day ${label}`}
            />
            <Legend wrapperStyle={{ color: "#fff" }} />
            {results.map((result, index) => (
              <Line
                key={result.agent.id}
                type="monotone"
                dataKey={result.agent.name}
                stroke={colors[index % colors.length]}
                strokeWidth={2.2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
