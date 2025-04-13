import numpy as np
import pandas as pd
import joblib
import threading
from catboost import CatBoostRanker, Pool
from pathlib import Path
from pymongo import MongoClient
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import ndcg_score
from apscheduler.schedulers.background import BackgroundScheduler

# MongoDB Connection
MONGO_URI = "mongodb+srv://user1:aaishafitwala12345@cluster0.ibo0s.mongodb.net/REdatabase?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME = "REdatabase"
COLLECTION_NAME = "Residency"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# ✅ Paths
MODEL_PATH = Path("C:/mainnnnnn/server/ai_ranking/property_ranker.pkl")
SCALER_PATH = Path("C:/mainnnnnn/server/ai_ranking/scaler.pkl")

# ✅ Load or Create Model & Scaler
def load_model():
    return joblib.load(MODEL_PATH) if MODEL_PATH.exists() else None

def load_scaler():
    return joblib.load(SCALER_PATH) if SCALER_PATH.exists() else StandardScaler()

catboost_model = load_model()
scaler = load_scaler()

# ✅ Convert Facilities & Amenities to Numeric Score
def calculate_facility_score(facilities, amenities):
    score = 0
    if isinstance(facilities, dict):
        score += facilities.get("bedrooms", 0) * 2
        score += facilities.get("bathrooms", 0) * 1.5
        score += facilities.get("parkings", 0) * 1.2
    if isinstance(amenities, str) and len(amenities) > 0:
        score += 2  # Base score if amenities exist
    return score

# ✅ Fetch & Preprocess Data from MongoDB
def fetch_properties():
    print("📌 Fetching properties from MongoDB...")
    properties = list(collection.find({}, {"size": 1, "price": 1, "facilities": 1, "amenities": 1, "city": 1, "TypeofHouse": 1}))
    return pd.DataFrame(properties)

# ✅ Preprocess Data
def preprocess_data(df):
    if df.empty:
        return df

    df["size"] = df["size"].astype(str).str.replace(r"[^\d.]", "", regex=True).str.strip()
    df["size"] = pd.to_numeric(df["size"], errors="coerce").fillna(500)  # Default 500 sqft

    df["price"] = (
        df["price"]
        .astype(str)
        .str.replace(",", "", regex=True)
        .str.replace("Cr", "0000000", regex=True)
        .str.replace("L", "00000", regex=True)
        .str.replace(r"[^\d.]", "", regex=True)
    )
    df["price"] = pd.to_numeric(df["price"], errors="coerce").fillna(10000000)  # Default 1 Cr

    # ✅ FIX: Apply log transformation to stabilize large prices
    df["price"] = np.log1p(df["price"])  # log(1 + price) to prevent zeros

    df["facility_score"] = df.apply(lambda row: calculate_facility_score(row.get("facilities", {}), row.get("amenities", None)), axis=1)

    df["is_apartment"] = (df["TypeofHouse"] == "Apartment").astype(int)
    df["is_bungalow"] = (df["TypeofHouse"] == "Bungalow").astype(int)
    df["is_villa"] = (df["TypeofHouse"] == "Villa").astype(int)

    df["group_id"] = df["city"].astype("category").cat.codes
    df = df.sort_values(by=["group_id"]).reset_index(drop=True)
    df["group_id"] = df["group_id"].rank(method="dense").astype(int)

    df.fillna(0, inplace=True)
    return df

# ✅ Train Model (Fixed Pairwise Loss Issue)
def train_model():
    df = fetch_properties()
    df = preprocess_data(df)
    if df.empty:
        print("❌ No valid data found in MongoDB. Exiting training.")
        return

    features = ["size", "price", "facility_score", "is_apartment", "is_bungalow", "is_villa"]
    X = scaler.fit_transform(df[features])
    y = df["price"]
    groups = df["group_id"]

    # ✅ FIX: Remove `weight=df["weight"]` to avoid pairwise loss error
    train_pool = Pool(data=X, label=y, group_id=groups)

    print("📌 Training AI-balanced CatBoostRanker model...")
    model = CatBoostRanker(iterations=1000, learning_rate=0.03, depth=7, loss_function="YetiRank", verbose=False)
    model.fit(train_pool)

    # ✅ Compute NDCG Score to Measure AI Performance
    predictions = model.predict(X)
    ndcg = ndcg_score([y], [predictions])
    print(f"✅ NDCG Score: {ndcg:.4f} (Measures ranking accuracy)")

    # ✅ Save Model & Scaler
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    print(f"✅ AI-balanced Model saved at {MODEL_PATH}")

# ✅ Auto-Retrain Model Every 2 Minutes (Fixes Instant First Retraining Issue)
def auto_retrain():
    print("🔄 Auto-retraining AI model...")
    train_model()

scheduler = BackgroundScheduler()
scheduler.add_job(auto_retrain, "interval", minutes=2, coalesce=True, max_instances=1, next_run_time=None)  # Fixes instant retraining issue
scheduler.start()

# ✅ Prevent Initial Duplicate Training
if __name__ == "__main__":
    print("🚀 AI Model is Ready. First retraining will happen in 2 minutes.")

    # ✅ Keep script running for auto-retraining
    try:
        while True:
            pass
    except KeyboardInterrupt:
        print("\n🛑 Stopping AI auto-retraining...")
        scheduler.shutdown()
