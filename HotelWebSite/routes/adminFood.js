import express from "express"
import {MongoClient} from "mongodb"

const router = express.Router()

const client = new MongoClient('mongodb://127.0.0.1:27017')

router.get('/', async (req,res) => {
    await client.connect()
    const db = client.db("Hotel")
    const foodCollection = db.collection("food")
    const foods = await foodCollection.find().toArray()

    console.log(foods)

    res.render('adminFood', {data: {foods: foods}})
})

export default router