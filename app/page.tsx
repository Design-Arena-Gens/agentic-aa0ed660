"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ControlPanel } from "@/components/ControlPanel";
import { PerformanceChart } from "@/components/PerformanceChart";
import { MetricsTable } from "@/components/MetricsTable";
import { AgentInsights } from "@/components/AgentInsights";
import { optimizeAgentConfigs, simulateAgents } from "@/lib/agents";
import type { ForexPair, SimulationResult } from "@/lib/types";
import styles from "./page.module.css";

const DEFAULT_SEEDS = ["institutional", "macro_regime", "vol_compression", "dollar_cycle"];

export default function Home() {
  const [capital, setCapital] = useState(150000);
  const [pair, setPair] = useState<ForexPair>("EURUSD");
  const [riskMultiplier, setRiskMultiplier] = useState(1.1);
  const [drawdownTarget, setDrawdownTarget] = useState(0.1);
  const [length, setLength] = useState(520);
  const [seed, setSeed] = useState(DEFAULT_SEEDS[0]);

  const [optimizedResults, setOptimizedResults] = useState<SimulationResult[] | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const options = useMemo(
    () => ({
      baseCapital: capital,
      riskMultiplier,
      drawdownTarget
    }),
    [capital, riskMultiplier, drawdownTarget]
  );

  const baseResults = useMemo(
    () => simulateAgents(pair, length, seed, options),
    [pair, length, seed, options]
  );

  useEffect(() => {
    setOptimizedResults(null);
  }, [pair, length, seed, options]);

  const displayedResults = optimizedResults ?? baseResults;

  const leader = useMemo(
    () =>
      displayedResults.reduce(
        (best, item) => (item.metrics.riskScore > best.metrics.riskScore ? item : best),
        displayedResults[0]
      ),
    [displayedResults]
  );

  const blendedMetrics = useMemo(() => {
    const weights = displayedResults.map((result) => 1 / Math.max(0.08, result.metrics.maxDrawdown + 0.02));
    const weightSum = weights.reduce((acc, item) => acc + item, 0);
    const normalizedWeights = weights.map((value) => value / weightSum);
    const blendedReturn = displayedResults.reduce(
      (acc, result, index) => acc + result.metrics.annualizedReturn * normalizedWeights[index],
      0
    );
    const blendedDrawdown = displayedResults.reduce(
      (acc, result, index) => acc + result.metrics.maxDrawdown * normalizedWeights[index],
      0
    );
    const blendedSharpe = displayedResults.reduce(
      (acc, result, index) => acc + result.metrics.sharpe * normalizedWeights[index],
      0
    );
    return { blendedReturn, blendedDrawdown, blendedSharpe };
  }, [displayedResults]);

  const handleRandomSeed = useCallback(() => {
    const randomSeed = `${DEFAULT_SEEDS[Math.floor(Math.random() * DEFAULT_SEEDS.length)]}_${Math.floor(
      Math.random() * 10_000
    )}`;
    setSeed(randomSeed);
  }, []);

  const handleOptimize = useCallback(async () => {
    setIsOptimizing(true);
    await new Promise((resolve) => setTimeout(resolve, 25));
    const tuned = optimizeAgentConfigs(pair, length, seed, options, 36);
    setOptimizedResults(tuned);
    setIsOptimizing(false);
  }, [pair, length, seed, options]);

  return (
    <main className={styles.main}>
      <div className={styles.heroBlur} />
      <header className={styles.header}>
        <div>
          <span className={styles.badge}>Agency Command Center</span>
          <h1>Forex Alpha Agents</h1>
          <p>
            Deploy a collaborative pod of autonomous FX agents engineered to amplify return while aggressively
            suppressing drawdowns across shifting macro regimes.
          </p>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.optimizeButton}
            type="button"
            onClick={handleOptimize}
            disabled={isOptimizing}
          >
            {isOptimizing ? "Optimizing..." : optimizedResults ? "Re-run Optimizer" : "Optimize for Low Drawdown"}
          </button>
          {optimizedResults && <span className={styles.optimizationLabel}>Optimized risk budget deployed</span>}
        </div>
      </header>

      <ControlPanel
        capital={capital}
        onCapitalChange={setCapital}
        pair={pair}
        onPairChange={setPair}
        riskMultiplier={riskMultiplier}
        onRiskMultiplierChange={setRiskMultiplier}
        drawdownTarget={drawdownTarget}
        onDrawdownTargetChange={setDrawdownTarget}
        length={length}
        onLengthChange={setLength}
        seed={seed}
        onSeedChange={setSeed}
        onRefreshSeed={handleRandomSeed}
      />

      <AgentInsights leader={leader} overallMetrics={blendedMetrics} />

      <PerformanceChart results={displayedResults} />

      <MetricsTable results={displayedResults} />
    </main>
  );
}
