import os
import numpy as np
import torch
import joblib
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from transformers import BertTokenizer, BertModel
from sklearn.preprocessing import MinMaxScaler

# ✅ Initialize Flask App
app = Flask(__name__)
CORS(app, supports_credentials=True)

# ✅ Load Model & Scaler
catboost_model = joblib.load("catboost_best_property.pkl")
scaler = joblib.load("scaler.pkl")

# ✅ Load BERT Model
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
bert_model = BertModel.from_pretrained("bert-base-uncased")

# MongoDB connection
MONGO_URI = "mongodb+srv://user1:aaishafitwala12345@cluster0.ibo0s.mongodb.net/REdatabase?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client["REdatabase"]
collection = db["Residency"]

# ✅ One-Hot Encode Amenities
def one_hot_amenities(amenity):
    amenity = str(amenity).strip().lower()
    return [1 if amenity == "gym" else 0, 1 if amenity == "pool" else 0, 1 if amenity == "garden" else 0]

def get_bert_embedding(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = bert_model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).squeeze().numpy()

# ✅ Prepare Features for Model (Model learns city importance)
def prepare_features(properties):
    feature_list = []
    bert_embeddings = []
    cities = list(set([prop.get("city", "Unknown") for prop in properties]))  # Unique city names
    city_to_index = {city: idx for idx, city in enumerate(cities)}  # Assign numerical index to each city

    for prop in properties:
        amenities_encoded = one_hot_amenities(prop.get("amenities", ""))

        size = prop.get("size", "0").replace(" sqft", "").strip()
        try:
            size = float(size)
        except ValueError:
            size = 0

        city_index = city_to_index.get(prop.get("city", "Unknown"), -1)  # Convert city to numeric value

        feature_list.append([
            prop["price"],
            size,
            prop.get("ranking_score", 0),
            city_index,  # Model will determine importance of city
            *amenities_encoded
        ])
        bert_embeddings.append(get_bert_embedding(prop.get("description", "No description")))

    features = np.array(feature_list)
    bert_embeddings = np.stack(bert_embeddings)
    full_features = np.concatenate((features, bert_embeddings), axis=1)

    return scaler.transform(full_features)

# ✅ Compute Property Scores
def compute_property_scores(properties):
    full_features = prepare_features(properties)
    scores = catboost_model.predict(full_features)
    return [(prop["_id"], round(score, 2)) for prop, score in zip(properties, scores)]

# ✅ Generate AI Insights
def generate_ai_insights(property, best_property, is_recommended=False):
    try:
        title = property.get("title", "Unknown")
        ranking = property.get("ranking_score", 0)
        price = property.get("price", "N/A")
        size = property.get("size", "N/A")
        city = property.get("city", "Unknown")

        best_price = best_property.get("price", float("inf"))
        best_size = best_property.get("size", "N/A")
        best_city = best_property.get("city", "Unknown")
        best_ranking = best_property.get("ranking_score", 0)

        size_display = size.replace(" sqft", "").strip()
        best_size_display = best_size.replace(" sqft", "").strip()

        reasons = []

        if is_recommended:
            reasons.append(f"🏅 Top Ranking: {ranking}/10 (Highly rated)")
            reasons.append(f"📍 Prime Location: {city} (Model prioritized this area)")
            reasons.append(f"💰 Best Price-to-Size Ratio: ₹{price} for {size_display} sqft")
            reasons.append("🏡 Balanced Features: Best mix of affordability & value")
        else:
            if price > best_price:
                reasons.append(f"💰 Higher Price: ₹{price} (More expensive than {best_property['title']})")
            else:
                reasons.append(f"💰 Competitive Price: ₹{price} (Affordable compared to other options)")

            if ranking < best_ranking:
                reasons.append(f"🏅 Lower Ranking: {ranking}/10 (Best property scored {best_ranking}/10)")
            else:
                reasons.append(f"🏅 Strong Ranking: {ranking}/10 (Comparable to the best)")

            if city != best_city:
                reasons.append(f"📍 Location Tradeoff: {city} (Model prioritized {best_city})")
            else:
                reasons.append(f"📍 Popular Location: {city} (Well-connected area)")

            if float(size_display) < float(best_size_display):
                reasons.append(f"📏 Smaller Size: {size_display} sqft (Less space compared to {best_property['title']})")
            else:
                reasons.append(f"📏 Spacious: {size_display} sqft (Competitive size)")

        return "\n".join(reasons[:4])

    except Exception:
        return "AI insights unavailable."

# ✅ API Endpoint
@app.route("/compare", methods=["POST"])
def compare_properties():
    try:
        data = request.get_json()
        property_ids = list(set(data.get("property_ids", [])))  # ✅ Prevent duplicate properties

        properties = list(collection.find({"_id": {"$in": [ObjectId(pid) for pid in property_ids]}}))
        for prop in properties:
            prop["_id"] = str(prop["_id"])
            if "size" in prop:
                prop["size"] = prop["size"].replace(" sqft", "").strip()
            prop["view_url"] = f"/properties/{prop['_id']}"

        property_scores = compute_property_scores(properties)
        best_property_id, best_score = max(property_scores, key=lambda x: x[1])
        best_property = next(prop for prop in properties if prop["_id"] == best_property_id)

        ai_insights = [
            {
                "insights": generate_ai_insights(prop, best_property, is_recommended=(prop["_id"] == best_property_id)),
                "view_url": prop["view_url"]
            }
            for prop in properties
        ]

        return jsonify({
            "properties": properties,
            "scores": property_scores,
            "ai_insights": ai_insights,
            "best_property": {
                "title": best_property["title"],
                "score": best_score
            }
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# ✅ Flask App Runner
if __name__ == "__main__":
    app.run(debug=True)
