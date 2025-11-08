import { simulateAgents } from "../lib/agents";

const results = simulateAgents("EURUSD", 520, "institutional", {
  baseCapital: 150000,
  riskMultiplier: 1.1,
  drawdownTarget: 0.1
});

console.log(
  results.map((result) => ({
    name: result.agent.name,
    annualized: result.metrics.annualizedReturn,
    drawdown: result.metrics.maxDrawdown,
    sharpe: result.metrics.sharpe
  }))
);
