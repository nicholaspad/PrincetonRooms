import pandas as pd
import pymongo


def main():
    client = pymongo.MongoClient("")
    db = client["room-data"]

    with open("AvailableRoomsList2022.txt", "r") as f:
        raw_lines = f.readlines()

    occ_map = {
        "Triple": "3",
        "Double": "2",
        "Single": "1",
        "Da": "1",
        "Quad": "4",
        "Quint": "5",
        "6Person": "6",
    }

    cols = ["building", "room_no", "occupancy", "size", "college", "bedrooms"]
    cols_idx = 0
    current_col = cols[cols_idx]

    data = {}
    for col in cols:
        data[col] = []

    next_category = False
    for line in raw_lines:
        if line[0] == "\n":
            if not next_category:
                next_category = True
                cols_idx += 1
                current_col = cols[cols_idx % len(cols)]
            continue
        if line[-1] == "\n":
            line = line[:-1]
        line = line.title()
        if current_col == "occupancy":
            line = occ_map[line]
        data[current_col].append(line)
        next_category = False

    df = pd.DataFrame()
    for col in data:
        df[col] = data[col]

    docs = df.to_dict(orient="records")
    id = 0

    for doc in docs:
        doc["_id"] = id
        db.rooms.insert_one(doc)
        print(f"inserted room #{id}")
        id += 1


if __name__ == "__main__":
    main()
