import express from "express";
import mongoose from "mongoose";
import Expense, { categories } from "../models/Expense.js";

const router = express.Router();

function validateExpense(body) {
  const { title, amount, category, date } = body;
  if (!title || !String(title).trim()) return "Title is required.";
  if (amount === "" || amount === undefined || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
    return "Amount must be greater than 0.";
  }
  if (!categories.includes(category)) return "Choose a valid category.";
  if (!date || Number.isNaN(new Date(date).getTime())) return "A valid date is required.";
  return null;
}

// GET /api/expenses?category=Food
router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category && req.query.category !== "All") {
      if (!categories.includes(req.query.category)) {
        return res.status(400).json({ message: "Invalid category." });
      }
      filter.category = req.query.category;
    }
    const expenses = await Expense.find(filter).sort({ date: -1, createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    next(error);
  }
});

// POST /api/expenses
router.post("/", async (req, res, next) => {
  try {
    const message = validateExpense(req.body);
    if (message) return res.status(400).json({ message });
    const expense = await Expense.create({
      title: String(req.body.title).trim(),
      amount: Number(req.body.amount),
      category: req.body.category,
      date: new Date(req.body.date)
    });
    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
});

// PUT /api/expenses/:id
router.put("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Expense not found." });
    }
    const message = validateExpense(req.body);
    if (message) return res.status(400).json({ message });
    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        title: String(req.body.title).trim(),
        amount: Number(req.body.amount),
        category: req.body.category,
        date: new Date(req.body.date)
      },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Expense not found." });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/expenses/:id
router.delete("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Expense not found." });
    }
    const deleted = await Expense.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Expense not found." });
    res.json({ message: "Expense deleted successfully." });
  } catch (error) {
    next(error);
  }
});

export default router;
