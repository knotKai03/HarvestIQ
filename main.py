from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import snowflake.connector
import anthropic
import os
from typing import Optional
from dotenv import load_dotenv
 
load_dotenv()
 
app = FastAPI(title="HarvestIQ API", version="4.0.0")
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
 
 
# ══════════════════════════════════════════════════════════════════════════════
# REGION MAPPING
# ══════════════════════════════════════════════════════════════════════════════
 
KANSAS_REGION_MAP = {
    "Northeast": "Northeast Kansas",
    "Northwest": "Northwest Kansas",
    "Southeast": "Southeast Kansas",
    "Southwest": "Southwest Kansas",
    "Central":   "Central Kansas",
}
 
IOWA_REGION_MAP = {
    "Northeast": "Northeast Iowa",
    "Northwest": "Northwest Iowa",
    "Southeast": "Southeast Iowa",
    "Southwest": "Southwest Iowa",
    "Central":   "Central Iowa",
}
 
VALID_REGIONS  = list(KANSAS_REGION_MAP.keys())
VALID_STATES   = ["Kansas", "Iowa"]
 
def to_kansas_db(region: str) -> str:
    return KANSAS_REGION_MAP[region]
 
def to_iowa_db(region: str) -> str:
    return IOWA_REGION_MAP[region]
 
def validate_region(region: str):
    if region not in VALID_REGIONS:
        raise HTTPException(400, f"Invalid region '{region}'. Valid: {VALID_REGIONS}")
 
def validate_state(state: str):
    if state not in VALID_STATES:
        raise HTTPException(400, f"Invalid state '{state}'. Valid: {VALID_STATES}")
 
 
# ══════════════════════════════════════════════════════════════════════════════
# SNOWFLAKE CONNECTION
# ══════════════════════════════════════════════════════════════════════════════
 
def get_conn():
    from cryptography.hazmat.primitives import serialization
 
    if os.path.exists("snowflake_key.pem"):
        with open("snowflake_key.pem", "rb") as key_file:
            key_data = key_file.read()
    else:
        key_str = os.environ["SNOWFLAKE_PRIVATE_KEY_B64"]
        import base64
        key_data = base64.b64decode(key_str)
 
    private_key = serialization.load_pem_private_key(key_data, password=None)
    private_key_bytes = private_key.private_bytes(
        encoding=serialization.Encoding.DER,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )
 
    return snowflake.connector.connect(
        user=os.environ["SNOWFLAKE_USER"],
        account=os.environ["SNOWFLAKE_ACCOUNT"],
        private_key=private_key_bytes,
        warehouse=os.environ["SNOWFLAKE_WAREHOUSE"],
        database=os.environ["SNOWFLAKE_DATABASE"],
        schema=os.environ["SNOWFLAKE_SCHEMA"],
    )
 
def run_query(sql: str, params: tuple = ()) -> list[dict]:
    conn = get_conn()
    try:
        cur = conn.cursor()
        cur.execute(sql, params)
        cols = [c[0].lower() for c in cur.description]
        return [dict(zip(cols, row)) for row in cur.fetchall()]
    finally:
        conn.close()
 
 
# ══════════════════════════════════════════════════════════════════════════════
# KANSAS FETCHERS
# ══════════════════════════════════════════════════════════════════════════════
 
def fetch_kansas_current(region: str) -> dict:
    """2026 composite score for one Kansas region."""
    rows = run_query("""
        SELECT Region, Year, Predicted_Risk_Score,
               Risk_Level, Rank_Label, Region_Rank, Risk_Info
        FROM Region_Risk_Report_2026
        WHERE Region = %s
        LIMIT 1
    """, (to_kansas_db(region),))
    if not rows:
        raise HTTPException(404, f"No 2026 data for Kansas region: {region}")
    rows[0]["region_standard"] = region
    return rows[0]
 
 
