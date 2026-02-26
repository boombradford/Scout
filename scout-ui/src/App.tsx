import { CheckStepper } from "./components/CheckStepper";
import { useCheckSimulation } from "./useCheckSimulation";
import "./App.css";

function App() {
  const { steps, isRunning, run, reset } = useCheckSimulation();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Scout</h1>
        <p className="subtitle">CI Check Runner</p>
      </header>

      <main className="app-main">
        <CheckStepper steps={steps} title="PR Checks" />

        <div className="controls">
          <button className="btn btn-primary" onClick={run} disabled={isRunning}>
            {isRunning ? "Running..." : "Run Checks"}
          </button>
          <button className="btn btn-secondary" onClick={reset} disabled={isRunning}>
            Reset
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
