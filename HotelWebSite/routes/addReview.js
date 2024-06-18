import express from "express"
import {MongoClient, ObjectId} from "mongodb"

const router = express.Router()

const client = new MongoClient('mongodb://127.0.0.1:27017')

router.get('/', async (req,res) => {
    res.render('addReview')
})

router.post('/submit', async (req,res) => {
    const {email, token, topics, text, staff, facilities, cleanliness, comfort, value_for_money, location, free_wifi} = req.body

    console.log(req.body)

    try{
        await client.connect()
        const db = client.db("Hotel")
        const guestCollection = db.collection("guest")
        const reservationCollection = db.collection("reservation")
        const reviewCollection = db.collection("review")

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

        const score = parseFloat(((parseInt(staff) + parseInt(facilities) + parseInt(cleanliness) + parseInt(comfort) + parseInt(value_for_money) + parseInt(location) + parseInt(free_wifi)) / 7).toFixed(2))

        const currentDate = new Date().toISOString()

        const newReview = {
            guest_id: guest._id,
            categories: {
                staff: parseInt(staff),
                facilities: parseInt(facilities),
                cleanliness: parseInt(cleanliness),
                comfort: parseInt(comfort),
                value_for_money: parseInt(value_for_money),
                location: parseInt(location),
                free_wifi: parseInt(free_wifi)
            },
            topics: topics.split(',').map(topic => topic.trim()),
            date: currentDate,
            text: text,
            score: score,
            reservation_id: reservation._id
        };

        console.log(newReview)

        const result = await reviewCollection.insertOne(newReview)
        console.log(result)

        res.redirect('/reviews')
    } catch(error){
        console.error("Error adding review:", error);
        res.status(500).send("Internal Server Error");
    }
})

export default router





