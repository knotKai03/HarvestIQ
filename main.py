#main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import snowflake.connector
import anthropic
import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title = "HarvestIQ", version ="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], #Restrict to your domin in production
    allow_methods=["*"],
    allow_headers=["*"],
)

#_____________________________________
# REGION MAPPING
# Frontend sends the plain names
#_____________________________________

REGION_MAP = {
    "Northeast": "Northeast Kansas",
    "Northwest": "Northwest Kansas",
    "Southeast": "Southeast Kansas",
    "Southwest": "Southwest Kansas",
    "Central": "Central Kansas",
}
REVERSE_MAP = {v: k for k, v in REGION_MAP.items()}
VALID_REGIONS = list(REGION_MAP.keys())

def to_db(region:str) -> str:
    """Convert Plain frontend name to DB Spelling"""
    return REGION_MAP[region]

def validate(region: str):
    """Raise 400 if region is not one of the 5 valid option"""
    if region not in VALID_REGIONS:
        raise HTTPException(
            status_code = 400,
            detail = f"Invalid region '{region}'. Valid options: {VALID_REGIONS}"
        )
    
#________________________________________
# SNOWFLAKE CONNECTION#Credentials loaded from .env - never hardcode these values
#________________________________________

def get_conn():
    from cryptography.hazmat.primitives import serialization

    # Local development — use key file
    # Production (Railway) — use environment variable
    if os.path.exists("snowflake_key.pem"):
        with open("snowflake_key.pem", "rb") as key_file:
            key_data = key_file.read()
    else:
        key_data = os.environ["SNOWFLAKE_PRIVATE_KEY"].encode()

    private_key = serialization.load_pem_private_key(
        key_data,
        password=None,
    )

    private_key_bytes = private_key.private_bytes(
        encoding=serialization.Encoding.DER,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )

    return snowflake.connector.connect(
        user=os.environ["SNOWFLAKE_USER"],
        private_key=private_key_bytes,
        account=os.environ["SNOWFLAKE_ACCOUNT"],
        warehouse=os.environ["SNOWFLAKE_WAREHOUSE"],
        database=os.environ["SNOWFLAKE_DATABASE"],
        schema=os.environ["SNOWFLAKE_SCHEMA"],
    )

def run_query(sql: str, params: tuple = ()) -> list[dict]:
    """
    Run a parameterised SQL query, return results as list of dicts.
    Column names are lowewrcased for consistency across the codebase
    """
    conn = get_conn()
    try:
        cur = conn.cursor()
        cur.execute(sql, params)
        cols = [c[0].lower() for c in cur.description]
        return [dict(zip(cols,row)) for row in cur.fetchall()]
    finally:
        conn.close()

#____________________________________________
# FETCHERS - One function per snowflake table
# This is the only section you touch when adding a new table
# ADDing a new table = adding one new function
#_____________________________________________

def fetch_current(region: str) -> dict:
    """
    Composite risk score for one region, current year
    Table: Region_Risk_Report_2026
    """
    rows = run_query("""
        SELECT
            Region,
            Year,
            Predicted_Risk_Score,
            Risk_Level,
            Rank_Label,
            Region_Rank,
            Risk_Info
        FROM Region_Risk_Report_2026
        WHERE Region = %s
        LIMIT 1
    """, (to_db(region),))

    if not rows:
        raise HTTPException(404, f"No 2026 data found for region: {region}")
    rows[0]["region_standard"] = region
    return rows[0]

def fetch_history(region:str) -> list[dict]:
    """
    Historical Composite score for trend context passed to AI
    Table: Risk_Scores
    """
    rows = run_query("""
        SELECT
            Region,
            Year,
            Risk_Score,
            Risk_Level,
            Risk_Description
        FROM Risk_Scores
        WHERE Region = %s
        ORDER BY Year DESC
    """, (to_db(region),))
 
    for r in rows:
        r["region_standard"] = region
    return rows

def fetch_all_current() -> list[dict]:
    """
    All 5 regions composite scores in one query
    Table: Region_Risk_Report_2026
    """
    rows = run_query("""
        SELECT
            Region,
            Year,
            Predicted_Risk_Score,
            Risk_Level,
            Rank_Label,
            Region_Rank,
            Risk_Info
        FROM Region_Risk_Report_2026
        ORDER BY Region_Rank ASC
    """)
    for r in rows:
        r["region_standard"] = REVERSE_MAP.get(r.get("region"), r.get("region"))
    return rows

#_________________________________________________
# PENDING FETCHER - Fill in when individual score table is ready

# Replace the three placeholder values below 
# Region spelling and 0-100 scale already confirmed
#__________________________________________________

def fetch_weather_score(region: str) -> dict:
    rows = run_query("""
            SELECT Region, Weather_Risk_Score
            FROM Future_Weather_Risk_2025_2026
            WHERE Region = %s
            LIMIT 1
    """, (to_db(region),))
    return rows[0] if rows else {}

def fetch_land_score(region: str) -> dict:
    rows = run_query("""
        SELECT Region, Land_Risk_Score
        FROM Future_Land_Risk_2025_2026
        WHERE Region = %s
        LIMIT 1
    """, (to_db(region),))
    return rows[0] if rows else {}

