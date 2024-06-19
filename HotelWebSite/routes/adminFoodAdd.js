import express from "express"
import {MongoClient} from "mongodb"

const router = express.Router()

const client = new MongoClient('mongodb://127.0.0.1:27017')

router.post('/', async (req,res) => {
    const {type, name, description, price} = req.body

    console.log(req.body)

    try {
        await client.connect()
        const db = client.db("Hotel")
        const foodCollection = db.collection("food")

        const food = await foodCollection.findOne({ type: type })

        if (!food) {
            const newFood = {
                name: name,
                description: description,
                type: type,
                price: parseFloat(price)
            }
    
            await foodCollection.insertOne(newFood)

            res.send('Food added successfully')
        } else {
            res.send('Food type already exists')
        }
    } catch (error) {
        console.error("Error adding food:", error)
        res.status(500).send("Internal Server Error")
    }
})

export default router