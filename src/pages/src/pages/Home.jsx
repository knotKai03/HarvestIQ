import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page-container">
      <section className="hero-panel">
        <div className="hero-content">
          <span className="hero-tag">Kansas Pilot Platform</span>
          <h2>Smarter Agricultural Risk Monitoring for Kansas Regions</h2>
          <p>
            HarvestIQ is an AI-driven agricultural risk intelligence platform
            designed to present agricultural risk in a clear, professional, and
            decision-friendly format. The platform combines market, weather, and
            land-based indicators to help users better understand regional
            agricultural pressure across Kansas.
          </p>

          <div className="hero-actions">
            <Link to="/dashboard" className="primary-btn">
              View Dashboard
            </Link>
            <Link to="/comparative-analysis" className="secondary-btn">
              Comparative Analysis
            </Link>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <h3>Platform Purpose</h3>
          <p>
            The purpose of HarvestIQ is to organize agricultural data into a
            readable intelligence platform that allows users to review regional
            risk levels, compare Kansas regions, and understand long-term trends.
          </p>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <h4>Risk Visibility</h4>
            <p>
              Display total risk along with the individual contribution of market,
              weather, and land-related risk factors.
            </p>
          </article>

          <article className="feature-card">
            <h4>Historical Trend Review</h4>
            <p>
              Examine agricultural risk movement from 2014–2024 using a clean,
              professional trend visualization.
            </p>
          </article>

          <article className="feature-card">
            <h4>Regional Comparison</h4>
            <p>
              Compare Kansas regions side by side to identify which areas show
              higher or lower agricultural risk and why.
            </p>
          </article>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <h3>Risk Score Method</h3>
          <p>
            Total agricultural risk is calculated through a weighted model that
            combines three primary categories.
          </p>
        </div>

        <div className="weights-grid">
          <div className="weight-card">
            <span className="weight-value">40%</span>
            <h4>Market Risk</h4>
            <p>Commodity price movement and broader agricultural market pressure.</p>
          </div>

          <div className="weight-card">
            <span className="weight-value">35%</span>
            <h4>Weather Risk</h4>
            <p>Climate variability, drought pressure, and environmental instability.</p>
          </div>

          <div className="weight-card">
            <span className="weight-value">25%</span>
            <h4>Land Risk</h4>
            <p>Land value changes and property-related agricultural pressure.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;