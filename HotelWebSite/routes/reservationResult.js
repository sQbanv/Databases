import express from "express"
import {MongoClient} from "mongodb"

const router = express.Router()

const client = new MongoClient('mongodb://127.0.0.1:27017')

router.post('/', async (req,res) => {
    let {note, rooms, food, dateFrom, dateTo, count} = req.body

    const roomNumbers = Array.isArray(rooms) ? rooms.map(room => parseInt(room)) : [parseInt(rooms)];

    console.log(roomNumbers)

    try{
        await client.connect()
        const db = client.db("Hotel")
        const guestCollection = db.collection('guest')
        const roomCollection = db.collection('room')
        const reservationCollection = db.collection('reservation')
        const foodCollection = db.collection('food')

        const roomInfo = await roomCollection.aggregate([
            {
                $match: {
                    room_number: {$in: roomNumbers}
                }
            },
            {
                $group: {
                    _id: null,
                    capacity: {
                        $sum: "$capacity"
                    },
                    price_per_day: {
                        $sum: "$price"
                    }
                }
            }
        ]).toArray()

        if(roomInfo[0].capacity < count){
            res.send("Not enough rooms for guests in chosen rooms")
            return
        }

        let guestsIds = []
        let guestsInfo = []
        for(let i=1; i<=parseInt(count); i++){
            let email = req.body[`email_${i}`]
            let firstname = req.body[`first_name_${i}`]
            let lastname = req.body[`last_name_${i}`]
            let birthday = req.body[`birthday_${i}`]
            let address = req.body[`address_${i}`]
            let phone = req.body[`phone_${i}`]

            let guest = await guestCollection.findOne({email: email})

            if(!guest){
                if(!validateGuestData(email, firstname, lastname, birthday, address, phone)){
                    res.send("Invalid guest data")
                    return
                }

                let newGuest = {
                    email: email,
                    first_name: firstname,
                    last_name: lastname,
                    birthday: birthday,
                    address: address,
                    phone: phone
                }

                const result = await guestCollection.insertOne(newGuest)
                guestsIds.push(result.insertedId)
                guestsInfo.push(newGuest)
            } else{
                guestsIds.push(guest._id) 
                guestsInfo.push(guest)
            }

        }
        const getFoodType = await foodCollection.findOne({type: food})

        const days = getDays(dateFrom,dateTo)

        const total_price = roomInfo[0].price_per_day * days + getFoodType.price * days

        const currDate = new Date().toISOString()

        const newReservation = {
            guests: guestsIds,
            rooms: roomNumbers,
            check_in: dateFrom,
            check_out: dateTo,
            total_guests: parseInt(count),
            total_price: total_price,
            status: "pending",
            notes: note,
            create_at: currDate,
            updated_at: currDate,
            food_type: food
        }
        console.log(newReservation,guestsInfo)
        const result = await reservationCollection.insertOne(newReservation)

        console.log(result)
        console.log(result.insertedId)

        res.render('reservationResult', {data: {newReservation: newReservation, guests: guestsInfo, reservationId: result.insertedId.toString()}})
    } catch(error){
        console.error("Error adding reservation:", error);
        res.status(500).send("Internal Server Error");
    }
})

function validateGuestData(email, firstName, lastName, birthday, address, phone) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return false;
    }

    const phoneRegex = /^\+\d{1,3}\d{3,}$/;
    if (!phoneRegex.test(phone)) {
        return false;
    }

    const birthdayRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!birthdayRegex.test(birthday)) {
        return false;
    }

    if(firstName == "" || lastName == "" || address == ""){
        return false
    }

    return true;
}


function getDays(dateFrom, dateTo){
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    const difference = to - from;
    const days = difference / (1000 * 3600 * 24);
    return Math.ceil(days) + 1;
}

export default router