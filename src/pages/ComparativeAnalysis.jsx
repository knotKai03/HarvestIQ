import { useState, useEffect } from "react";

const API = "http://localhost:8000";

async function apiFetch(path) {
  const res = await fetch(API + path);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

const REGIONS = ["Northeast", "Northwest", "Central", "Southwest", "Southeast"];

function ComparativeAnalysis() {
  const [regionA, setRegionA]     = useState("Central");
  const [regionB, setRegionB]     = useState("Southwest");
  const [compData, setCompData]   = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [aiSummary, setAiSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (regionA && regionB && regionA !== regionB) {
      runComparison();
    }
  }, [regionA, regionB]);

  async function runComparison() {
    setLoading(true);
    setError(null);
    setAiSummary("");
    try {
      const data = await apiFetch(`/risk/compare/${regionA}/${regionB}`);
      setCompData(data);
      loadAiSummary(data);
    } catch (e) {
      setError("Could not load comparison. Is the API running?");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function loadAiSummary(data) {
    setAiLoading(true);
    try {
      const res = await fetch(`${API}/ai/explain`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          explanation_type: "comparison",
          region_data:      {},
          comparison_data:  data,
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

  const deltaSign  = (val) => val > 0 ? `+${val}` : `${val}`;
  const deltaColor = (val) => val > 0
    ? { color: "var(--risk-high, #C4522A)" }
    : val < 0
    ? { color: "var(--risk-low, #4A7A32)" }
    : {};

  return (
    <div className="page-container">
      <section className="content-section">
        <div className="section-heading left">
          <h3>Predictive Comparative Analysis</h3>
          <p>
            Compare two Kansas regions side by side using real 2026 risk data.
            Select a region from each dropdown to see how they compare.
          </p>
        </div>
      </section>

      <section className="content-section">
        <div className="comparison-controls">
          <div className="control-block">
            <label>Region A</label>
            <select value={regionA} onChange={(e) => setRegionA(e.target.value)}>
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="control-block">
            <label>Region B</label>
            <select value={regionB} onChange={(e) => setRegionB(e.target.value)}>
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
        {regionA === regionB && (
          <p style={{ color: "red", marginTop: "0.5rem" }}>
            Please select two different regions.
          </p>
        )}
      </section>

      {loading && (
        <section className="content-section">
          <p>Loading comparison...</p>
        </section>
      )}

      {error && (
        <section className="content-section">
          <p style={{ color: "red" }}>{error}</p>
        </section>
      )}

      {!loading && compData && (
        <>
          <section className="comparison-grid">
            <article className="comparison-card">
              <div className="comparison-card-top">
                <h3>{compData.region_a.name}</h3>
                <div className="comparison-score">
                  {compData.region_a.data.predicted_risk_score}
                </div>
              </div>
              <div className="comparison-stats">
                <div><strong>Risk Level:</strong> {compData.region_a.data.risk_level}</div>
                <div><strong>Regional Rank:</strong> {compData.region_a.data.region_rank} of 5</div>
                <div><strong>Rank Label:</strong> {compData.region_a.data.rank_label}</div>
              </div>
              <p>{compData.region_a.data.risk_info}</p>
            </article>

            <article className="comparison-card" style={{ textAlign: "center" }}>
              <h3>Δ Difference</h3>
              <div className="comparison-score" style={deltaColor(compData.delta)}>
                {deltaSign(compData.delta)}
              </div>
              <p style={{ marginTop: "1rem" }}>
                <strong>{compData.higher_risk_region}</strong> carries higher risk
              </p>
            </article>

            <article className="comparison-card">
              <div className="comparison-card-top">
                <h3>{compData.region_b.name}</h3>
                <div className="comparison-score">
                  {compData.region_b.data.predicted_risk_score}
                </div>
              </div>
              <div className="comparison-stats">
                <div><strong>Risk Level:</strong> {compData.region_b.data.risk_level}</div>
                <div><strong>Regional Rank:</strong> {compData.region_b.data.region_rank} of 5</div>
                <div><strong>Rank Label:</strong> {compData.region_b.data.rank_label}</div>
              </div>
              <p>{compData.region_b.data.risk_info}</p>
            </article>
          </section>

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