import express from "express"
import {MongoClient} from "mongodb"

const router = express.Router()

const client = new MongoClient('mongodb://127.0.0.1:27017')

router.get('/', async (req,res) => {
    const curr = new Date().toISOString()
    const today = curr.split('T')[0]
    console.log(today)
    try{
        await client.connect()
        const db = client.db('Hotel')
        const reservationCollection = db.collection('reservation')
        const reviewCollection = db.collection('review')

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

        const roomRatings = await reviewCollection.aggregate([
            {
                $lookup: {
                    from: 'reservation',
                    localField: 'reservation_id',
                    foreignField: '_id',
                    as: 'reservation'
                }
            },
            { $unwind: "$reservation" },
            { $unwind: "$reservation.rooms" },
            {
                $group: {
                    _id: "$reservation.rooms",
                    average_score: { $avg: "$score" },
                    review_count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'room',
                    localField: '_id',
                    foreignField: 'room_number',
                    as: 'room_details'
                }
            },
            { $unwind: "$room_details" },
            {
                $project: {
                    room_number: "$_id",
                    average_score: 1,
                    review_count: 1,
                    price: "$room_details.price",
                    capacity: "$room_details.capacity",
                    features: "$room_details.features"
                }
            }
        ]).toArray();

        const topGuests = await reviewCollection.aggregate([
            {
                $group: {
                    _id: "$guest_id",
                    average_score: { $avg: "$score" },
                    review_count: { $sum: 1 }
                }
            },
            { $sort: { average_score: -1, review_count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'guest',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'guest_details'
                }
            },
            { $unwind: "$guest_details" },
            {
                $project: {
                    guest_id: "$_id",
                    average_score: 1,
                    review_count: 1,
                    first_name: "$guest_details.first_name",
                    last_name: "$guest_details.last_name",
                    email: "$guest_details.email"
                }
            }
        ]).toArray();

        const topFoodTypes = await reviewCollection.aggregate([
            {
              '$lookup': {
                'from': 'reservation', 
                'localField': 'reservation_id', 
                'foreignField': '_id', 
                'as': 'reservation'
              }
            }, {
              '$unwind': '$reservation'
            }, {
              '$group': {
                '_id': '$reservation.food_type', 
                'average_score': {
                  '$avg': '$score'
                }, 
                'review_count': {
                  '$sum': 1
                }
              }
            }, {
              '$project': {
                '_id': 0, 
                'food_type': '$_id', 
                'average_score': 1, 
                'review_count': 1
              }
            }
          ]).toArray()
        

          const todayStatus = await reservationCollection.aggregate([
            {
                $match: {
                    status: "confirmed",
                    $or: [
                        { check_in: { $lte: today }, check_out: { $gt: today } },
                        { check_in: today },
                        { check_out: today }
                    ]
                }
            },
            {
                $facet: {
                    occupiedRooms: [
                        { $match: { check_in: { $lte: today }, check_out: { $gt: today } } },
                        { $unwind: "$rooms" },
                        {
                            $group: {
                                _id: "$rooms",
                                guests: { $addToSet: "$guests" }
                            }
                        },
                        { $unwind: "$guests" },
                        { $unwind: "$guests" },
                        {
                            $lookup: {
                                from: "guest",
                                localField: "guests",
                                foreignField: "_id",
                                as: "guest_details"
                            }
                        },
                        { $unwind: "$guest_details" },
                        {
                            $group: {
                                _id: "$_id",
                                guests: { $addToSet: "$guest_details" }
                            }
                        }
                    ],
                    todayReservations: [
                        { $match: { $or: [{ check_in: today }, { check_out: today }] } },
                        {
                            $lookup: {
                                from: "guest",
                                localField: "guests",
                                foreignField: "_id",
                                as: "guest_details"
                            }
                        },
                        { $project: { _id: 1, check_in: 1, check_out: 1, guests: 1, rooms: 1, guest_details: 1 } }
                    ],
                }
            }
        ]).toArray();


        const [popular] = popularityAggregation

        console.log(todayStatus[0].occupiedRooms[0])

        res.render('admin', {data: {popularRoom: popular.roomAggregation, popularFood: popular.foodAggregation, popularGuest: popular.guestAggregation, roomRatings: roomRatings, topGuests: topGuests, topFoodTypes: topFoodTypes, todayStatus: todayStatus[0]}})
    } catch(error){
        console.error("Error adding review:", error);
        res.status(500).send("Internal Server Error");
    }
})

export default router