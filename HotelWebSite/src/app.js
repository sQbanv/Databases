import express from "express"
import morgan from "morgan"
import cron from "node-cron"

import cancelPendingReservations from './cancelPendingReservations.js'

import indexRouter from "../routes/index.js"
import roomsRouter from "../routes/rooms.js"
import reviewsRouter from "../routes/reviews.js"
import reservationRouter from "../routes/reservation.js"
import addReviewRouter from "../routes/addReview.js"
import reservationGuestDataRouter from '../routes/reservationGuestData.js'
import reservationResultRouter from '../routes/reservationResult.js'
import reservationCancel from "../routes/reservationCancel.js"
import reservationPay from "../routes/reservationPay.js"
import reservationInfoRouter from '../routes/reservationInfo.js'
import reservationDetailsRouter from '../routes/reservationDetails.js'
import adminRouter from '../routes/admin.js'  
import adminReservationRouter from '../routes/adminReservation.js'
import adminRoomRouter from '../routes/adminRoom.js'
import adminFoodRouter from '../routes/adminFood.js'
import adminRoomRemoveRouter from '../routes/adminRoomRemove.js'
import adminFoodRemoveRouter from '../routes/adminFoodRemove.js'
import adminRoomAddRouter from '../routes/adminRoomAdd.js'
import adminFoodAddRouter from '../routes/adminFoodAdd.js'

const app = express()

app.set('views', './views')
app.set('view engine', 'pug')

app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))

app.use('/', indexRouter)
app.use('/rooms', roomsRouter)
app.use('/reviews', reviewsRouter)
app.use('/reservation', reservationRouter)
app.use('/addReview', addReviewRouter)
app.use('/reservation/guestData', reservationGuestDataRouter)
app.use('/reservation/result', reservationResultRouter)
app.use('/reservation/cancel', reservationCancel)
app.use('/reservation/pay', reservationPay)
app.use('/reservationInfo', reservationInfoRouter)
app.use('/reservationInfo/details', reservationDetailsRouter)
app.use('/admin', adminRouter)
app.use('/admin/reservation', adminReservationRouter)
app.use('/admin/room', adminRoomRouter)
app.use('/admin/food', adminFoodRouter)
app.use('/admin/roomRemove', adminRoomRemoveRouter)
app.use('/admin/foodRemove', adminFoodRemoveRouter)
app.use('/admin/roomAdd', adminRoomAddRouter)
app.use('/admin/foodAdd', adminFoodAddRouter)

// O północy wykona pewne zadania na bazie danych
cron.schedule("0 0 * * *", () => {
    console.log('Running cron job to cancel pending reservations');
    cancelPendingReservations();
});

app.listen(8000, () => {
    console.log('The server was started on port 8000');
    console.log('To stop the server, press "CTRL + C"');
})