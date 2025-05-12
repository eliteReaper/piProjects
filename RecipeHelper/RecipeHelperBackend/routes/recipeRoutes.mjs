import express from "express";
import { Success, SomethingWentWrong, BadRequest } from "../shared/utils.mjs";
import { addNewRecipe, getRecipe, getRecipeCategoriesAndLabels, updateRecipe } from "./services/recipeHelperServices.mjs";
import { logger } from "../shared/logger.mjs";

const recipeRouter = express.Router();

recipeRouter.post("/updateRecipe", async (req, res, next) => {
  try {
    const { recipeId,  name, ingredientsRequired, steps, servings, category, tags } =
      req.body;
    if (!recipeId || !name || !ingredientsRequired || !steps || !servings || !category) {
      return BadRequest(
        res,
        "Name, Ingredients Required, Servings, Steps and Category are required."
      );
    }

    const updatedRecipe = await updateRecipe(
      recipeId,
      name,
      ingredientsRequired,
      steps,
      servings,
      category,
      tags
    );

    return Success(res, [updatedRecipe], "Recipe Updated added.");
  } catch (err) {
    logger.error("Something went wrong %s", err);
    return SomethingWentWrong(res);
  }
});

recipeRouter.post("/addNewRecipe", async (req, res, next) => {
  try {
    const { name, ingredientsRequired, steps, servings, category, tags } =
      req.body;
    if (!name || !ingredientsRequired || !steps || !servings || !category) {
      return BadRequest(
        res,
        "Name, Ingredients Required, Servings, Steps and Category are required."
      );
    }

    const newRecipeAdded = await addNewRecipe(
      name,
      ingredientsRequired,
      steps,
      servings,
      category,
      tags
    );

    return Success(res, [newRecipeAdded], "New recipe added.");
  } catch (err) {
    logger.error("Something went wrong %s", err);
    return SomethingWentWrong(res);
  }
});

recipeRouter.post("/getRecipe", async (req, res, next) => {
  try {
    const { name } = req.body;

    const recipesFetched = await getRecipe(name);

    return Success(res, recipesFetched, "Recipes fetched.");
  } catch (err) {
    logger.error("Something went wrong %s", err);
    return SomethingWentWrong(res);
  }
});

recipeRouter.post("/getRecipeCategoriesAndLabels", async (req, res, next) => {
  try {
    const recipeCategories = await getRecipeCategoriesAndLabels();

    return Success(res, recipeCategories, "Recipe Categories Fetched");
  } catch (err) {
    logger.error("Something went wrong %s", err);
    return SomethingWentWrong(res);
  }
})

export { recipeRouter };
