import re
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb+srv://user1:aaishafitwala12345@cluster0.ibo0s.mongodb.net/REdatabase?retryWrites=true&w=majority&appName=Cluster0")  # Update with your actual MongoDB connection URL
db = client["REdatabase"]  # Your database name
collection = db["Residency"]  # Your collection name

class ActionFetchProperties(Action):
    def name(self) -> Text:
        return "action_fetch_properties"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        user_message = tracker.latest_message.get("text", "").lower()
        search_filter = {}

        # ✅ Detect City
        if "south mumbai" in user_message:
            search_filter["city"] = "South Mumbai"
        if "mumbai suburban" in user_message:
            search_filter["city"] = "Mumbai Suburban"

        # ✅ Detect Localities
        known_localities = [
            "worli", "colaba", "lower parel", "bandra", "santacruz", "andheri",
            "byculla", "borivali", "matunga", "mahim", "dadar", "parel", "girgaon",
            "wadala", "sion", "cumballa hill"
        ]
        for locality in known_localities:
            if locality in user_message:
                search_filter["address"] = {"$regex": locality, "$options": "i"}

        # ✅ Detect Property Type
        property_types = ["apartment", "villa", "bungalow", "penthouse", "studio", "rental"]
        for prop_type in property_types:
            if prop_type in user_message:
                search_filter["TypeofHouse"] = {"$regex": prop_type, "$options": "i"}

        # ✅ Detect Amenities (Pool, Gym, Garden, etc.)
        amenities = []
        amenities_mapping = {
            "swimming pool": "pool",
            "pool": "pool",
            "gym": "gym",
            "garden": "garden",
            "kids' play area": "kids_play_area",
            "play area": "kids_play_area",
            "clubhouse": "clubhouse",
            "parking": "parking",
            "security": "security"
        }

        for keyword, amenity in amenities_mapping.items():
            if keyword in user_message:
                amenities.append(amenity)

        # ✅ Handle Unexpected Inputs
        valid_amenities = {"pool", "gym", "garden"}  # ❌ "kids_play_area" is NOT in your DB
        requested_amenities = set(amenities)

        # ✅ If user asks for an unavailable amenity, return a message and exit
        if requested_amenities and not requested_amenities.intersection(valid_amenities):
            dispatcher.utter_message(
                text=f"Sorry, I couldn't find properties with {', '.join(requested_amenities)}. Try searching for properties with pool, gym, or garden."
            )
            return []

        # ✅ Handle completely irrelevant questions
        unexpected_keywords = ["elevator", "sea view", "school nearby", "metro access"]
        if any(word in user_message for word in unexpected_keywords):
            dispatcher.utter_message(
                text="I currently don't have information about that. Try searching for properties by price, location, or amenities like pool, gym, or garden."
            )
            return []

        if amenities:
            search_filter["amenities"] = {"$regex": "|".join(amenities), "$options": "i"}

        # ✅ Extract Prices from Query
        price_matches = re.findall(r"(\d+(\.\d+)?)\s*(cr|crore|lakh)?", user_message)
        prices = []
        for match in price_matches:
            value, _, unit = match
            price = float(value)
            if unit in ["cr", "crore"]:
                price *= 10**7  # Convert crore to INR
            elif unit == "lakh":
                price *= 10**5  # Convert lakh to INR
            prices.append(price)

        # ✅ Apply Price Filtering
        if len(prices) == 1:
            if "under" in user_message or "below" in user_message:
                search_filter["price"] = {"$lte": prices[0]}
            elif "above" in user_message or "over" in user_message:
                search_filter["price"] = {"$gte": prices[0]}
            else:
                search_filter["price"] = {"$eq": prices[0]}
        elif len(prices) == 2 and "between" in user_message:
            search_filter["price"] = {"$gte": prices[0], "$lte": prices[1]}

        # ✅ Fetch Properties from MongoDB
        properties = list(collection.find(search_filter).sort("price", 1))

        # ✅ Format INR Properly
        def format_price(price):
            if price >= 10**7:
                return f"₹{price / 10**7:.2f} Cr"
            elif price >= 10**5:
                return f"₹{price / 10**5:.2f} Lakh"
            return f"₹{price:,}"

        # ✅ Process Results
        property_list = [
            f"{p.get('title', 'Unknown Property')} in {p.get('address', 'Unknown Location')} "
            f"for {format_price(p.get('price', 0))} ({p.get('amenities', 'No amenities')})"
            for p in properties
        ]

        # ✅ Respond to User - **Fixed**
        if property_list:
            amenities_text = f" with {', '.join(amenities)}" if amenities else ""
            response_text = f"""Here are some properties{amenities_text}:\n\n""" + "\n\n".join(property_list)
            print("✅ Sending Response to UI:", response_text)

            dispatcher.utter_message(text=response_text)

        else:
            suggestions = []
    
            # ✅ Suggest other properties in the same price range
            if prices:
                similar_properties = list(collection.find({
                    "price": {"$gte": prices[0] - 10000000, "$lte": prices[0] + 10000000}
                }).limit(3))
                
                if similar_properties:
                    suggestions = [
                        f"{p.get('title', 'Unknown Property')} in {p.get('address', 'Unknown Location')} "
                        f"for ₹{p.get('price', 0):,}"
                        for p in similar_properties
                    ]
            
            if suggestions:
                dispatcher.utter_message(
                    text="Sorry, I couldn't find exactly what you're looking for. However, you might be interested in these:\n\n" 
                    + "\n".join(suggestions)
                )
            else:
                dispatcher.utter_message(
                    text="Sorry, I couldn't find any matching properties. Try adjusting your search criteria."
                )

        return []
