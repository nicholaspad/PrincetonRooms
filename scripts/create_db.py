import json
import pymongo
from datetime import datetime


def create_db():
    client = pymongo.MongoClient("")
    db = client["room-reviews"]

    def read_json(filename):
        with open(filename) as f:
            data = json.load(f)
        return data

    buildings = read_json("rooms_building.json")
    rooms = read_json("rooms_room.json")
    # TODO: newreviews entries have a building_id that doesn't seem to relate to anything in buildings
    # also, there are no room_ids so no way to get room information??
    newreviews = read_json("rooms_newreview.json")
    reviews = read_json("rooms_review.json")

    id = 0
    for rev in reviews:
        entry = {
            "_id": id,
            "date": datetime.strptime(rev["date"], "%Y-%m-%d"),
            "content": rev["content"],
            "rating": int(rev["rating"]),
        }

        room_id = rev["room_id"]
        for room in rooms:
            if room["id"] == room_id:
                entry["room_number"] = room["number"]
                entry["room_sqft"] = int(room["sqft"])
                entry["room_occ"] = int(room["occ"])
                entry["room_subfree"] = bool(room["subfree"])
                entry["room_numrooms"] = int(room["numrooms"])
                entry["room_floor"] = int(room["floor"])

                if room["bathroom"] == "SH":
                    entry["room_bathroomtype"] = "shared"
                elif room["bathroom"] == "PR":
                    entry["room_bathroomtype"] = "private"
                else:
                    entry["room_bathroomtype"] = "public"

                building_id = room["building_id"]
                for building in buildings:
                    if building["id"] == building_id:
                        entry["building_name"] = building["name"]

        db.reviews.insert_one(entry)
        print(f"inserted review #{id}")
        id += 1


if __name__ == "__main__":
    create_db()
