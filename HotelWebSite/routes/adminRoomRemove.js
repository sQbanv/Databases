import express from "express"
import {MongoClient} from "mongodb"

const router = express.Router()

const client = new MongoClient('mongodb://127.0.0.1:27017')

router.post('/', async (req,res) => {
    const {room_number} = req.body

    console.log(room_number)

    await client.connect()
    const db = client.db("Hotel")
    const roomCollection = db.collection("room")

    const result = await roomCollection.deleteOne({room_number: parseInt(room_number)})

    if (result.deletedCount === 1) {
        res.send('Room deleted successfully')
    } else {
        res.send('Room not found')
    }
})

export default router