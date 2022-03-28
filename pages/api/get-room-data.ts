import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = new MongoClient(process.env.DATABASE_URL as string);
  await client.connect();

  const roomsCollection = client.db("room-data").collection("rooms");
  const data: Object[] = await roomsCollection.find({}).toArray();
  if (!data) {
    await client.close();
    return res.status(404).end();
  }
  const preppedData: Object[] = data.map((review: any) => {
    return {
      _id: review._id,
      college_name: review.college,
      building_name: review.building,
      room_number: review.room_no,
      room_sqft: review.size,
      room_occ: review.occupancy,
      room_numrooms: review.bedrooms,
    };
  });
  await client.close();
  return res.status(200).json(preppedData);
}
