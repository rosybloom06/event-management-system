const express = require("express");

const router = express.Router();

const { createBooking, getMyBookings, cancelBooking, getAllBookings, updateBookingStatus } = require("../controllers/bookingController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.delete("/:id", protect, cancelBooking);
router.get("/all", protect, admin, getAllBookings);
router.put("/:id/status", protect, admin, updateBookingStatus);

module.exports = router;