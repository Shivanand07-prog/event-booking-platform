const Booking = require("../models/Booking");
const Event = require("../models/Event");

const createBooking = async (req, res) => {
    const {eventId, seats} = req.body;
    const event = await Event.findById(eventId);

    if(!event){
        return res.status(404).json({
            message: "Event not found"
        });
    }
    if(seats > event.availableSeats){
        return res.status(400).json({
            message: "Not enough seats available"
        });
    }
    const totalAmount = event.price * seats;
    const booking = await Booking.create({
        user: req.user._id,
        event: eventId,
        seats,
        totalAmount
    });
    event.availableSeats -= seats;

    await event.save();

    return res.status(201).json({
        message: "Booking created successfully",
        booking
    });
};
const getMyBookings = async (req, res) => {
    const bookings = await Booking.find({
        user: req.user._id
    });

    if(bookings.length === 0){
        return res.status(404).json({
            message: "No Bookings Done"
        });
    }
    return res.status(200).json({
        bookings
    })

};
const cancelBooking = async (req, res) => {

    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
        return res.status(404).json({
            message: "Booking not found"
        });
    }

    if(booking.user.toString() !== req.user._id.toString()){
        return res.status(403).json({
            message: "You are not allowed to cancel this booking"
        });
    }
    if(booking.status === "cancelled"){
        return res.status(400).json({
            message: "Booking is already cancelled"
        });
    }

    booking.status = "cancelled";

    await booking.save();

    const event = await Event.findById(booking.event);
    if(!event){
        return res.status(404).json({
            message: "Event not found"
        });
    }
    event.availableSeats += booking.seats;
    await event.save();

    return res.status(200).json({
        message: "Cancelletion done"
    })

};
const getEventBookings = async (req, res) => {
    const {eventId} = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
        return res.status(404).json({
            message: "Event not found"
        });
    }

    if(event.organizer.toString() !== req.user._id.toString()){
        return res.status(403).json({
            message: "You are not allowed to view bookings for this event"
        });
    }
    const bookings = await Booking.find({
        event: eventId
    });
    return res.status(200).json({
        bookings
    });
}
module.exports = { createBooking, getMyBookings, cancelBooking, getEventBookings};