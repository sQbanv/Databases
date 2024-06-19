import express from "express"
import {MongoClient} from "mongodb"

const router = express.Router()

const client = new MongoClient('mongodb://127.0.0.1:27017')

router.get('/', async (req,res) => {
    await client.connect()
    const db = client.db("Hotel")
    const hotelCollection = db.collection("hotel")
    const info = await hotelCollection.findOne()

    console.log(info)

    res.render('home', {data: info})
})

export default router