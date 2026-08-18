const express = require("express");
const router = express.Router();

const {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
} = require("../controllers/categoryController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// Anyone can view categories
router.get("/", getCategories);

// Only admin can create categories
router.post("/", protect, admin, createCategory);

// Only admin can update categories
router.put("/:id", protect, admin, updateCategory);

// Only admin can delete categories
router.delete("/:id", protect, admin, deleteCategory);

module.exports = router;