def fetch_market_score(region: str) -> dict:
    rows = run_query("""
        SELECT Region, Market_Risk_Score
        FROM Future_Market_Risk_2025_2026
        WHERE Region = %s
        LIMIT 1
    """, (to_db(region),))
    return rows[0] if rows else {}

#=====================================================
# ROUTES
# One endpoint per feature. Each call only the fetcher(s) it needs.
#=====================================================

@app.get("/")
def health():
    #Confirms API is running
    return {"status": "ok", "regions": VALID_REGIONS}

@app.get("/risk/all/summary")
def all_summary():
    """
    All 5 regions, 2026 composite scores in one call
    Used by the dashboard
    """
    try:
        return {"status": "success", "regions": fetch_all_current()}
    except HTTPException: raise
    except Exception as e: raise HTTPException(500, str(e))

@app.get("/risk/compare/{region_a}/{region_b}")
def compare(region_a: str, region_b: str):
    """
    Side-by-side comparison with score delta.
    Powers the comparison dropdowns at the bottom of the dashboard.
    A positive delta means region_a carries more risk than region_b.
    """
    validate(region_a)
    validate(region_b)
    if region_a == region_b:
        raise HTTPException(400, "Please select two different regions.")
    try:
        sa      = fetch_current(region_a)
        sb      = fetch_current(region_b)
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
    """
    Single Region - 2026 Composite score, rank, and risk level
    Called every time the user switches regions on dashboard
    """
    validate(region)
    try: 
        return {"status": "success", "region": region, "current": fetch_current(region)}
    except HTTPException: raise
    except Exception as e: raise HTTPException(500, str(e))

@app.get("/risk/{region}/history")
def get_history(region: str):
    """
    Historical composite score from Risk_Scores
    Fetched alongside current score and passed to the AI for context
    """
    validate(region)
    try:
        return {"status": "success", "region": region, "history": fetch_history(region)}
    except HTTPException: raise
    except Exception as e: raise HTTPException(500, str(e))

#___________________________________________________________
# PENDING ENDPOINT - Activate when individual score table is ready

#Step 1 - Fill in fetch_factors() above with your table + column names
#Step 2 - Delete the raise HTTException(501...) line below
#Step 3 - Uncomment the try/return block

#Frontend - Add this one line inside selectRegion() in your JS:
    # const factorsRes = await apiFetch(`/risk/${region}/factors`)
#____________________________________________________________

@app.get("/risk/{region}/factors")
def get_factors(region: str):
    """
    Individual weather, market, and land risk scores for one region
    Not active - waiting on individual scores table
    """
    validate(region)
    try:
        weather = fetch_weather_score(region)
        market = fetch_market_score(region)
        land = fetch_land_score(region)
        return {
            "status": "success",
            "region": region,
            "factors": {
                "weather": weather,
                "market": market,
                "land": land,
            }
        }
    except HTTPException: raise
    except Exception as e: raise HTTPException(500, str(e))


#_____________________________________________________________
# AI EXPLANATION
# Sends score data to Claude, returns an english paragraph summary
# Two modes: Single region summary, or side by side comparison summary
# Only called when the user clicks an AI Summary button - never automatic
#_____________________________________________________________

class ExplainRequest(BaseModel):
    explanation_type: str                     # "region" | "comparison"
    region_data:      Optional[dict] = None   # required for "region"
    history:          Optional[list] = None   # optional historical context
    comparison_data:  Optional[dict] = None   # required for "comparison"
 
 
@app.post("/ai/explain")
def ai_explain(req: ExplainRequest):
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
 
    if req.explanation_type == "region":
        if not req.region_data:
            raise HTTPException(400, "region_data is required for type 'region'")
 
        d        = req.region_data
        hist     = req.history or []
        hist_str = ""
        if hist:
            lines    = [f"  {r.get('year')}: Score {r.get('risk_score')} ({r.get('risk_level')})"
                        for r in hist[:5]]
            hist_str = "Historical scores (most recent first):\n" + "\n".join(lines)
 
        prompt = f"""You are an agricultural risk analyst for Kansas farmland.
The user is viewing the risk dashboard for {d.get('region_standard')} Kansas.
 
2026 Risk Data:
- Composite Risk Score : {d.get('predicted_risk_score')}
- Risk Level           : {d.get('risk_level')}
- Regional Rank        : {d.get('region_rank')} of 5 Kansas regions
- Rank Label           : {d.get('rank_label')}
- Risk Info            : {d.get('risk_info')}

{hist_str}
 
Write 2 short plain-English paragraphs (no bullet points, under 160 words):
1. What this score means practically for farmers and landowners in this region.
2. Whether risk has improved or worsened vs prior years and one actionable insight."""
 
    elif req.explanation_type == "comparison":
        if not req.comparison_data:
            raise HTTPException(400, "comparison_data is required for type 'comparison'")
 
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
        import traceback
        traceback.print_exc()
        raise HTTPException(500, str(e))
 