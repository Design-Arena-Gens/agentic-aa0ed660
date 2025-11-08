import styles from "./AgentInsights.module.css";
import type { SimulationResult } from "@/lib/types";

interface AgentInsightsProps {
  leader: SimulationResult;
  overallMetrics: {
    blendedReturn: number;
    blendedDrawdown: number;
    blendedSharpe: number;
  };
}

function formatPercent(value: number, digits = 1) {
  return `${(value * 100).toFixed(digits)}%`;
}

export function AgentInsights({ leader, overallMetrics }: AgentInsightsProps) {
  return (
    <section className={styles.card}>
      <div className={styles.content}>
        <div>
          <span className={styles.pill}>Optimal Profile</span>
          <h2>{leader.agent.name}</h2>
          <p className={styles.subtitle}>{leader.agent.positioning}</p>
          <p className={styles.description}>{leader.agent.description}</p>
        </div>
        <div className={styles.metrics}>
          <div>
            <span className={styles.label}>Annualized Return</span>
            <strong>{formatPercent(leader.metrics.annualizedReturn)}</strong>
          </div>
          <div>
            <span className={styles.label}>Max Drawdown</span>
            <strong>{formatPercent(leader.metrics.maxDrawdown, 2)}</strong>
          </div>
          <div>
            <span className={styles.label}>Sharpe Ratio</span>
            <strong>{leader.metrics.sharpe.toFixed(2)}</strong>
          </div>
        </div>
      </div>
      <div className={styles.divider} />
      <footer className={styles.footer}>
        <div>
          <span className={styles.label}>Blended Portfolio Return</span>
          <strong>{formatPercent(overallMetrics.blendedReturn)}</strong>
        </div>
        <div>
          <span className={styles.label}>Blended Drawdown</span>
          <strong>{formatPercent(overallMetrics.blendedDrawdown, 2)}</strong>
        </div>
        <div>
          <span className={styles.label}>Blended Sharpe</span>
          <strong>{overallMetrics.blendedSharpe.toFixed(2)}</strong>
        </div>
      </footer>
    </section>
  );
}
