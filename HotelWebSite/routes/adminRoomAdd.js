import express from "express"
import {MongoClient} from "mongodb"

const router = express.Router()

const client = new MongoClient('mongodb://127.0.0.1:27017')

router.post('/', async (req,res) => {
    const {room_number, price, capacity, area, include, features} = req.body

    console.log(req.body)

    const formattedInclude = include.split(',').map(item => {
        const [key, value] = item.split(' ');
        return { [key]: parseInt(value) };
    });
    const formattedFeatures = features.split(',')

    console.log(formattedFeatures,formattedInclude)

    try{
        await client.connect()
        const db = client.db("Hotel")
        const roomCollection = db.collection("room")

        const room = await roomCollection.findOne({room_number: parseInt(room_number)})

        if(!room){
            const newRoom = {
                room_number: parseInt(room_number),
                price: parseFloat(price),
                capacity: parseInt(capacity),
                area: parseInt(area),
                include: formattedInclude,
                features: formattedFeatures
            }

            await roomCollection.insertOne(newRoom)

            res.send('Room added successfully')
        } else {
            res.send('Room number already exists')
        }
    } catch(error){
        console.error("Error adding room:", error)
        res.status(500).send("Internal Server Error")
    }
})

export default router