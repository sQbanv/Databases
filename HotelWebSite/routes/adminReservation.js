import express from "express"
import {MongoClient} from "mongodb"

const router = express.Router()

const client = new MongoClient('mongodb://127.0.0.1:27017')

router.get('/', async (req,res) => {
    const monthYear = req.query.date

    if(!validateYearMonth(monthYear)){
        res.send("Invalid month format: YYYY-MM")
        return
    }

    let startDate = new Date(monthYear + '-01')
    let endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1))

    startDate = startDate.toISOString()
    endDate = endDate.toISOString()

    console.log(monthYear,startDate,endDate)

    try{
        await client.connect()
        const db = client.db('Hotel')
        const reservationCollection = db.collection('reservation')

        const monthlyAggregation = await reservationCollection.aggregate([
            {
                $match: {
                    status: "confirmed",
                    check_in: {
                        $gte: startDate,
                        $lt: endDate
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total_price: { $sum: "$total_price" },
                    reservations: { $push: "$$ROOT" }
                }
            },
            {
                $project: {
                    _id: 0,
                    total_price: 1,
                    reservations: 1
                }
            }
        ]).toArray();

        if (monthlyAggregation.length > 0) {
            const monthlySummary = monthlyAggregation[0];
            console.log(monthlySummary);
            res.render('adminReservation', { data: { monthYear, total_price: monthlySummary.total_price, reservations: monthlySummary.reservations } });
        } else {
            console.log('No reservations found for the specified month.');
            res.render('adminReservation', { data: { monthYear, total_price: 0, reservations: [] } });
        }
    } catch(error){
        console.error("Error adding review:", error);
        res.status(500).send("Internal Server Error");
    }
})

function validateYearMonth(yearMonth) {
    const yearMonthRegex = /^\d{4}-\d{2}$/;
    if (!yearMonthRegex.test(yearMonth)) {
        return false;
    }

    return true;
}

export default router