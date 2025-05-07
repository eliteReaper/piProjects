import express from "express";
import { Success, SomethingWentWrong } from "../shared/utils.mjs";
import { addNewRecipe, getRecipe } from "./services/recipeHelperServices.mjs";
import { logger } from "../shared/logger.mjs";

const recipeRouter = express.Router();

recipeRouter.post("/addNewRecipe", async (req, res, next) => {
  try {
    const { name, ingredientsRequiredIds, steps, servings, category, tags } = req.body;
    if (!name || !ingredientsRequiredIds || !steps || !servings) {
      return BadRequest(
        res,
        "Name, Ingredients Required, Servings and Steps are required."
      );
    }

    const newRecipeAdded = await addNewRecipe(
      name,
      ingredientsRequiredIds,
      steps,
      servings,
      category,
      tags
    );

    return Success(res, newRecipeAdded, "New recipe added.");
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

export { recipeRouter };
