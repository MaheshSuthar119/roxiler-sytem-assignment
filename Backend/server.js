const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const TransactionModel = require("./ApiData");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send({
    status: 200,
    message: "Server running without errors",
  });
});

app.get("/initialize_db", async (req, res) => {
  try {
    const response = await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
    const transactions = response.data;

    const transactionDocs = transactions.map((transaction) => ({
      productId: transaction.id,
      productTitle: transaction.title,
      productPrice: transaction.price,
      productDescription: transaction.description,
      productCategory: transaction.category,
      productImage: transaction.image,
      productSold: transaction.sold,
      dateOfSale: new Date(transaction.dateOfSale),
    }));

    await TransactionModel.insertMany(transactionDocs);

    res.send("Database initialized with Transactions");
  } catch (err) {
    console.error("Error initializing database:", err.message);
    res.status(500).send("Error initializing database");
  }
});

const MONGO_URI = `mongodb+srv://ManiPoorna:manipoorna@cluster0.gkutk5n.mongodb.net/roxilerData`;

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connection Established"))
  .catch((err) => console.log(err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB Atlas");
});

app.get("/gettransactions", async (req, res) => {
  try {
    const transactions = await TransactionModel.find();
    res.json({ status: 200, data: transactions });
  } catch (error) {
    console.error("Error retrieving transactions:", error.message);
    res.status(500).send("Error retrieving transactions");
  }
});

app.get("/gettransactions/:month", async (req, res) => {
  try {
    const transactions = await TransactionModel.find();
    const month = req.params.month;

    if (month.toLowerCase() === "all") {
      return res.json({ status: 200, data: transactions });
    }

    const monthIndex = new Date(`${month} 1, 2021`).getMonth() + 1;
    const filteredTransactions = transactions.filter((transaction) => {
      return new Date(transaction.dateOfSale).getMonth() + 1 === monthIndex;
    });

    res.json({
      status: 200,
      data: filteredTransactions,
      monthDetails: {
        type: typeof month,
        month: month,
      },
    });
  } catch (error) {
    console.error(`Error retrieving transactions for month:`, error.message);
    res.status(500).send("Error retrieving transactions for the specified month");
  }
});
