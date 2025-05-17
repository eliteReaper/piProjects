export enum LoadingStateType {
  IDLE,
  LOADING_INGREDIENT_EDIT,
  LOADING_INGREDIENT_ADD_EDIT,
  LOADING_INGREDIENT_LIST,
  LOADING_RECIPES_LIST,
  LOADING_RECIPE_EDIT,
  LOADING_RECIPE_ADD,
  LOADING_RECIPE_DELETE
};

export interface Ingredient {
  ingredientId?: string;
  name: string;
  category: string;
  countOfRecipesUsedIn?: number;
  tags?: string[];
}

interface IngredientRequired {
  id: string;
  label: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  recipeId?: string;
  name: string;
  ingredientsRequired: IngredientRequired[];
  steps: string[];
  servings: number;
  category: string;
  tags?: string[];
}

export interface CategoryAndLabel {
  category: string;
  label: string;
}

export interface ServerResponse<T> {
  message: string;
  flag: boolean;
  payload: T;
}

export interface GetIngredientRequest {
    ingredientId?: string;
}
