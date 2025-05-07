import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { logger } from "./shared/logger.mjs";
import { ingredientRouter } from "./routes/ingredientRoutes.mjs";
import { recipeRouter } from "./routes/recipeRoutes.mjs";
import { requestInterceptor } from "./routes/middlewares/requestInterceptor.mjs";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestInterceptor);
// TODO: Put in request authenticator.
app.use(ingredientRouter);
app.use(recipeRouter);

const startServer = async () => {
  try {
    logger.info("Starting server...");
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info("Database connected.");

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    logger.error("Some error occurred during database connection %s", err);
  }
};

startServer();
