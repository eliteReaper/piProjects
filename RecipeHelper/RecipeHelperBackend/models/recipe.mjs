import mongoose from "mongoose";

const supportedRecipeCategoriesAndLabel = [
  { category: "UNKNOWN", label: "Unknown" },
  { category: "NON_VEG", label: "Non Veg" },
  { category: "VEGETARIAN", label: "Vegetarian" },
  { category: "VEGAN", label: "Vegan" },
  { category: "GLUTEN_FREE", label: "Gluten Free" },
  { category: "DAIRY_FREE", label: "Dairy Free" },
  { category: "BREAKFAST", label: "Breakfast" },
  { category: "LUNCH", label: "Lunch" },
  { category: "DINNER", label: "Dinner" },
  { category: "SNACK", label: "Snack" },
  { category: "DESSERT", label: "Dessert" },
  { category: "SOUP", label: "Soup" },
  { category: "SALAD", label: "Salad" },
  { category: "APPETIZER", label: "Appetizer" },
  { category: "MAIN_COURSE", label: "Main Course" },
  { category: "STREET_FOOD", label: "Street Food" },
  { category: "BIRYANI", label: "Biryani" },
  { category: "INDIAN_TRADITIONAL", label: "Indian Traditional" },
  { category: "FUSION", label: "Fusion" },
  { category: "KETO", label: "Keto Friendly" },
  { category: "HIGH_PROTEIN", label: "High Protein" },
  { category: "LOW_CARB", label: "Low Carb" },
  { category: "CONTINENTAL", label: "Continental" },
  { category: "ASIAN", label: "Asian" },
  { category: "SOUTH_INDIAN", label: "South Indian" },
  { category: "NORTH_INDIAN", label: "North Indian" },
  { category: "CHINESE", label: "Chinese" },
  { category: "THAI", label: "Thai" },
  { category: "JAPANESE", label: "Japanese" },
  { category: "ITALIAN", label: "Italian" },
  { category: "MEXICAN", label: "Mexican" },
  { category: "MEDITERRANEAN", label: "Mediterranean" },
  { category: "MIDDLE_EASTERN", label: "Middle Eastern" },
  { category: "AMERICAN", label: "American" },
  { category: "FRENCH", label: "French" },
  { category: "KOREAN", label: "Korean" },
  { category: "AFRICAN", label: "African" },
  { category: "TIBETAN", label: "Tibetan" },
  { category: "LEBANESE", label: "Lebanese" },
  { category: "SPANISH", label: "Spanish" },
  { category: "CARIBBEAN", label: "Caribbean" },
];

const Schema = new mongoose.Schema({
  recipeId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  ingredientsRequired: {
    type: [{ id: String, label: String, quantity: Number, unit: String }],
    required: true,
  },
  steps: {
    type: [String],
    required: true,
  },
  servings: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: supportedRecipeCategoriesAndLabel.map(
      (categoryAndLabel) => categoryAndLabel.category
    ),
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
});

const Recipe = mongoose.model("Recipe", Schema);

export { Recipe, supportedRecipeCategoriesAndLabel };