def fetch_kansas_weather_scores(region: str) -> list[dict]:
    return run_query("""
        SELECT YEAR, WEATHER_RISK_SCORE
        FROM WEATHER_FACTOR_RISK_SCORES
        WHERE REGION = %s
        AND YEAR >= 2014
        ORDER BY YEAR ASC
    """, (to_kansas_db(region),))


def fetch_kansas_market_scores(region: str) -> list[dict]:
    return run_query("""
        SELECT YEAR, MARKET_RISK_SCORE
        FROM MARKET_FACTOR_RISK_SCORES
        WHERE REGION = %s
        AND REGION != 'Kansas_Statewide'
        AND YEAR >= 2014
        ORDER BY YEAR ASC
    """, (to_kansas_db(region),))


def fetch_kansas_land_scores(region: str) -> list[dict]:
    return run_query("""
        SELECT YEAR, LAND_RISK_SCORE
        FROM LAND_FACTOR_RISK_SCORES
        WHERE REGION = %s
        AND REGION != 'state_avg'
        AND YEAR >= 2014
        ORDER BY YEAR ASC
    """, (to_kansas_db(region),))
 
 
def fetch_kansas_history(region: str) -> list[dict]:
    """
    Historical composite + individual factor scores 2014-2024
    for one Kansas region. Combines Risk_Scores with the three
    factor tables into one row per year.
    """
    # Composite scores
    composite_rows = run_query("""
        SELECT Region, Year, Risk_Score, Risk_Level, Risk_Description
        FROM Risk_Scores
        WHERE Region = %s
        ORDER BY Year ASC
    """, (to_kansas_db(region),))
 
    # Individual factor scores
    weather_rows = fetch_kansas_weather_scores(region)
    market_rows  = fetch_kansas_market_scores(region)
    land_rows    = fetch_kansas_land_scores(region)
 
    # Build lookup dicts by year
    weather_by_year = {r["year"]: r.get("weather_risk_score") for r in weather_rows}
    market_by_year  = {r["year"]: r.get("market_risk_score")  for r in market_rows}
    land_by_year    = {r["year"]: r.get("land_risk_score")    for r in land_rows}
 
    # Combine into one row per year
    combined = []
    for r in composite_rows:
        year = r["year"]
        combined.append({
            "year":             year,
            "risk_score":       r.get("risk_score"),
            "risk_level":       r.get("risk_level"),
            "risk_description": r.get("risk_description"),
            "weather_score":    weather_by_year.get(year),
            "market_score":     market_by_year.get(year),
            "land_score":       land_by_year.get(year),
            "region_standard":  region,
            "state":            "Kansas",
        })
 
    return combined
 
 
def fetch_all_kansas_current() -> list[dict]:
    """All 5 Kansas regions 2026 scores."""
    reverse = {v: k for k, v in KANSAS_REGION_MAP.items()}
    rows = run_query("""
        SELECT Region, Year, Predicted_Risk_Score,
               Risk_Level, Rank_Label, Region_Rank, Risk_Info
        FROM Region_Risk_Report_2026
        ORDER BY Region_Rank ASC
    """)
    for r in rows:
        r["region_standard"] = reverse.get(r.get("region"), r.get("region"))
    return rows
 
 
# ══════════════════════════════════════════════════════════════════════════════
# IOWA FETCHERS
# ══════════════════════════════════════════════════════════════════════════════
 
