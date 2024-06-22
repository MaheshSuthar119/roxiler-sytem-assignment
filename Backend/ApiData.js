const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ApiData = new schema({
  productId: Number,
  productTitle: String,
  productPrice: Number,
  productDescription: String,
  productCategory : String,
  productImage: String,
  productSold : Boolean,
  dateOfSale: Date,
})

const TransactionModel = mongoose.model("data", ApiData);
module.exports = TransactionModel;