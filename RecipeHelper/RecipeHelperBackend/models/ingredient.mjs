import mongoose from "mongoose";

// Supported Categories
const supportedCategories = [
  "UNKNOWN",
  "DAIRY",
  "SPICE",
  "VEGETABLE",
  "FRUIT",
  "MEAT",
  "GRAIN",
  "NUT",
  "SEED",
  "LEGUME",
  "HERB",
  "CONDIMENT",
  "OIL",
  "SAUCE",
];

const Schema = new mongoose.Schema({
  ingredientId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: supportedCategories,
  },
  tags: {
    type: [String],
    default: [],
  },
  countOfRecipesUsedIn: {
    type: Number,
    default: 0,
  }
});

const Ingredient = mongoose.model("Ingredient", Schema);

export { Ingredient, supportedCategories };
