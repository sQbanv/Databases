import express from "express"
import {MongoClient} from "mongodb"

const router = express.Router()

const client = new MongoClient('mongodb://127.0.0.1:27017')

router.get('/', async (req,res) => {
    await client.connect()
    const db = client.db("Hotel")
    const roomCollection = db.collection("room")
    const rooms = await roomCollection.find().toArray()

    console.log(rooms)

    res.render('adminRoom', {data: {rooms: rooms}})
})

export default router