import { useEffect, useMemo, useState } from "react";

// ── API connection ─────────────────────────────────────────────────────────────
const API = "https://harvestiq-production.up.railway.app";

async function apiFetch(path) {
  const res = await fetch(API + path);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// ── Iowa mock data (real data coming soon) ────────────────────────────────────
const iowaRiskData = {
  Northwest: { market: 59, weather: 61, land: 68 },
  Northeast: { market: 56, weather: 60, land: 71 },
  Central:   { market: 57, weather: 60, land: 70 },
  Southwest: { market: 60, weather: 62, land: 67 },
  Southeast: { market: 56, weather: 61, land: 69 },
};

const iowaDescriptions = {
  Northwest:  "Northwest Iowa is projected to remain relatively stable, with land-related pressure continuing to shape much of the overall predicted score.",
  Northeast:  "Northeast Iowa is expected to maintain moderate projected risk, though strong land values and gradual market shifts may increase future totals.",
  Central:    "Central Iowa is projected to remain balanced, with slow upward movement across market, weather, and land conditions.",
  Southwest:  "Southwest Iowa may experience moderate increases in predicted risk, driven by steady changes in both market and land-related conditions.",
  Southeast:  "Southeast Iowa is projected to remain moderately stable, with gradual forecast growth in both weather and land-related pressure.",
};

const REGIONS = ["Northeast", "Northwest", "Central", "Southwest", "Southeast"];

function ComparativeAnalysis() {
  const [selectedState, setSelectedState] = useState("Kansas");
  const [regionA, setRegionA]             = useState("Central");
  const [regionB, setRegionB]             = useState("Southwest");

  // ── Live API state (Kansas) ──────────────────────────────────────────────────
  const [compData,   setCompData]   = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [aiSummary,  setAiSummary]  = useState("");
  const [aiLoading,  setAiLoading]  = useState(false);

  // ── Reset when state changes ───────────────────────────────────────────────
  useEffect(() => {
    setRegionA("Central");
    setRegionB("Southwest");
    setCompData(null);
    setAiSummary("");
  }, [selectedState]);

  // ── Auto-run comparison when regions change ────────────────────────────────
  useEffect(() => {
    if (regionA && regionB && regionA !== regionB) {
      runComparison();
    }
  }, [regionA, regionB, selectedState]);

  async function runComparison() {
    if (selectedState === "Iowa") {
      // Iowa uses mock data until Snowflake data is ready
      setCompData({ type: "iowa", regionA, regionB });
      setAiSummary("");
      return;
    }

    setLoading(true);
    setError(null);
    setAiSummary("");

    try {
      const data = await apiFetch(`/risk/compare/${regionA}/${regionB}`);
      setCompData({ type: "kansas", ...data });
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

  // ── Iowa mock score calculation ────────────────────────────────────────────
  const iowaTotal = (region) => {
    const d = iowaRiskData[region];
    return Math.round(d.market * 0.4 + d.weather * 0.35 + d.land * 0.25);
  };

  const comparisonSummary = useMemo(() => {
    if (selectedState === "Iowa") {
      const aTotal = iowaTotal(regionA);
      const bTotal = iowaTotal(regionB);
      const higher = aTotal > bTotal ? regionA : regionB;
      const lower  = aTotal > bTotal ? regionB : regionA;
      const diff   = Math.abs(aTotal - bTotal);
      return `${higher}, Iowa is projected to have a higher predicted agricultural risk than ${lower}, Iowa with an estimated difference of ${diff} points.`;
    }
    if (compData?.type === "kansas") {
      const delta  = compData.delta;
      const higher = compData.higher_risk_region;
      return `${higher} Kansas carries more risk with a score difference of ${Math.abs(delta)} points between the two regions.`;
    }
    return "";
  }, [compData, regionA, regionB, selectedState]);

  return (
    <div className="page-container">
      <section className="content-section">
        <div className="section-heading left">
          <h3>Predictive Comparative Analysis</h3>
          <p>
            Compare two regions side by side. Kansas shows live 2026 data from
            Snowflake. Iowa shows projected estimates — live data coming soon.
          </p>
        </div>

        {/* Controls */}
        <div className="comparison-controls">
          <div className="control-block">
            <label>State</label>
            <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
              <option value="Kansas">Kansas</option>
              <option value="Iowa">Iowa (Projected)</option>
            </select>
          </div>

          <div className="control-block">
            <label>Region A</label>
            <select value={regionA} onChange={(e) => setRegionA(e.target.value)}>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

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
          <p>Loading comparison...</p>
        </section>
      )}

      {error && (
        <section className="content-section">
          <p style={{ color: "red" }}>{error}</p>
        </section>
      )}

      {/* Kansas live comparison */}
      {!loading && compData?.type === "kansas" && (
        <section className="comparison-grid">
          <article className="comparison-card">
            <div className="comparison-card-top">
              <h3>{compData.region_a.name}, Kansas</h3>
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

          <article className="comparison-card">
            <div className="comparison-card-top">
              <h3>{compData.region_b.name}, Kansas</h3>
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
      )}

      {/* Iowa mock comparison */}
      {!loading && compData?.type === "iowa" && (
        <section className="comparison-grid">
          <article className="comparison-card">
            <div className="comparison-card-top">
              <h3>{regionA}, Iowa</h3>
              <div className="comparison-score">{iowaTotal(regionA)}</div>
            </div>
            <div className="comparison-stats">
              <div><strong>Predicted Market Risk:</strong> {iowaRiskData[regionA].market}</div>
              <div><strong>Predicted Weather Risk:</strong> {iowaRiskData[regionA].weather}</div>
              <div><strong>Predicted Land Risk:</strong> {iowaRiskData[regionA].land}</div>
            </div>
            <p>{iowaDescriptions[regionA]}</p>
          </article>

          <article className="comparison-card">
            <div className="comparison-card-top">
              <h3>{regionB}, Iowa</h3>
              <div className="comparison-score">{iowaTotal(regionB)}</div>
            </div>
            <div className="comparison-stats">
              <div><strong>Predicted Market Risk:</strong> {iowaRiskData[regionB].market}</div>
              <div><strong>Predicted Weather Risk:</strong> {iowaRiskData[regionB].weather}</div>
              <div><strong>Predicted Land Risk:</strong> {iowaRiskData[regionB].land}</div>
            </div>
            <p>{iowaDescriptions[regionB]}</p>
          </article>
        </section>
      )}

      {/* Predictive insight */}
      {comparisonSummary && (
        <section className="content-section">
          <div className="section-heading left">
            <h3>Predictive Insight</h3>
            <p>{comparisonSummary}</p>
          </div>
        </section>
      )}

      {/* AI Summary — Kansas only */}
      {selectedState === "Kansas" && (
        <section className="content-section">
          <div className="section-heading left">
            <h3>⚡ AI Comparison Summary</h3>
            {aiLoading
              ? <p>Analyzing with Claude...</p>
              : <p>{aiSummary || "Add Anthropic credits to enable AI summaries."}</p>
            }
          </div>
        </section>
      )}
    </div>
  );
}

export default ComparativeAnalysis;
