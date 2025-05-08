import express from "express";
import { Success, SomethingWentWrong, BadRequest } from "../shared/utils.mjs";
import {
  getIngredients,
  addNewIngredient,
  seedAllIngredients,
} from "./services/recipeHelperServices.mjs";
import { logger } from "../shared/logger.mjs";
import { ingredientsToBeSeeded } from "../seeder/ingredientSeeder.mjs";

const ingredientRouter = express.Router();

ingredientRouter.post("/addNewIngredient", async (req, res, next) => {
  try {
    const { name, category, tags } = req.body;
    if (!name || !category) {
      return BadRequest(res, "Name & Category is required.");
    }

    const newIngredientAdded = await addNewIngredient(name, category, tags);

    return Success(res, newIngredientAdded, "New ingredient added.");
  } catch (err) {
    logger.error("Something went wrong %s", err);
    return SomethingWentWrong(res);
  }
});

ingredientRouter.post("/getIngredient", async (req, res, next) => {
  try {
    const { id, name } = req.body;

    const ingredientsFetched = await getIngredients(id, name);
    
    return Success(res, ingredientsFetched, "Fetched Ingredients.");
  } catch (err) {
    logger.error("Something went wrong %s", err);
    return SomethingWentWrong(res);
  }
});

// TODO: Seeding should have extra authentication.
ingredientRouter.post("/seedAllIngredients", async (req, res, next) => {
  try {
    await seedAllIngredients(ingredientsToBeSeeded);
  } catch (err) {
    logger.error("Something went wrong %s", err);
    return SomethingWentWrong(res);
  }
});

export { ingredientRouter };
