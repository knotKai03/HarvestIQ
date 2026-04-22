import { useState, useEffect } from "react";
import KansasMap from "../components/KansasMap";
import RiskTrendChart from "../components/RiskTrendChart";

const API = "harvest-iq-five.vercel.app";

const mockFactorData = {
  Northwest:  { market: 64, weather: 72, land: 55 },
  Northeast:  { market: 57, weather: 60, land: 62 },
  Central:    { market: 59, weather: 63, land: 58 },
  Southwest:  { market: 66, weather: 75, land: 51 },
  Southeast:  { market: 55, weather: 59, land: 60 },
};

async function apiFetch(path) {
  const res = await fetch(API + path);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

function Dashboard() {
  const [selectedRegion, setSelectedRegion] = useState("Central");
  const [regionData, setRegionData]         = useState(null);
  const [history, setHistory]               = useState([]);
  const [aiSummary, setAiSummary]           = useState("");
  const [aiLoading, setAiLoading]           = useState(false);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);

  useEffect(() => {
    async function loadRegion() {
      setLoading(true);
      setError(null);
      setAiSummary("");

      let currentData    = null;
      let currentHistory = [];

      try {
        const [riskRes, histRes] = await Promise.all([
          apiFetch(`/risk/${selectedRegion}`),
          apiFetch(`/risk/${selectedRegion}/history`),
        ]);
        currentData    = riskRes.current;
        currentHistory = histRes.history || [];
        setRegionData(currentData);
        setHistory(currentHistory);
      } catch (e) {
        setError("Could not load data. Is the API running?");
        console.error(e);
      } finally {
        setLoading(false);
      }

      if (currentData) {
        loadAiSummary(currentData, currentHistory);
      }
    }
    loadRegion();
  }, [selectedRegion]);

  async function loadAiSummary(data, hist) {
    setAiLoading(true);
    try {
      const res = await fetch(`${API}/ai/explain`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          explanation_type: "region",
          region_data:      data,
          history:          hist,
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

  const factors = mockFactorData[selectedRegion] || { market: 0, weather: 0, land: 0 };

  const highestContributor =
    factors.weather >= factors.market && factors.weather >= factors.land
      ? "Weather Risk"
      : factors.market >= factors.land
      ? "Market Risk"
      : "Land Risk";

  const chartData = history.map((item) => ({
    year:    item.year,
    total:   item.risk_score,
    market:  factors.market,
    weather: factors.weather,
    land:    factors.land,
  }));

  if (loading) return (
    <div className="page-container">
      <section className="content-section">
        <p>Loading {selectedRegion} data...</p>
      </section>
    </div>
  );

  if (error) return (
    <div className="page-container">
      <section className="content-section">
        <p style={{ color: "red" }}>{error}</p>
      </section>
    </div>
  );

  return (
    <div className="page-container">
      <section className="content-section">
        <div className="section-heading left">
          <h3>Historical Dashboard</h3>
          <p>
            This dashboard presents agricultural risk information for Kansas
            regions. Select a region to view its current risk profile.
          </p>
        </div>
      </section>

      <section className="dashboard-grid">
        <KansasMap
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
        />

        <div className="dashboard-side-card">
          <h3>Dashboard Summary</h3>
          <p>
            This section summarizes the current agricultural risk result
            for the selected Kansas region.
          </p>
          <div className="summary-list">
            <div className="summary-item">
              <strong>Selected Region:</strong> {selectedRegion}
            </div>
            <div className="summary-item">
              <strong>Composite Risk Score:</strong>{" "}
              {regionData?.predicted_risk_score ?? "—"}
            </div>
            <div className="summary-item">
              <strong>Risk Level:</strong> {regionData?.risk_level ?? "—"}
            </div>
            <div className="summary-item">
              <strong>Regional Rank:</strong>{" "}
              {regionData?.region_rank ?? "—"} of 5
            </div>
            <div className="summary-item">
              <strong>Rank Label:</strong> {regionData?.rank_label ?? "—"}
            </div>
            <div className="summary-item">
              <strong>Highest Contributor:</strong> {highestContributor}
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-main-card">
        <div className="dashboard-card-header">
          <div>
            <p className="mini-label">Selected Region</p>
            <h3>{selectedRegion}</h3>
          </div>
          <div className="score-badge">
            <span>{regionData?.predicted_risk_score ?? "—"}</span>
            <p>Risk Score</p>
          </div>
        </div>

        <p className="dashboard-description">
          {regionData?.risk_info ?? ""}
        </p>

        <div className="stat-grid">
          <div className="stat-card">
            <p>Market Risk</p>
            <h4>{factors.market}</h4>
          </div>
          <div className="stat-card">
            <p>Weather Risk</p>
            <h4>{factors.weather}</h4>
          </div>
          <div className="stat-card">
            <p>Land Risk</p>
            <h4>{factors.land}</h4>
          </div>
          <div className="stat-card">
            <p>Risk Level</p>
            <h4>{regionData?.risk_level ?? "—"}</h4>
          </div>
        </div>

        <div className="ai-summary-panel">
          <h4>⚡ AI Analysis</h4>
          {aiLoading
            ? <p>Analyzing with Claude...</p>
            : <p>{aiSummary || "Add Anthropic credits to enable AI summaries."}</p>
          }
        </div>
      </section>

      {chartData.length > 0 && <RiskTrendChart data={chartData} />}
    </div>
  );
}

export default Dashboard;