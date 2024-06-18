import express from "express"
import {MongoClient} from "mongodb"

const router = express.Router()

const client = new MongoClient('mongodb://127.0.0.1:27017')

router.post('/', async (req,res) => {
    const {dateFrom, dateTo, guestCount} = req.body
    console.log(req.body)
    let counts = []
    for(let i=1; i<= parseInt(guestCount); i++){
        counts.push(i)
    }

    await client.connect()
    const db = client.db("Hotel")
    const foodCollection = db.collection('food')
    const roomCollection = db.collection('room')

    const availableRooms = await roomCollection.aggregate([
        {
            $lookup: {
                from: 'reservation',
                let: {room_number: '$room_number'},
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $in: ['$$room_number', '$rooms']
                                    },
                                    {
                                        $or: [
                                            {
                                                $and: [
                                                    { $gte: ['$check_in', dateFrom] },
                                                    { $lte: ['$check_in', dateTo] },
                                                    { $or: [
                                                        { $eq: ["$status", "confirmed"] },
                                                        { $eq: ["$status", "pending"] }
                                                    ] }
                                                ]
                                            },
                                            {
                                                $and: [
                                                    { $gte: ['$check_out', dateFrom] },
                                                    { $lte: ['$check_out', dateTo] },
                                                    { $or: [
                                                        { $eq: ["$status", "confirmed"] },
                                                        { $eq: ["$status", "pending"] }
                                                    ] }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                ],
                as: "reservations"
            },
        },
        {
            $match: { reservations: { $eq: [] } },
        },
        {
            $project: {
                _id: 1,
                room_number: 1,
                price: 1,
                capacity: 1,
                include: 1,
                area: 1,
                features: 1,
            },
        },
    ]).toArray();


    console.log(availableRooms)
    const food = await foodCollection.find().toArray()

    let maxCapacity = 0; 
    availableRooms.forEach(room => {
        maxCapacity += room.capacity
    })

    if(maxCapacity < guestCount){
        res.send("Not enough room available for your reservation try different dates")
    } else {
        res.render('reservationGuestData', {data: {dateFrom: dateFrom, dateTo: dateTo, guestCount: guestCount, count: counts, room: availableRooms, food: food}})
    }
})

export default router