export interface Ingredient {
  ingredientId: string;
  name: string;
  category: string;
  countOfRecipesUsedIn: number;
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
