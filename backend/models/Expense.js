import mongoose from "mongoose";

const categories = ["Food", "Travel", "Shopping", "Bills", "Other"];

const expenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 80 },
    amount: { type: Number, required: true, min: 0.01 },
    category: { type: String, required: true, enum: categories },
    date: { type: Date, required: true }
  },
  { timestamps: true }
);

export { categories };
export default mongoose.model("Expense", expenseSchema);
