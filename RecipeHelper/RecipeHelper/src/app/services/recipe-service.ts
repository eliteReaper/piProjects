import { inject, Injectable } from '@angular/core';
import { Observable, map, catchError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Recipe, ServerResponse, CategoryAndLabel } from '../shared/protos';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private httpClient = inject(HttpClient);

  editRecipe(recipe: Recipe): Observable<Recipe[]> {
    return this.httpClient
      .post<ServerResponse<Recipe[]>>(
        'http://localhost:3000/updateRecipe',
        recipe
      )
      .pipe(
        map((res: ServerResponse<Recipe[]>) => {
          return res.payload;
        }),
        catchError((err: HttpErrorResponse) => {
          // TODO: Find some way to show this error using Http Interceptors.
          throw err;
        })
      );
  }

  addRecipe(recipe: Recipe): Observable<Recipe[]> {
    return this.httpClient
      .post<ServerResponse<Recipe[]>>(
        'http://localhost:3000/addNewRecipe',
        recipe
      )
      .pipe(
        map((res: ServerResponse<Recipe[]>) => {
          return res.payload;
        }),
        catchError((err: HttpErrorResponse) => {
          // TODO: Find some way to show this error using Http Interceptors.
          throw err;
        })
      );
  }

  getAllRecipes(): Observable<Recipe[]> {
    return this.httpClient
      .post<ServerResponse<Recipe[]>>(
        'http://localhost:3000/getRecipe', {})
      .pipe(
        map((res: ServerResponse<Recipe[]>) => {
          return res.payload;
        }),
        catchError((err: HttpErrorResponse) => {
          // TODO: Find some way to show this error using Http Interceptors.
          throw err;
        })
      );
  }

  getRecipeCategoriesAndLabel(): Observable<CategoryAndLabel[]> {
    return this.httpClient
      .post<ServerResponse<CategoryAndLabel[]>>(
        'http://localhost:3000/getRecipeCategoriesAndLabels',
        {}
      )
      .pipe(
        map((res: ServerResponse<CategoryAndLabel[]>) => {
          return res.payload;
        }),
        catchError((err: HttpErrorResponse) => {
          // TODO: Find some way to show this error using Http Interceptors.
          throw err;
        })
      );
  }
}
