import { useMemo, useState } from "react";

const predictiveRiskData = {
  Northwest: [
    { year: 2025, market: 65, weather: 73, land: 56 },
    { year: 2026, market: 66, weather: 74, land: 57 },
    { year: 2027, market: 67, weather: 75, land: 58 },
    { year: 2028, market: 68, weather: 76, land: 59 },
    { year: 2029, market: 69, weather: 77, land: 60 },
    { year: 2030, market: 70, weather: 78, land: 61 },
  ],
  Northeast: [
    { year: 2025, market: 58, weather: 61, land: 63 },
    { year: 2026, market: 59, weather: 62, land: 64 },
    { year: 2027, market: 60, weather: 63, land: 65 },
    { year: 2028, market: 61, weather: 64, land: 66 },
    { year: 2029, market: 62, weather: 65, land: 67 },
    { year: 2030, market: 63, weather: 66, land: 68 },
  ],
  Central: [
    { year: 2025, market: 60, weather: 64, land: 59 },
    { year: 2026, market: 61, weather: 65, land: 60 },
    { year: 2027, market: 62, weather: 66, land: 61 },
    { year: 2028, market: 63, weather: 67, land: 62 },
    { year: 2029, market: 64, weather: 68, land: 63 },
    { year: 2030, market: 65, weather: 69, land: 64 },
  ],
  Southwest: [
    { year: 2025, market: 68, weather: 77, land: 52 },
    { year: 2026, market: 69, weather: 78, land: 53 },
    { year: 2027, market: 70, weather: 79, land: 54 },
    { year: 2028, market: 71, weather: 80, land: 55 },
    { year: 2029, market: 72, weather: 81, land: 56 },
    { year: 2030, market: 73, weather: 82, land: 57 },
  ],
  Southeast: [
    { year: 2025, market: 56, weather: 60, land: 61 },
    { year: 2026, market: 57, weather: 61, land: 62 },
    { year: 2027, market: 58, weather: 62, land: 63 },
    { year: 2028, market: 59, weather: 63, land: 64 },
    { year: 2029, market: 60, weather: 64, land: 65 },
    { year: 2030, market: 61, weather: 65, land: 66 },
  ],
};

const predictiveDescriptions = {
  Northwest:
    "The projected outlook suggests that Northwest Kansas may continue facing elevated weather-driven pressure because of drought exposure and climate instability.",
  Northeast:
    "The forecast suggests Northeast Kansas may remain more stable overall, though land-related pressure could continue increasing over time.",
  Central:
    "Central Kansas is projected to remain relatively balanced, though gradual increases across all three factors may still push total risk upward.",
  Southwest:
    "Southwest Kansas is projected to remain one of the highest-risk regions because of continued weather volatility, irrigation dependence, and market sensitivity.",
  Southeast:
    "Southeast Kansas is projected to remain comparatively moderate, although its total score may rise gradually as market and land pressure increase.",
};

function ComparativeAnalysis() {
  const regions = Object.keys(predictiveRiskData);
  const years = predictiveRiskData.Central.map((item) => item.year);

  const [regionA, setRegionA] = useState("Central");
  const [regionB, setRegionB] = useState("Southwest");
  const [selectedYear, setSelectedYear] = useState(2026);

  const getRegionYearData = (region, year) =>
    predictiveRiskData[region].find((item) => item.year === Number(year));

  const aData = getRegionYearData(regionA, selectedYear);
  const bData = getRegionYearData(regionB, selectedYear);

  const getTotalRisk = (data) =>
    Math.round(data.market * 0.4 + data.weather * 0.35 + data.land * 0.25);

  const aTotal = getTotalRisk(aData);
  const bTotal = getTotalRisk(bData);

  const comparisonSummary = useMemo(() => {
    const higherRegion = aTotal > bTotal ? regionA : regionB;
    const lowerRegion = aTotal > bTotal ? regionB : regionA;
    const difference = Math.abs(aTotal - bTotal);

    return `${higherRegion} is projected to have a higher predicted agricultural risk than ${lowerRegion} in ${selectedYear}, with an estimated difference of ${difference} points. This forecasted gap reflects expected differences in market pressure, weather instability, and land-related conditions across the two regions.`;
  }, [aTotal, bTotal, regionA, regionB, selectedYear]);

  return (
    <div className="page-container">
      <section className="content-section">
        <div className="section-heading left">
          <h3>Predictive Comparative Analysis</h3>
          <p>
            This page presents projected agricultural risk from 2025 through 2030.
            These values are predictive estimates intended to show what the model
            expects may happen in future years and should be interpreted separately
            from the historical dashboard data for 2014–2024.
          </p>
        </div>
      </section>

      <section className="content-section">
        <div className="comparison-controls">
          <div className="control-block">
            <label>Region A</label>
            <select value={regionA} onChange={(e) => setRegionA(e.target.value)}>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div className="control-block">
            <label>Region B</label>
            <select value={regionB} onChange={(e) => setRegionB(e.target.value)}>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div className="control-block">
            <label>Prediction Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="comparison-grid">
        <article className="comparison-card">
          <div className="comparison-card-top">
            <h3>{regionA}</h3>
            <div className="comparison-score">{aTotal}</div>
          </div>

          <div className="comparison-stats">
            <div><strong>Predicted Market Risk:</strong> {aData.market}</div>
            <div><strong>Predicted Weather Risk:</strong> {aData.weather}</div>
            <div><strong>Predicted Land Risk:</strong> {aData.land}</div>
          </div>

          <p>{predictiveDescriptions[regionA]}</p>
        </article>

        <article className="comparison-card">
          <div className="comparison-card-top">
            <h3>{regionB}</h3>
            <div className="comparison-score">{bTotal}</div>
          </div>

          <div className="comparison-stats">
            <div><strong>Predicted Market Risk:</strong> {bData.market}</div>
            <div><strong>Predicted Weather Risk:</strong> {bData.weather}</div>
            <div><strong>Predicted Land Risk:</strong> {bData.land}</div>
          </div>

          <p>{predictiveDescriptions[regionB]}</p>
        </article>
      </section>

      <section className="content-section">
        <div className="section-heading left">
          <h3>Predictive Insight</h3>
          <p>{comparisonSummary}</p>
        </div>
      </section>
    </div>
  );
}

export default ComparativeAnalysis;