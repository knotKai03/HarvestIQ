import { useState } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [selectedRegion, setSelectedRegion] = useState("Northeast");
  const [compareRegionA, setCompareRegionA] = useState("Northeast");
  const [compareRegionB, setCompareRegionB] = useState("Northwest");

  const riskData = {
    Northeast: {
      totalScore: 72,
      landRisk: 60,
      weatherRisk: 80,
      marketRisk: 74,
      summary:
        "The Northeast region shows elevated total risk because weather volatility has remained high over recent years, while market pricing has also fluctuated.",
    },
    Northwest: {
      totalScore: 65,
      landRisk: 58,
      weatherRisk: 66,
      marketRisk: 69,
      summary:
        "The Northwest region has a more moderate overall risk profile with relatively stable land values and less severe weather and market volatility.",
    },
    Southeast: {
      totalScore: 78,
      landRisk: 64,
      weatherRisk: 84,
      marketRisk: 77,
      summary:
        "The Southeast region carries a higher risk score because of stronger weather-related instability and continued market price uncertainty.",
    },
    Southwest: {
      totalScore: 60,
      landRisk: 55,
      weatherRisk: 62,
      marketRisk: 61,
      summary:
        "The Southwest region shows a lower overall risk profile due to relatively stable land values, lower weather disruption, and less severe market price fluctuation.",
    },
    Central: {
      totalScore: 68,
      landRisk: 59,
      weatherRisk: 70,
      marketRisk: 71,
      summary:
        "The Central region presents a balanced but moderate risk profile. Weather and market conditions contribute most to its risk score, while land-related risk remains comparatively steady.",
    },
    Kansas: {
      totalScore: 70,
      landRisk: 61,
      weatherRisk: 75,
      marketRisk: 72,
      summary:
        "Statewide Kansas risk remains balanced overall, but weather continues to be the largest driver of uncertainty.",
    },
  };

  const regions = Object.keys(riskData);
  const current = riskData[selectedRegion];
  const regionA = riskData[compareRegionA];
  const regionB = riskData[compareRegionB];

  const compareMetric = (label, a, b) => {
    if (a < b) {
      return `${compareRegionA} is better than ${compareRegionB} in ${label.toLowerCase()} because its score is lower (${a} vs ${b}).`;
    }
    if (a > b) {
      return `${compareRegionA} is worse than ${compareRegionB} in ${label.toLowerCase()} because its score is higher (${a} vs ${b}).`;
    }
    return `${compareRegionA} and ${compareRegionB} are equal in ${label.toLowerCase()} with a score of ${a}.`;
  };

  const compareOverall = () => {
    if (regionA.totalScore < regionB.totalScore) {
      return `${compareRegionA} is better overall than ${compareRegionB} because it has a lower total risk score and appears more stable across combined categories.`;
    }
    if (regionA.totalScore > regionB.totalScore) {
      return `${compareRegionA} is worse overall than ${compareRegionB} because it has a higher total risk score and shows more instability across categories.`;
    }
    return `${compareRegionA} and ${compareRegionB} are equal overall based on the current total risk score.`;
  };

  return (
    <div className="page-section">
      <h1>Dashboard</h1>
      <p className="page-intro">
        View total regional risk, category-specific scores, and compare regions
        against one another.
      </p>

      <div className="region-buttons">
        {regions.map((region) => (
          <button
            key={region}
            className={selectedRegion === region ? "active-region" : ""}
            onClick={() => setSelectedRegion(region)}
          >
            {region}
          </button>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card large-card">
          <h2>{selectedRegion}</h2>
          <p className="big-score">{current.totalScore}</p>
          <p>{current.summary}</p>
        </div>

        <div className="side-panel">
          <div className="card metric-card total">
            <h3>Total Risk</h3>
            <p>{current.totalScore}</p>
          </div>

          <div className="card metric-card land">
            <h3>Land Risk</h3>
            <p>{current.landRisk}</p>
          </div>

          <div className="card metric-card weather">
            <h3>Weather Risk</h3>
            <p>{current.weatherRisk}</p>
          </div>

          <div className="card metric-card market">
            <h3>Market Risk</h3>
            <p>{current.marketRisk}</p>
          </div>
        </div>
      </div>

      <div className="compare-box">
        <h2>Compare Regions</h2>

        <div className="compare-controls">
          <select
            value={compareRegionA}
            onChange={(e) => setCompareRegionA(e.target.value)}
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>

          <select
            value={compareRegionB}
            onChange={(e) => setCompareRegionB(e.target.value)}
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <div className="comparison-results">
          <div className="card">
            <h3>Overall</h3>
            <p>{compareOverall()}</p>
          </div>

          <div className="card">
            <h3>Land</h3>
            <p>{compareMetric("Land Risk", regionA.landRisk, regionB.landRisk)}</p>
          </div>

          <div className="card">
            <h3>Weather</h3>
            <p>{compareMetric("Weather Risk", regionA.weatherRisk, regionB.weatherRisk)}</p>
          </div>

          <div className="card">
            <h3>Market</h3>
            <p>{compareMetric("Market Risk", regionA.marketRisk, regionB.marketRisk)}</p>
          </div>
        </div>
      </div>

      <div className="button-row">
        <Link to="/faq" className="main-button">
          Next: FAQ
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;