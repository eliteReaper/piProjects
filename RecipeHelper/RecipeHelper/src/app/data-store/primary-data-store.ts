import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Ingredient, LoadingStateType, Recipe } from '../shared/protos';
import { RecipeService } from '../services/recipe-service';
import { Observable, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IngredientService } from '../services/ingredient-services';
import { request } from 'http';

interface State {
  recipesLoaded: Recipe[];
  ingredientsLoaded: Ingredient[];
  loadingState: LoadingStateType;
}

@Injectable({ providedIn: 'root' })
export class PrimaryDataStore extends ComponentStore<State> {
  private recipeService = inject(RecipeService);
  private ingredientService = inject(IngredientService);
  private snackbar = inject(MatSnackBar);

  constructor() {
    super({ recipesLoaded: [], ingredientsLoaded: [], loadingState: LoadingStateType.IDLE });
  }

  readonly recipesLoaded = this.select(({ recipesLoaded }) => recipesLoaded);
  readonly ingredientsLoaded = this.select(
    ({ ingredientsLoaded }) => ingredientsLoaded
  );
  readonly loadingState = this.select(({ loadingState }) => loadingState);

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

  readonly setLoadingState = this.updater(
    (state, loadingState: LoadingStateType | null) => ({
      ...state,
      loadingState: loadingState ?? LoadingStateType.IDLE,
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
      tap(() => {
        this.setLoadingState(LoadingStateType.LOADING_RECIPES_LIST);
      }),
      switchMap(() => {
        return this.recipeService.getAllRecipes();
      }),
      tap({
        next: (response: Recipe[]) => {
          if (response.length > 0) {
            this.setRecipesLoaded(response);
          }
          this.setLoadingState(LoadingStateType.IDLE);
        },
        error: (err) => {
          this.reportSnackBarError();
          this.setLoadingState(LoadingStateType.IDLE);
        },
      })
    )
  );

  readonly loadAllIngredients = this.effect((request: Observable<{}>) =>
    request.pipe(
      tap(() => {
        this.setLoadingState(LoadingStateType.LOADING_INGREDIENT_LIST);
      }),
      switchMap(() => {
        return this.ingredientService.getAllIngredients();
      }),
      tap({
        next: (response: Ingredient[]) => {
          if (response.length > 0) {
            this.setIngredientsLoaded(response);
          }
          this.setLoadingState(LoadingStateType.IDLE);
        },
        error: (err) => {
          this.reportSnackBarError();
          this.setLoadingState(LoadingStateType.IDLE);
        },
      })
    )
  );

  readonly addEditNewIngredient = this.effect(
    (request: Observable<Ingredient>) =>
      request.pipe(
        tap(() => {
          this.setLoadingState(LoadingStateType.LOADING_INGREDIENT_ADD_EDIT);
        }),
        switchMap((ingredient: Ingredient) => {
          return this.ingredientService.addEditIngredient(ingredient);
        }),
        tap({
          next: (response: Ingredient[]) => {
            this.loadAllIngredients({});
            if (response.length > 0) {
              this.snackbar.open('Ingredients List was updated', 'Ok', {
                duration: 2000,
              });
            }
            this.setLoadingState(LoadingStateType.IDLE);
          },
          error: (err) => {
            this.reportSnackBarError();
            this.setLoadingState(LoadingStateType.IDLE);
          },
        })
      )
  );

  readonly addNewRecipe = this.effect((request: Observable<Recipe>) =>
    request.pipe(
      tap(() => {
        this.setLoadingState(LoadingStateType.LOADING_RECIPE_ADD);
      }),
      switchMap((request: Recipe) => {
        return this.recipeService.addRecipe(request);
      }),
      tap({
        next: (response: Recipe[]) => {
          if (response.length > 0) {
            this.snackbar.open('Recipe added successfully', 'Ok', {
              duration: 2000,
            });
            this.loadRecipe(response.at(0)!);
            this.loadAllIngredients({});
          }
          this.setLoadingState(LoadingStateType.IDLE);
        },
        error: (err) => {
          this.reportSnackBarError();
          this.setLoadingState(LoadingStateType.IDLE);
        },
      })
    )
  );

  readonly editRecipe = this.effect((request: Observable<Recipe>) =>
    request.pipe(
      tap(() => {
        this.setLoadingState(LoadingStateType.LOADING_RECIPE_EDIT);
      }),
      switchMap((request: Recipe) => {
        return this.recipeService.editRecipe(request);
      }),
      tap({
        next: (response: Recipe[]) => {
          if (response.length > 0) {
            this.snackbar.open('Recipe edited successfully', 'Ok', {
              duration: 2000,
            });
            this.updateSingleRecipe(response.at(0)!);
            this.loadAllIngredients({});
          }
          this.setLoadingState(LoadingStateType.IDLE);
        },
        error: (err) => {
          this.reportSnackBarError();
          this.setLoadingState(LoadingStateType.IDLE);
        },
      })
    )
  );

  readonly removeRecipe = this.effect((request: Observable<string>) =>
    request.pipe(
      tap(() => {
        this.setLoadingState(LoadingStateType.LOADING_RECIPE_DELETE);
      }),
      switchMap((request: string) => {
        return this.recipeService.removeRecipe(request);
      }),
      tap({
        next: (response: Recipe[]) => {
          if (response.length > 0) {
            this.removeOneRecipe(response.at(0)!);
            this.loadAllIngredients({});
            this.snackbar.open(
              `Recipe ${response.at(0)?.name} has been removed`,
              'Ok',
              { duration: 2000 }
            );
          }
          this.setLoadingState(LoadingStateType.IDLE);
        },
        error: (err) => {
          this.reportSnackBarError();
          this.setLoadingState(LoadingStateType.IDLE);
        },
      })
    )
  );

  private reportSnackBarError(msg?: string) {
    this.snackbar.open(msg ?? 'Some error occured', 'Ok', { duration: 2000 });
  }
}
