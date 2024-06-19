import { MongoClient } from "mongodb";

const client = new MongoClient('mongodb://127.0.0.1:27017')

async function cancelPendingReservations() {
    try {
        await client.connect()
        const db = client.db("Hotel")
        const reservationCollection = db.collection('reservation')

        const currentDate = new Date().toISOString();
        
        const result = await reservationCollection.updateMany(
            { 
                status: "pending",
                check_in: { $lt: currentDate }
            },
            { $set: { status: "canceled" } }
        )

        console.log(`Updated ${result.modifiedCount} pending reservations to canceled.`);

    } catch (error) {
        console.error("Error canceling pending reservations:", error);
    }
}

export default cancelPendingReservations