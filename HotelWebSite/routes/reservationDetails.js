import express from "express"
import {MongoClient, ObjectId} from "mongodb"

const router = express.Router()

const client = new MongoClient('mongodb://127.0.0.1:27017')

router.post('/', async (req,res) => {
    const {token, email} = req.body

    console.log(token)

    try{    
        await client.connect()
        const db = client.db("Hotel")
        const reservationCollection = db.collection('reservation') 
        const guestCollection = db.collection('guest')

        const guest = await guestCollection.findOne({email})

        console.log(guest)

        if(!guest){
            return res.status(400).send("Guest with provided email not found")
        }

        const reservation = await reservationCollection.findOne({_id: new ObjectId(token)})

        console.log(reservation)

        if(!reservation){
            return res.status(400).send("Reservation with provided token not found")
        }
        
        const reservationGuests = reservation.guests.map(id => id.toString())

        if(!reservationGuests.includes(guest._id.toString())){
            return res.status(400).send("User is not assigned to this reservation")
        }

        const reservationFullInfo = await reservationCollection.aggregate([
            {
                $match:{
                    _id: new ObjectId(token)
                }
            },
            {
              '$lookup': {
                'from': 'guest', 
                'localField': 'guests', 
                'foreignField': '_id', 
                'as': 'guests_info'
              }
            }, {
              '$lookup': {
                'from': 'room', 
                'localField': 'rooms', 
                'foreignField': 'room_number', 
                'as': 'rooms_info'
              }
            }, {
              '$lookup': {
                'from': 'food', 
                'localField': 'food_type', 
                'foreignField': 'type', 
                'as': 'food_info'
              }
            }, {
                '$lookup': {
                'from': 'review', 
                'localField': '_id', 
                'foreignField': 'reservation_id', 
                'as': 'reviews'
              }
            }
          ]).toArray()


        console.log(reservationFullInfo[0])
        res.render('reservationDetails', {data: {reservationId: token, reservationFullInfo: reservationFullInfo[0]}})
    } catch(error){
        console.error("Error showing reservation details:", error);
        res.status(500).send("Internal Server Error");
    }
})

export default router