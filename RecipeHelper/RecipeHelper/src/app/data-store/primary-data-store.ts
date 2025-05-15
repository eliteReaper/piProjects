import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Ingredient, Recipe } from '../shared/protos';
import { RecipeService } from '../services/recipe-service';
import { Observable, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IngredientService } from '../services/ingredient-services';

interface State {
  recipesLoaded: Recipe[];
  ingredientsLoaded: Ingredient[];
}

@Injectable({ providedIn: 'root' })
export class PrimaryDataStore extends ComponentStore<State> {
  private recipeService = inject(RecipeService);
  private ingredientService = inject(IngredientService);
  private snackbar = inject(MatSnackBar);

  constructor() {
    super({ recipesLoaded: [], ingredientsLoaded: [] });
  }

  readonly recipesLoaded = this.select(({ recipesLoaded }) => recipesLoaded);
  readonly ingredientsLoaded = this.select(
    ({ ingredientsLoaded }) => ingredientsLoaded
  );

  readonly setIngredientsLoaded = this.updater(
    (state, ingredientsLoaded: Ingredient[] | null) => ({
      ...state,
      ingredientsLoaded: ingredientsLoaded ?? [],
    })
  );

  readonly setRecipesLoaded = this.updater(
    (state, recipesLoaded: Recipe[] | null) => ({
      ...state,
      recipesLoaded: recipesLoaded ?? [],
    })
  );

  readonly loadRecipe = this.updater(
    (state: State, recipeToLoad: Recipe | null) => ({
      ...state,
      recipesLoaded: recipeToLoad
        ? [...state.recipesLoaded, recipeToLoad]
        : state.recipesLoaded,
    })
  );

  readonly removeOneRecipe = this.updater(
    (state: State, recipeToRemove: Recipe | null) => ({
      ...state,
      recipesLoaded: state.recipesLoaded.filter(
        (recipe) => recipe.recipeId !== recipeToRemove?.recipeId
      ),
    })
  );

  readonly updateSingleRecipe = this.updater(
    (state: State, recipeToUpdate: Recipe | null) => ({
      ...state,
      recipesLoaded: recipeToUpdate
        ? state.recipesLoaded.map((recipe) =>
            recipe.recipeId === recipeToUpdate.recipeId
              ? recipeToUpdate
              : recipe
          )
        : state.recipesLoaded,
    })
  );

  readonly loadAllRecipes = this.effect((request: Observable<{}>) =>
    request.pipe(
      switchMap(() => {
        return this.recipeService.getAllRecipes();
      }),
      // TODO: Handle error case, use tapError.
      tap((response: Recipe[]) => {
        if (response.length > 0) {
          this.setRecipesLoaded(response);
        }
      })
    )
  );

  readonly loadAllIngredients = this.effect((request: Observable<{}>) =>
    request.pipe(
      switchMap(() => {
        return this.ingredientService.getAllIngredients();
      }),
      tap((response: Ingredient[]) => {
        if (response.length > 0) {
          this.setIngredientsLoaded(response);
        }
      })
    )
  );

  readonly addNewRecipe = this.effect((request: Observable<Recipe>) =>
    request.pipe(
      switchMap((request: Recipe) => {
        return this.recipeService.addRecipe(request);
      }),
      // TODO: Handle error case, use tapError.
      tap((response: Recipe[]) => {
        if (response.length > 0) {
          this.snackbar.open('Recipe added successfully', 'Ok', {
            duration: 2000,
          });
          this.loadRecipe(response.at(0)!);
          this.loadAllIngredients({});
        }
      })
    )
  );

  readonly editRecipe = this.effect((request: Observable<Recipe>) =>
    request.pipe(
      switchMap((request: Recipe) => {
        return this.recipeService.editRecipe(request);
      }),
      // TODO: Handle error case, use tapError.
      tap((response: Recipe[]) => {
        if (response.length > 0) {
          this.snackbar.open('Recipe edited successfully', 'Ok', {
            duration: 2000,
          });
          this.updateSingleRecipe(response.at(0)!);
          this.loadAllIngredients({});
        }
      })
    )
  );

  readonly removeRecipe = this.effect((request: Observable<string>) =>
    request.pipe(
      switchMap((request: string) => {
        return this.recipeService.removeRecipe(request);
      }),
      tap((response: Recipe[]) => {
        if (response.length > 0) {
          this.removeOneRecipe(response.at(0)!);
          this.loadAllIngredients({});
          this.snackbar.open(
            `Recipe ${response.at(0)?.name} has been removed`,
            'Ok',
            { duration: 2000 }
          );
        }
      })
    )
  );
}
