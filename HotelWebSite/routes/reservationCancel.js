import express from "express"
import {MongoClient, ObjectId} from "mongodb"

const router = express.Router()

const client = new MongoClient('mongodb://127.0.0.1:27017')

router.post('/', async (req,res) => {
    const {reservation, dateFrom, dateTo} = req.body

    console.log(req.body)

    const currDate = new Date().toISOString()

    if(currDate >= dateTo){
        res.send("It's no longer available to cancel this reservation")
    } else {
        try{
            await client.connect()
            const db = client.db("Hotel")
            const reservationCollection = db.collection('reservation')
    
            const result = await reservationCollection.updateOne(
                { _id: new ObjectId(reservation) },
                { $set: {status: 'canceled', updated_at: currDate}}
            )
    
            res.render("reservationUpdate", {data: {message: "Reservation canceled successfully"}})
        } catch(error){
            console.error("Error adding reservation:", error);
            res.status(500).send("Internal Server Error");
        }
    }
})

export default router