def fetch_iowa_history(region: str) -> list[dict]:
    """
    Historical Iowa data combining all four Iowa tables.
    Returns one row per year with total, weather, market, and land scores.
    Market is statewide so same value across all regions per year.
    """
    iowa_region = to_iowa_db(region)
 
    # Total risk — region specific
    total_rows = run_query("""
        SELECT Year, TOTAL_RISK_SCORE, TOTAL_RISK_LEVEL
        FROM IOWA_HISTORICAL_TOTAL_RISK
        WHERE Region = %s
        ORDER BY Year ASC
    """, (iowa_region,))
 
    # Weather risk — region specific
    weather_rows = run_query("""
        SELECT Year, WEATHER_RISK_SCORE
        FROM IOWA_HISTORICAL_WEATHER_RISK
        WHERE Region = %s
        ORDER BY Year ASC
    """, (iowa_region,))
 
    # Land risk — region specific
    land_rows = run_query("""
        SELECT Year, LAND_RISK_SCORE
        FROM IOWA_HISTORICAL_LAND_RISK
        WHERE Region = %s
        ORDER BY Year ASC
    """, (iowa_region,))
 
    # Market risk — statewide, one value per year
    market_rows = run_query("""
        SELECT Year, MARKET_RISK_RANK
        FROM IOWA_HISTORICAL_MARKET_RISK
        WHERE Region = 'Statewide Iowa'
        ORDER BY Year ASC
    """)
 
    # Build lookup dicts by year
    weather_by_year = {r["year"]: r.get("weather_risk_score") for r in weather_rows}
    land_by_year    = {r["year"]: r.get("land_risk_score")    for r in land_rows}
    market_by_year  = {r["year"]: r.get("market_risk_rank")   for r in market_rows}
 
    # Combine into one row per year
    combined = []
    for r in total_rows:
        year = r["year"]
        combined.append({
            "year":              year,
            "risk_score":        r.get("total_risk_score"),
            "risk_level":        r.get("total_risk_level"),
            "weather_score":     weather_by_year.get(year),
            "market_score":      market_by_year.get(year),
            "land_score":        land_by_year.get(year),
            "region_standard":   region,
            "state":             "Iowa",
        })
 
    return combined
 
 
# ══════════════════════════════════════════════════════════════════════════════
# ROUTES
# ══════════════════════════════════════════════════════════════════════════════
 
@app.get("/")
def health():
    return {"status": "ok", "regions": VALID_REGIONS, "states": VALID_STATES}
 
 
# ── Kansas routes ──────────────────────────────────────────────────────────────
 
@app.get("/risk/all/summary")
def all_summary():
    """All 5 Kansas regions 2026 scores."""
    try:
        return {"status": "success", "regions": fetch_all_kansas_current()}
    except HTTPException: raise
    except Exception as e: raise HTTPException(500, str(e))
 
 
@app.get("/risk/compare/{region_a}/{region_b}")
def compare(region_a: str, region_b: str):
    """Side-by-side Kansas comparison with delta."""
    validate_region(region_a)
    validate_region(region_b)
    if region_a == region_b:
        raise HTTPException(400, "Select two different regions.")
    try:
        sa      = fetch_kansas_current(region_a)
        sb      = fetch_kansas_current(region_b)
        score_a = sa.get("predicted_risk_score") or 0
        score_b = sb.get("predicted_risk_score") or 0
        delta   = round(score_a - score_b, 2)
        return {
            "status":            "success",
            "region_a":          {"name": region_a, "data": sa},
            "region_b":          {"name": region_b, "data": sb},
            "delta":              delta,
            "higher_risk_region": region_a if delta > 0 else (region_b if delta < 0 else "equal"),
        }
    except HTTPException: raise
    except Exception as e: raise HTTPException(500, str(e))
 
 
@app.get("/risk/{region}")
def get_risk(region: str):
    """Single Kansas region 2026 composite score."""
    validate_region(region)
    try:
        return {"status": "success", "region": region, "current": fetch_kansas_current(region)}
    except HTTPException: raise
    except Exception as e: raise HTTPException(500, str(e))
 
 
@app.get("/risk/{region}/history")
def get_kansas_history(region: str):
    """Kansas historical scores 2014-2024."""
    validate_region(region)
    try:
        return {"status": "success", "region": region, "history": fetch_kansas_history(region)}
    except HTTPException: raise
    except Exception as e: raise HTTPException(500, str(e))
 
 
# ── Iowa routes ────────────────────────────────────────────────────────────────
 
