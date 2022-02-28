import os
from xxlimited import new
import pandas as pd
import pymongo
from datetime import datetime


def create_db():
    client = pymongo.MongoClient(os.environ["DATABASE_URL"])
    db = client["room-reviews"]

    data = pd.read_csv("cleaned.csv")
    id = 0
    for _, row in data.iterrows():
        new_review = {
            "_id": id,
            "date": datetime.strptime(row["date"], "%Y-%m-%d"),
            "content": row["content"],
            "rating": int(row["rating"]),
            "building_name": row["name"],
            "room_number": row["number"],
            "room_sqft": int(row["sqft"]),
            "room_occ": int(row["occ"]),
            "room_subfree": bool(row["subfree"]),
            "room_numrooms": int(row["numrooms"]),
            "room_floor": int(row["floor"]),
        }

        if row["bathroom"] == "SH":
            new_review["room_bathroomtype"] = "shared"
        elif row["bathroom"] == "PR":
            new_review["room_bathroomtype"] = "private"
        else:
            new_review["room_bathroomtype"] = "public"

        db.reviews.insert_one(new_review)
        print(f"inserted review #{id}")
        id += 1


if __name__ == "__main__":
    create_db()
