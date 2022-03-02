import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = new MongoClient(process.env.DATABASE_URL as string);
  await client.connect();

  const reviewsCollection = client.db("room-reviews").collection("reviews");
  const data: Object[] = await reviewsCollection.find({}).toArray();
  if (!data) {
    await client.close();
    return res.status(404).end();
  }
  const preppedData: Object[] = data.map((review: any) => {
    return {
      _id: review._id,
      date: review.date.toISOString().split("T")[0],
      content: review.content,
      rating: review.rating,
      building_name: review.building_name,
      room_number: review.room_number,
      room_sqft: review.room_sqft,
      room_occ: review.room_occ,
      room_subfree: review.room_subfree ? "Yes" : "No",
      room_numrooms: review.room_numrooms,
      room_floor: review.room_floor,
      room_bathroomtype: review.room_bathroomtype,
    };
  });
  await client.close();
  return res.status(200).json(preppedData);
}