@app.get("/iowa/{region}/history")
def get_iowa_history(region: str):
    """
    Iowa historical data 2014-2024 for one region.
    Returns combined total, weather, market, and land scores per year.
    """
    validate_region(region)
    try:
        rows = fetch_iowa_history(region)
        return {"status": "success", "region": region, "state": "Iowa", "history": rows}
    except HTTPException: raise
    except Exception as e: raise HTTPException(500, str(e))
 
 
# ── AI Explanation ─────────────────────────────────────────────────────────────
 
class ExplainRequest(BaseModel):
    explanation_type: str
    region_data:      Optional[dict] = None
    history:          Optional[list] = None
    comparison_data:  Optional[dict] = None
 
@app.post("/ai/explain")
def ai_explain(req: ExplainRequest):
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
 
    if req.explanation_type == "region":
        if not req.region_data:
            raise HTTPException(400, "region_data required")
 
        d     = req.region_data
        hist  = req.history or []
        state = d.get("state", "Kansas")

        hist_str = ""
        if hist:
            lines = [
                f"  {r.get('year')}: Total={r.get('risk_score')} ({r.get('risk_level')})"
                f" | Weather={r.get('weather_score')} | Market={r.get('market_score')} | Land={r.get('land_score')}"
                for r in hist
            ]
            hist_str = "Full historical scores 2014-2024:\n" + "\n".join(lines)

        latest = hist[-1] if hist else {}

        prompt = f"""You are an agricultural risk analyst for {state} farmland.
The user is viewing the historical risk dashboard for {d.get('region_standard')} {state}.

Most Recent Year (2024) — Primary Focus:
- Composite Risk Score : {latest.get('risk_score') or d.get('predicted_risk_score')}
- Risk Level           : {latest.get('risk_level') or d.get('risk_level')}

{hist_str}

Write 3 short plain-English paragraphs (no bullet points, under 220 words):
1. What the 2024 risk score means practically for farmers and landowners in this region.
2. Describe the overall trend from 2014 to 2024 — is risk increasing, decreasing, or volatile? Which factor (weather, market, or land) has changed the most over the decade?
3. One forward-looking actionable insight based on the 10-year trend."""
 
    elif req.explanation_type == "comparison":
        if not req.comparison_data:
            raise HTTPException(400, "comparison_data required")
 
        c  = req.comparison_data
        da = c.get("region_a", {})
        db = c.get("region_b", {})
 
        prompt = f"""You are an agricultural risk analyst for Kansas farmland.
The user is comparing two Kansas regions side by side.
 
{da.get('name')} Kansas:
- Composite Risk Score : {da.get('data', {}).get('predicted_risk_score')}
- Risk Level           : {da.get('data', {}).get('risk_level')}
- Rank Label           : {da.get('data', {}).get('rank_label')}
- Regional Rank        : {da.get('data', {}).get('region_rank')} of 5
- Risk Info            : {da.get('data', {}).get('risk_info')}
 
{db.get('name')} Kansas:
- Composite Risk Score : {db.get('data', {}).get('predicted_risk_score')}
- Risk Level           : {db.get('data', {}).get('risk_level')}
- Rank Label           : {db.get('data', {}).get('rank_label')}
- Regional Rank        : {db.get('data', {}).get('region_rank')} of 5
- Risk Info            : {db.get('data', {}).get('risk_info')}
 
Score difference (A minus B): {c.get('delta')}
Higher-risk region: {c.get('higher_risk_region')}
 
Write 2-3 short plain-English paragraphs (no bullet points, under 200 words):
1. Which region carries more risk and what that means practically.
2. What the Risk Info fields suggest about why they differ.
3. One concrete takeaway for a farmer or investor choosing between these regions."""
 
    else:
        raise HTTPException(400, "explanation_type must be 'region' or 'comparison'")
 
    try:
        msg = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=400,
            messages=[{"role": "user", "content": prompt}]
        )
        return {"status": "success", "explanation": msg.content[0].text}
    except Exception as e:
        raise HTTPException(500, str(e))
 