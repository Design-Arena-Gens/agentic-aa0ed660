import clsx from "clsx";
import styles from "./MetricsTable.module.css";
import type { SimulationResult } from "@/lib/types";

interface MetricsTableProps {
  results: SimulationResult[];
}

function formatPercent(value: number, digits = 1) {
  return `${(value * 100).toFixed(digits)}%`;
}

function formatNumber(value: number, digits = 1) {
  return value.toFixed(digits);
}

export function MetricsTable({ results }: MetricsTableProps) {
  if (results.length === 0) {
    return null;
  }

  const bestByReturn = [...results].sort(
    (a, b) => b.metrics.annualizedReturn - a.metrics.annualizedReturn
  )[0]?.agent.id;

  const bestByDrawdown = [...results].sort((a, b) => a.metrics.maxDrawdown - b.metrics.maxDrawdown)[0]?.agent.id;

  const bestRiskAdjusted = [...results].sort(
    (a, b) => b.metrics.riskScore - a.metrics.riskScore
  )[0]?.agent.id;

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2>Agent Risk &amp; Return Matrix</h2>
        <p>Risk score balances annualized return, realized drawdown, and volatility for capital preservation.</p>
      </header>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Agent</th>
              <th>Strategy</th>
              <th>Annualized Return</th>
              <th>Max Drawdown</th>
              <th>Sharpe</th>
              <th>Win Rate</th>
              <th>Profit Factor</th>
              <th>Risk Score</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.agent.id}>
                <td>
                  <div className={styles.agentName}>{result.agent.name}</div>
                  <div className={styles.meta}>{result.agent.archetypeLabel}</div>
                </td>
                <td className={styles.strategy}>{result.agent.description}</td>
                <td className={clsx(bestByReturn === result.agent.id && styles.highlight)}>
                  {formatPercent(result.metrics.annualizedReturn)}
                </td>
                <td className={clsx(bestByDrawdown === result.agent.id && styles.highlight)}>
                  {formatPercent(result.metrics.maxDrawdown, 2)}
                </td>
                <td>{formatNumber(result.metrics.sharpe, 2)}</td>
                <td>{formatPercent(result.metrics.winRate, 1)}</td>
                <td>{formatNumber(result.metrics.profitFactor, 2)}</td>
                <td className={clsx(bestRiskAdjusted === result.agent.id && styles.highlight)}>
                  {formatNumber(result.metrics.riskScore, 2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
