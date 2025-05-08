import { inject, Injectable } from '@angular/core';
import { Observable, map, catchError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Ingredient, ServerResponse, GetIngredientRequest } from '../shared/protos';

@Injectable({
  providedIn: 'root',
})
export class IngredientService {
  private httpClient = inject(HttpClient);

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
}