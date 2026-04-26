import { useEffect, useState } from "react";

// ── API connection ─────────────────────────────────────────────────────────────
const API = "https://harvestiq-productionapp.up.railway.app";

async function apiFetch(path) {
  const res = await fetch(API + path);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

const REGIONS      = ["Northeast", "Northwest", "Central", "Southwest", "Southeast"];
const FUTURE_YEARS = [2025, 2026, 2027, 2028, 2029, 2030];

function ComparativeAnalysis() {
  const [selectedState, setSelectedState] = useState("Kansas");
  const [regionA,       setRegionA]       = useState("Central");
  const [regionB,       setRegionB]       = useState("Southwest");
  const [selectedYear,  setSelectedYear]  = useState(2025);

  // ── Live data state ──────────────────────────────────────────────────────────
  const [dataA,      setDataA]      = useState(null);
  const [dataB,      setDataB]      = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [aiSummary,  setAiSummary]  = useState("");
  const [aiLoading,  setAiLoading]  = useState(false);

  // ── Reset when state changes ─────────────────────────────────────────────────
  useEffect(() => {
    setRegionA("Central");
    setRegionB("Southwest");
    setSelectedYear(2025);
    setDataA(null);
    setDataB(null);
    setAiSummary("");
  }, [selectedState]);

  // ── Auto-run comparison when any selector changes ────────────────────────────
  useEffect(() => {
    if (regionA && regionB && regionA !== regionB) {
      runComparison();
    }
  }, [regionA, regionB, selectedYear, selectedState]);

  async function runComparison() {
    setLoading(true);
    setError(null);
    setAiSummary("");

    try {
      const state = selectedState.toLowerCase();
      const [resA, resB] = await Promise.all([
        apiFetch(`/future/${state}/${regionA}/${selectedYear}`),
        apiFetch(`/future/${state}/${regionB}/${selectedYear}`),
      ]);
      setDataA(resA.data);
      setDataB(resB.data);
      loadAiSummary(resA.data, resB.data);
    } catch (e) {
      setError("Could not load comparison. Is the API running?");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function loadAiSummary(dA, dB) {
    if (!dA || !dB) return;
    setAiLoading(true);
    try {
      const delta = Math.round((dA.total_risk_score - dB.total_risk_score) * 100) / 100;
      const res = await fetch(`${API}/ai/explain`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          explanation_type: "comparison",
          region_data:      {},
          comparison_data: {
            region_a: {
              name: regionA,
              data: {
                predicted_risk_score: dA.total_risk_score,
                risk_level:           dA.total_risk_level,
                rank_label:           `Rank ${dA.total_risk_rank}`,
                region_rank:          dA.total_risk_rank,
                risk_info:            `Market: ${dA.market_risk_score} | Weather: ${dA.weather_risk_score} | Land: ${dA.land_risk_score}`,
              }
            },
            region_b: {
              name: regionB,
              data: {
                predicted_risk_score: dB.total_risk_score,
                risk_level:           dB.total_risk_level,
                rank_label:           `Rank ${dB.total_risk_rank}`,
                region_rank:          dB.total_risk_rank,
                risk_info:            `Market: ${dB.market_risk_score} | Weather: ${dB.weather_risk_score} | Land: ${dB.land_risk_score}`,
              }
            },
            delta,
            higher_risk_region: dA.total_risk_score > dB.total_risk_score ? regionA : regionB,
          }
        }),
      });
      const json = await res.json();
      setAiSummary(json.explanation || "");
    } catch (e) {
      setAiSummary("AI summary unavailable.");
    } finally {
      setAiLoading(false);
    }
  }

  const delta = dataA && dataB
    ? Math.round((dataA.total_risk_score - dataB.total_risk_score) * 100) / 100
    : null;

  const higherRisk = delta > 0 ? regionA : delta < 0 ? regionB : "equal";

  return (
    <div className="page-container">
      <section className="content-section">
        <div className="section-heading left">
          <h3>Predictive Comparative Analysis</h3>
          <p>
            Compare two regions side by side using predicted risk data from 2025 to 2030.
            Select a state, two regions, and a prediction year.
          </p>
        </div>

        {/* Controls */}
        <div className="comparison-controls">
          <div className="control-block">
            <label>State</label>
            <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
              <option value="Kansas">Kansas</option>
              <option value="Iowa">Iowa</option>
            </select>
          </div>

          <div className="control-block">
            <label>Prediction Year</label>
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
              {FUTURE_YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="control-block">
            <label>Region A</label>
            <select value={regionA} onChange={(e) => setRegionA(e.target.value)}>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div className="comparison-controls comparison-controls-secondary">
          <div className="control-block">
            <label>Region B</label>
            <select value={regionB} onChange={(e) => setRegionB(e.target.value)}>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        {regionA === regionB && (
          <p style={{ color: "red", marginTop: "0.5rem" }}>
            Please select two different regions.
          </p>
        )}
      </section>

      {/* Loading / error */}
      {loading && (
        <section className="content-section">
          <p>Loading {selectedYear} comparison...</p>
        </section>
      )}

      {error && (
        <section className="content-section">
          <p style={{ color: "red" }}>{error}</p>
        </section>
      )}

      {/* Comparison results */}
      {!loading && dataA && dataB && (
        <>
          <section className="comparison-grid">
            <article className="comparison-card">
              <div className="comparison-card-top">
                <h3>{regionA}, {selectedState}</h3>
                <div className="comparison-score">
                  {Math.round(dataA.total_risk_score * 10) / 10}
                </div>
              </div>
              <div className="comparison-stats">
                <div><strong>Risk Level:</strong> {dataA.total_risk_level}</div>
                <div><strong>Regional Rank:</strong> {dataA.total_risk_rank} of 5</div>
                <div><strong>Market Risk:</strong> {Math.round(dataA.market_risk_score * 10) / 10}</div>
                <div><strong>Weather Risk:</strong> {Math.round(dataA.weather_risk_score * 10) / 10}</div>
                <div><strong>Land Risk:</strong> {Math.round(dataA.land_risk_score * 10) / 10}</div>
              </div>
            </article>

            <article className="comparison-card">
              <div className="comparison-card-top">
                <h3>{regionB}, {selectedState}</h3>
                <div className="comparison-score">
                  {Math.round(dataB.total_risk_score * 10) / 10}
                </div>
              </div>
              <div className="comparison-stats">
                <div><strong>Risk Level:</strong> {dataB.total_risk_level}</div>
                <div><strong>Regional Rank:</strong> {dataB.total_risk_rank} of 5</div>
                <div><strong>Market Risk:</strong> {Math.round(dataB.market_risk_score * 10) / 10}</div>
                <div><strong>Weather Risk:</strong> {Math.round(dataB.weather_risk_score * 10) / 10}</div>
                <div><strong>Land Risk:</strong> {Math.round(dataB.land_risk_score * 10) / 10}</div>
              </div>
            </article>
          </section>

          {/* Predictive insight */}
          <section className="content-section">
            <div className="section-heading left">
              <h3>Predictive Insight</h3>
              <p>
                {higherRisk === "equal"
                  ? `${regionA} and ${regionB} carry equal projected risk in ${selectedYear}.`
                  : `${higherRisk}, ${selectedState} carries higher projected risk in ${selectedYear} with a score difference of ${Math.abs(delta)} points.`
                }
              </p>
            </div>
          </section>

          {/* AI Summary */}
          <section className="content-section">
            <div className="section-heading left">
              <h3>⚡ AI Comparison Summary</h3>
              {aiLoading
                ? <p>Analyzing with Claude...</p>
                : <p>{aiSummary || "Add Anthropic credits to enable AI summaries."}</p>
              }
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default ComparativeAnalysis;
