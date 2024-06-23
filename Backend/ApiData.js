const mongoose = require("mongoose");
const { Schema } = mongoose;

const ApiDataSchema = new Schema({
  productId: {
    type: Number,
    required: true,
    unique: true,
  },
  productTitle: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  productCategory: {
    type: String,
    required: true,
  },
  productImage: {
    type: String,
    required: true,
  },
  productSold: {
    type: Boolean,
    required: true,
  },
  dateOfSale: {
    type: Date,
    required: true,
  },
});

// Specifying a collection name
const TransactionModel = mongoose.model("Transaction", ApiDataSchema, "transactions");

module.exports = TransactionModel;
