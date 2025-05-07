import mongoose from "mongoose";

const supportedRecipeCategories = ['UNKNOWN', 'NON_VEG', 'VEG']

const Schema = new mongoose.Schema({
    recipeId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    ingredientsRequiredIds: {
        type: [String],
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
        enum: supportedRecipeCategories,
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    }
});


const Recipe = mongoose.model("Recipe", Schema);

export { Recipe, supportedRecipeCategories }