const Event = require("../models/Event");

const createEvent = async (req, res) => {

    const {
        title,
        description,
        category,
        date,
        time,
        venue,
        city,
        image,
        price,
        totalSeats
    } = req.body

    const event = await Event.create({
        title,
        description,
        category,
        date,
        time,
        venue,
        city,
        image,
        price,
        totalSeats,
        availableSeats: totalSeats,
        organizer: req.user._id
    });
    res.status(201).json({
        message: "Event created Successfully",
        event
    })
};
const getAllEvents = async (req, res) => {
    const {search, category, date, minPrice, maxPrice, city} = req.query;

    let dateFilter = {};
    if(date){
        const startDate = new Date(date);
        const endDate = new Date(date);

        endDate.setDate(endDate.getDate() + 1);

        dateFilter = {
            date: {
                $gte: startDate,
                $lt: endDate
            }
        };
    }

    let priceFilter = {};
    if(minPrice || maxPrice){
        priceFilter.price = {};
        if(minPrice){
            priceFilter.price.$gte = Number(minPrice);
        }
        if(maxPrice){
            priceFilter.price.$lte = Number(maxPrice);
        }
    }

    let cityFilter = {};
    if(city){
        cityFilter.city = {
            $regex: city,
            $options: "i"
        };
    }

    const events = await Event.find({
        $or: [
            {title: {$regex: search|| "", $options: "i"} },
            {category: {$regex: search || "", $options: "i"} },
            {city: {$regex: search || "", $options: "i"} }
        ],
        ...(category && { category: category }),
        ...dateFilter,
        ...priceFilter,
        ...cityFilter
    });
    return res.status(200).json({
        events
    });
};
const getEventById = async (req, res) => {

    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
        return res.status(404).json({
            message: "Event not found"
        });
    }

    return res.status(200).json({
        event
    });
};
const updateEvent = async (req, res) => {
    const {id} = req.params;
    const event = await Event.findById(id);

    if (!event) {
        return res.status(404).json({
            message: "Event not found"
        });
    }

    if(event.organizer.toString() !== req.user._id.toString()){
        return res.status(403).json({
            message: "You are not allowed to update this event"
        })
    }
    const updatedEvent = await Event.findByIdAndUpdate(
        id,
        req.body,
        {new: true}
    );
    return res.status(200).json({
        message: "Event Updated Successfully",
        event: updatedEvent
    })
};
const deleteEvent = async (req, res) => {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
        return res.status(404).json({
            message: "Event not found"
        });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            message: "You are not allowed to delete this event"
        });
    }

    const deletedEvent = await Event.findByIdAndDelete(id);

    return res.status(200).json({
        message: "Event deleted successfully",
        event: deletedEvent
    });
};
module.exports = {createEvent, getAllEvents, getEventById, updateEvent, deleteEvent};