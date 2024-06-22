const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const TransactionModel = require("./ApiData");
const cors = require("cors");



const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
})

app.get("/", (req, res) => {
  
  res.send({
    status: 200,
    message : "Server running without errors"
  })
})


app.get("/initialize_db", async(req, res) => {
  const response = await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json")
  const transactions = response.data;
  
  transactions.forEach(async (transaction) => {
    const newTransaction = new TransactionModel({
      productId:transaction.id,
      productTitle:transaction.title,
      productPrice:transaction.price,
      productDescription:transaction.description,
      productCategory:transaction.category,
      productImage:transaction.image,
      productSold:transaction.sold,
      dateOfSale: transaction.dateOfSale,
    });
    try {
      await newTransaction.save();
    }
    catch (err) {
      
      console.log(err)
    }
  })
  return res.send("Database initialzed with Transactions");
})



const MONGO_URI = `mongodb+srv://ManiPoorna:manipoorna@cluster0.gkutk5n.mongodb.net/roxilerData`


mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDb Connection Established"))
  .catch((err) => console.log(err))

const db = mongoose.connection
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB Atlas");
});


app.get("/gettransactions", async (req, res) => {
  try {
    const transactions = await TransactionModel.find();
    res.json(transactions);
    return res.send({
      status: 200,
      data: transactions,
    })
  } catch (error) {
    console.error("Error retrieving transactions:", error.message);
    
  }
});


app.get("/gettransactions/:month", async (req, res) => {
  try {
    const transactions = await TransactionModel.find();
 
    const month = req.params.month;
    if (month === "all") {
      return res.send({
        status: 200,
        data: transactions,
        monthDetails: {
          type: typeof month,
          month: month
        }
      })
    }
    let data = transactions.filter((transaction) => {
      let date = transaction.dateOfSale.toISOString().split("-")[1];

      if (date === month) {
        return transaction;
      }
    })
    return res.send({
      status: 200,
      data: data,
      monthDetails: {
        type: typeof month,
        month : month
      }
    })
  } catch (error) {
    console.error(`Error retrieving transactions for month:`, error.message);
    
  }
});