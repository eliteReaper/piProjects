import { randomBytes } from "crypto";
import {
  Ingredient,
  supportedCategories as supportedIngredientCategories,
} from "../../models/ingredient.mjs";
import {
  Recipe,
  supportedRecipeCategoriesAndLabel,
} from "../../models/recipe.mjs";
import mongoose from "mongoose";
import { logger } from "../../shared/logger.mjs";

// -------------------- Ingredient Services ------------------------
const addNewIngredient = async (name, category, tags) => {
  const newIngredient = new Ingredient({
    ingredientId: randomBytes(16).toString("hex"),
    name,
    category: category.toUpperCase(),
    tags: tags ?? [],
  });

  return await newIngredient.save();
};

const getSupportedIngredientCategories = async () => {
  return supportedIngredientCategories;
}

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
const removeRecipe = async (recipeId) => {
  return await Recipe.findOneAndDelete( {recipeId} );
};

const updateRecipe = async (
  recipeId,
  name,
  ingredientsRequired,
  steps,
  servings,
  category,
  tags
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundRecipe = await Recipe.findOne({ recipeId });
    const originalIngredients = foundRecipe.ingredientsRequired;
    console.log(foundRecipe);
    await decrementIngredientCountsFor(originalIngredients);

    await incrementIngredientCountsFor(ingredientsRequired);

    const updatedRecipe = await Recipe.findOneAndUpdate(
      { recipeId },
      {
        name,
        ingredientsRequired,
        steps,
        servings,
        category,
        tags,
      },
      { new: true }
    );

    session.commitTransaction();

    return updatedRecipe;
  } catch (error) {
    await session.abortTransaction();
    logger.error("Error while updating recipe: %s", error);
    throw error;
  } finally {
    session.endSession();
  }
};

const addNewRecipe = async (
  name,
  ingredientsRequired,
  steps,
  servings,
  category,
  tags
) => {
  // TODO: Validate ingredientsRequired ids and category also.

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const newRecipe = new Recipe({
      recipeId: randomBytes(16).toString("hex"),
      name,
      ingredientsRequired,
      steps,
      servings,
      category: category.toUpperCase(),
      tags: tags ?? [],
    });

    await incrementIngredientCountsFor(ingredientsRequired);
  
    const savedRecipe = await newRecipe.save();
    await session.commitTransaction();

    return savedRecipe;
  } catch (error) {
    logger.error("Error while adding new recipe: %s", error);
    throw error;
  } finally {
    session.endSession();
  }
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

const decrementIngredientCountsFor = async (ingredients) => {
  await Ingredient.updateMany(
    { ingredientId: { $in: ingredients.map((ingredient) => ingredient.id) } },
    { $inc: { countOfRecipesUsedIn: -1 } }
  );
}

const incrementIngredientCountsFor = async (ingredients) => {
  await Ingredient.updateMany(
    { ingredientId: { $in: ingredients.map((ingredient) => ingredient.id) } },
    { $inc: { countOfRecipesUsedIn: 1 } },
  );
}

export {
  addNewIngredient,
  getIngredients,
  seedAllIngredients,
  addNewRecipe,
  getRecipe,
  getRecipeCategoriesAndLabels,
  updateRecipe,
  removeRecipe,
  getSupportedIngredientCategories,
};
