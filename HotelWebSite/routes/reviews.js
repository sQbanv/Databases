import express from "express"
import {MongoClient} from "mongodb"

const router = express.Router()

const client = new MongoClient('mongodb://127.0.0.1:27017')

router.get('/', async (req,res) => {
    await client.connect()
    const db = client.db("Hotel")
    const reviewCollection = db.collection("review")

    const summary = await reviewCollection.aggregate([
        {
            $group: {
                _id: null,
                avgScore: {$avg: "$score"},
                avgStaff: {$avg: "$categories.staff"},
                avgFacilities: {$avg: "$categories.facilities"},
                avgCleanliness: {$avg: "$categories.cleanliness"},
                avgComfort: {$avg: "$categories.comfort"},
                avgValueForMoney: {$avg: "$categories.value_for_money"},
                avgLocation: {$avg: "$categories.location"},
                avgFreeWifi: {$avg: "$categories.free_wifi"},
                count: {$sum: 1}
            }
        }
    ]).toArray()

    const reviews = await reviewCollection.aggregate([
        {
            $lookup: {
                from: 'guest',
                localField: 'guest_id',
                foreignField: '_id',
                as: 'guest_info'
            }
        },
        {
            $unwind: '$guest_info'
        },
        {
            $sort: {score: -1}
        },
        {
            $limit: 10
        }
    ]).toArray()

    console.log(summary)
    console.log(reviews)

    res.render('review', {data: {summary: summary[0], reviews: reviews}})
})

router.post('/', async (req,res) => {
    const {topic, sort} = req.body

    await client.connect()
    const db = client.db("Hotel")
    const reviewCollection = db.collection('review')

    const matchStage = topic ? {topics: topic} : {}
    const sortStage = sort === 'date' ? {date: -1} : {score: -1}

    const summary = await reviewCollection.aggregate([
        {
            $group: {
                _id: null,
                avgScore: {$avg: "$score"},
                avgStaff: {$avg: "$categories.staff"},
                avgFacilities: {$avg: "$categories.facilities"},
                avgCleanliness: {$avg: "$categories.cleanliness"},
                avgComfort: {$avg: "$categories.comfort"},
                avgValueForMoney: {$avg: "$categories.value_for_money"},
                avgLocation: {$avg: "$categories.location"},
                avgFreeWifi: {$avg: "$categories.free_wifi"},
                count: {$sum: 1}
            }
        }
    ]).toArray()

    const reviews = await reviewCollection.aggregate([
        {
            $match: matchStage
        },
        {
            $lookup: {
                from: 'guest',
                localField: 'guest_id',
                foreignField: '_id',
                as: 'guest_info'
            }
        },
        {
            $unwind: '$guest_info'
        },
        {
            $sort: sortStage
        },
        {
            $limit: 10
        }
    ]).toArray();

    res.render('review', {data: {summary: summary[0], reviews: reviews}})
})

export default router