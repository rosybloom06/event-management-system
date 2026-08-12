const Booking = require("../models/Booking");
const Event = require("../models/Event");
const createBooking = async (req, res) => {
    try {
        const { eventId } = req.body;

        // Check if event exists
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        // Check if user already booked this event
        const existingBooking = await Booking.findOne({
            user: req.user.id,
            event: eventId,
            status: "confirmed"
        });

        if (existingBooking) {
            return res.status(400).json({
                message: "You have already booked this event"
            });
        }

        // Create booking
        const booking = await Booking.create({
            user: req.user.id,
            event: eventId,
            status: "pending"
        });

        res.status(201).json({
            message: "Event booked successfully",
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to book event",
            error: error.message
        });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            user: req.user.id
        })
            .populate("event")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: bookings.length,
            bookings
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch bookings",
            error: error.message
        });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        // Make sure the booking belongs to the logged-in user
        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not allowed to cancel this booking"
            });
        }

        booking.status = "cancelled";
        await booking.save();

        res.status(200).json({
            message: "Booking cancelled successfully",
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to cancel booking",
            error: error.message
        });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("user", "name email")
            .populate("event", "title date location");

        res.status(200).json({
            count: bookings.length,
            bookings
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch bookings",
            error: error.message
        });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "Status must be approved or rejected"
            });
        }

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        booking.status = status;

        await booking.save();

        res.status(200).json({
            message: `Booking ${status} successfully`,
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update booking status",
            error: error.message
        });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    cancelBooking,
    getAllBookings,
    updateBookingStatus
};