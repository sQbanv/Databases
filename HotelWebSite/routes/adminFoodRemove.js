import express from "express"
import {MongoClient} from "mongodb"

const router = express.Router()

const client = new MongoClient('mongodb://127.0.0.1:27017')

router.post('/', async (req,res) => {
    const {type} = req.body

    console.log(type)

    await client.connect()
    const db = client.db("Hotel")
    const foodCollection = db.collection("food")

    const result = await foodCollection.deleteOne({type: type})

    if (result.deletedCount === 1) {
        res.send('Food deleted successfully')
    } else {
        res.send('Food not found')
    }
})

export default router