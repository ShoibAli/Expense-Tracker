const express = require("express");
const mongoose = require("mongoose");
const Expense = require("./database/database");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

// mongoose connection , "mongodb://127.0.0.1:27017/expensesDB"

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("Error in connection:", err.message));

app.get("/expenses", async (req, res) => {
  try {
    const allExpenses = await Expense.find({});
    res.status(200).json(allExpenses);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ message: "Error retrieving expenses" });
  }
});

app.post("/expenses", async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;
    const newExpense = new Expense({
      amount,
      category,
      description,
      date,
    });
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ message: "Error saving expense" });
  }
});

app.put("/expenses/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json(updatedExpense);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ message: "Error updating expense" });
  }
});

app.delete("/expenses/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedExpense = await Expense.findByIdAndDelete(id);
    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json({ message: "Expense successfully deleted" });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ message: "Error deleting expense" });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Expense Tracker API" });
});

// Server listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
