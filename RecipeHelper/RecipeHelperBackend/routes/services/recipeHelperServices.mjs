import { randomBytes } from "crypto";
import {
  Ingredient,
  supportedCategories as supportedIngredientCategories,
} from "../../models/ingredient.mjs";
import {
  Recipe,
  supportedRecipeCategoriesAndLabel,
} from "../../models/recipe.mjs";

// -------------------- Ingredient Services ------------------------
const addNewIngredient = async (name, category, tags) => {
  if (supportedIngredientCategories.findIndex(category.toUpperCase()) === -1) {
    throw new Error("Category not supported.");
  }
  const newIngredient = new Ingredient({
    ingredientId: randomBytes(16).toString("hex"),
    name,
    category: category.toUpperCase(),
    tags: tags ?? [],
  });
  return await newIngredient.save();
};

const getIngredients = async (id, name) => {
  if (id) {
    return await Ingredient.find({ ingredientId: id });
  }
  if (name) {
    return await Ingredient.find({ name: { $regex: name, $options: "i" } });
  }
  return await Ingredient.find({});
};

const seedAllIngredients = async (ingredients) => {
  const existingIngredients = await Ingredient.find({});
  if (existingIngredients.length > 0) {
    throw new Error("Ingredients already seeded.");
  }
  const newIngredients = ingredients.map((ingredient) => ({
    ...ingredient,
    ingredientId: randomBytes(16).toString("hex"),
  }));
  return await Ingredient.insertMany(newIngredients);
};

// -------------------- Recipe Services ------------------------
const addNewRecipe = async (
  name,
  ingredientsRequired,
  steps,
  servings,
  category,
  tags
) => {
  // TODO: Validate ingredientsRequired ids and category also.
  const newRecipe = new Recipe({
    recipeId: randomBytes(16).toString("hex"),
    name,
    ingredientsRequired,
    steps,
    servings,
    category: category.toUpperCase(),
    tags: tags ?? [],
  });

  return await newRecipe.save();
};

const getRecipe = async (name) => {
  if (name) {
    return await Recipe.find({ name: { $regex: name, $options: "i" } });
  }
  return await Recipe.find({});
};

const getRecipeCategoriesAndLabels = async () => {
  return supportedRecipeCategoriesAndLabel;
};

export {
  addNewIngredient,
  getIngredients,
  seedAllIngredients,
  addNewRecipe,
  getRecipe,
  getRecipeCategoriesAndLabels,
};
