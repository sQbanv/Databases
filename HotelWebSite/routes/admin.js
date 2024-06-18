import express from "express"
import {MongoClient} from "mongodb"

const router = express.Router()

const client = new MongoClient('mongodb://127.0.0.1:27017')

router.get('/', async (req,res) => {
    try{
        await client.connect()
        const db = client.db('Hotel')
        const reservationCollection = db.collection('reservation')

        const popularityAggregation = await reservationCollection.aggregate([
            { $match: { status: "confirmed" } },
            {
                $facet: {
                    roomAggregation: [
                        { $unwind: "$rooms" },
                        {
                            $group: {
                                _id: "$rooms",
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { count: -1 } },
                        { $limit: 5 },
                        {
                            $project: {
                                room_number: "$_id",
                                count: 1,
                                _id: 0
                            }
                        }
                    ],
                    foodAggregation: [
                        {
                            $group: {
                                _id: "$food_type",
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { count: -1 } },
                        { $limit: 5 },
                        {
                            $project: {
                                food_type: "$_id",
                                count: 1,
                                _id: 0
                            }
                        }
                    ],
                    guestAggregation: [
                        { $unwind: "$guests" },
                        {
                            $group: {
                                _id: "$guests",
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { count: -1 } },
                        { $limit: 5 },
                        {
                            $lookup: {
                                from: "guest",
                                localField: "_id",
                                foreignField: "_id",
                                as: "guest_info"
                            }
                        },
                        {
                            $unwind: "$guest_info"
                        },
                        {
                            $project: {
                                guest_info: 1,
                                count: 1,
                                _id: 0
                            }
                        }
                    ]
                }
            }
        ]).toArray()

        const [popular] = popularityAggregation

        console.log(popular)

        res.render('admin', {data: {popularRoom: popular.roomAggregation, popularFood: popular.foodAggregation, popularGuest: popular.guestAggregation}})
    } catch(error){
        console.error("Error adding review:", error);
        res.status(500).send("Internal Server Error");
    }
})

export default router