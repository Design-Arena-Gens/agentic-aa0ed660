import { ChangeEvent } from "react";
import styles from "./ControlPanel.module.css";
import type { ForexPair } from "@/lib/types";

interface ControlPanelProps {
  capital: number;
  onCapitalChange: (value: number) => void;
  pair: ForexPair;
  onPairChange: (pair: ForexPair) => void;
  riskMultiplier: number;
  onRiskMultiplierChange: (value: number) => void;
  drawdownTarget: number;
  onDrawdownTargetChange: (value: number) => void;
  length: number;
  onLengthChange: (value: number) => void;
  seed: string;
  onSeedChange: (seed: string) => void;
  onRefreshSeed: () => void;
}

const FOREX_PAIRS: ForexPair[] = ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD"];

export function ControlPanel({
  capital,
  onCapitalChange,
  pair,
  onPairChange,
  riskMultiplier,
  onRiskMultiplierChange,
  drawdownTarget,
  onDrawdownTargetChange,
  length,
  onLengthChange,
  seed,
  onSeedChange,
  onRefreshSeed
}: ControlPanelProps) {
  const handleCapitalChange = (event: ChangeEvent<HTMLInputElement>) => {
    onCapitalChange(Number(event.target.value));
  };

  const handleRiskChange = (event: ChangeEvent<HTMLInputElement>) => {
    onRiskMultiplierChange(Number(event.target.value));
  };

  const handleDrawdownChange = (event: ChangeEvent<HTMLInputElement>) => {
    onDrawdownTargetChange(Number(event.target.value));
  };

  const handleLengthChange = (event: ChangeEvent<HTMLInputElement>) => {
    onLengthChange(Number(event.target.value));
  };

  return (
    <section className={styles.panel}>
      <header className={styles.header}>
        <div>
          <h2>Market Scenario Designer</h2>
          <p>Adjust capital, market regime, and risk appetite to stress-test the agents.</p>
        </div>
        <button className={styles.refreshButton} type="button" onClick={onRefreshSeed}>
          Randomize Market
        </button>
      </header>
      <div className={styles.grid}>
        <label className={styles.field}>
          <span>Initial Capital (USD)</span>
          <input
            type="number"
            min={25000}
            max={500000}
            step={5000}
            value={capital}
            onChange={handleCapitalChange}
          />
        </label>

        <label className={styles.field}>
          <span>Forex Pair</span>
          <select value={pair} onChange={(event) => onPairChange(event.target.value as ForexPair)}>
            {FOREX_PAIRS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Risk Multiplier</span>
          <input
            type="number"
            min={0.4}
            max={2.5}
            step={0.1}
            value={riskMultiplier}
            onChange={handleRiskChange}
          />
        </label>

        <label className={styles.field}>
          <span>Drawdown Target</span>
          <input
            type="number"
            min={0.03}
            max={0.25}
            step={0.01}
            value={drawdownTarget}
            onChange={handleDrawdownChange}
          />
        </label>

        <label className={styles.field}>
          <span>Trading Days</span>
          <input
            type="number"
            min={200}
            max={1200}
            step={20}
            value={length}
            onChange={handleLengthChange}
          />
        </label>

        <label className={styles.field}>
          <span>Scenario Seed</span>
          <input value={seed} onChange={(event) => onSeedChange(event.target.value)} />
        </label>
      </div>
    </section>
  );
}
