import pymongo
import pandas as pd
from catboost import CatBoostRanker, Pool
from sklearn.preprocessing import LabelEncoder
import numpy as np
import threading
from apscheduler.schedulers.background import BackgroundScheduler

# MongoDB Connection
MONGO_URI = "mongodb+srv://user1:aaishafitwala12345@cluster0.ibo0s.mongodb.net/REdatabase?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME = "REdatabase"
COLLECTION_NAME = "Residency"

client = pymongo.MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# Fetch All Properties
def fetch_properties(property_type):
    return pd.DataFrame(list(collection.find({"TypeofHouse": property_type})))

# Convert Facilities & Amenities to Numeric Score
def calculate_facility_score(facilities, amenities):
    score = 0
    if facilities:
        score += facilities.get("bedrooms", 0) * 2  # More weight for bedrooms
        score += facilities.get("bathrooms", 0) * 1.5
        score += facilities.get("parkings", 0) * 1.2
    if amenities:
        score += 2  # Base score if amenities exist
    return score

# Preprocess Data
def preprocess_data(df, group_id):
    if df.empty:
        return df

    df["size"] = pd.to_numeric(df["size"].astype(str).str.replace(" sqft", "", regex=True).str.strip(), errors="coerce").fillna(df["size"].median())
    df["recency"] = pd.to_datetime(df["createdAt"], errors="coerce").view(np.int64) // 10**9
    df["update_recency"] = pd.to_datetime(df["updatedAt"], errors="coerce").view(np.int64) // 10**9
    
    # Convert city to numerical categories
    df["city"] = LabelEncoder().fit_transform(df["city"].astype(str))

    # Compute facility score
    df["facility_score"] = df.apply(lambda row: calculate_facility_score(row.get("facilities", {}), row.get("amenities", None)), axis=1)

    df["group_id"] = group_id
    return df

# Train CatBoost Ranker
def train_catboost_ranker(df):
    if df.empty:
        return df
    
    features = ["size", "price", "recency", "update_recency", "city", "facility_score"]
    X = df[features]
    y = df["price"]  # Ranking based on price (best value indicator)
    group_id = df["group_id"]
    
    train_pool = Pool(data=X, label=y, group_id=group_id)
    
    model = CatBoostRanker(iterations=500, learning_rate=0.05, depth=6, loss_function='YetiRank')
    model.fit(train_pool, verbose=False)
    
    df["ranking_score"] = model.predict(X)
    df["ranking_score"] = df["ranking_score"].rank(pct=True) * 9 + 1
    df["ranking_score"] = df["ranking_score"].round().astype(int)
    
    return df

# Bulk Update Rankings in DB
def rank_and_store(df):
    if df.empty:
        return
    
    df = train_catboost_ranker(df)
    
    bulk_updates = [
        pymongo.UpdateOne(
            {"_id": row["_id"]},
            {"$set": {"ranking_score": int(row["ranking_score"])}}
        ) for _, row in df.iterrows()
    ]
    
    if bulk_updates:
        collection.bulk_write(bulk_updates)
    
    print(f"Rankings updated in MongoDB ✅")

# Watch for New Property Insertions and Re-rank
def watch_properties():
    pipeline = [{"$match": {"operationType": "insert"}}]
    with collection.watch(pipeline) as stream:
        for change in stream:
            print("New property added, updating rankings...")
            run_ranking()

# Periodic Ranking Updates
def run_ranking():
    for prop_type in ["Apartment", "Villa", "Bungalow"]:
        properties = fetch_properties(prop_type)
        properties = preprocess_data(properties, group_id=1)
        rank_and_store(properties)

# Start Background Scheduler for Periodic Retraining
scheduler = BackgroundScheduler()
scheduler.add_job(run_ranking, "interval", hours=6)  # Retrain every 6 hours
scheduler.start()

# Start Watching MongoDB for New Properties (Real-time Updates)
thread = threading.Thread(target=watch_properties, daemon=True)
thread.start()

print("AI-driven property ranking is running... Watching for new listings! 🚀")
