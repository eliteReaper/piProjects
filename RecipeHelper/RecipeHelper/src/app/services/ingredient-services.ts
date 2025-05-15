import { inject, Injectable } from '@angular/core';
import { Observable, map, catchError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Ingredient, ServerResponse, GetIngredientRequest } from '../shared/protos';

@Injectable({
  providedIn: 'root',
})
export class IngredientService {
  private httpClient = inject(HttpClient);

  addIngredient(ingredient: Ingredient): Observable<Ingredient[]> {
    console.log(ingredient);
    return this.httpClient
      .post<ServerResponse<Ingredient[]>>('http://localhost:3000/addIngredient', {...ingredient})
      .pipe(
        map((res: ServerResponse<Ingredient[]>) => {
          console.log(" hi there");
          return res.payload;
        }),
        catchError((err: HttpErrorResponse) => {
          // TODO: Find some way to show this error using Http Interceptors.
          throw err;
        })
      );
  }

  getAllIngredients(): Observable<Ingredient[]> {
    return this.httpClient
      .post<ServerResponse<Ingredient[]>>('http://localhost:3000/getIngredient', {})
      .pipe(
        map((res: ServerResponse<Ingredient[]>) => {
          return res.payload;
        }),
        catchError((err: HttpErrorResponse) => {
          // TODO: Find some way to show this error using Http Interceptors.
          throw err;
        })
      );
  }

  getSupportedIngredientCategories(): Observable<string[]> {
    return this.httpClient
      .post<ServerResponse<string[]>>('http://localhost:3000/getSupportedIngredientCategories', {})
      .pipe(
        map((res: ServerResponse<string[]>) => {
          return res.payload;
        }),
        catchError((err: HttpErrorResponse) => {
          // TODO: Find some way to show this error using Http Interceptors.
          throw err;
        })
      );
  }
}