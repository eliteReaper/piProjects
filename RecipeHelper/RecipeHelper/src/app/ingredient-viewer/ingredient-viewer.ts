import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { IngredientCard } from './ingredient-card/ingredient-card';
import { Ingredient } from '../shared/protos';
import { map, Observable, take, toArray } from 'rxjs';
import { IngredientService } from '../services/ingredient-services';
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'ingredient-viewer',
  standalone: true,
  imports: [
    AsyncPipe,
    IngredientCard,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './ingredient-viewer.html',
  styleUrl: './ingredient-viewer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngredientViewer {
  ingredientService = inject(IngredientService);

  allIngredients: Observable<Ingredient[]> =
    this.ingredientService.getAllIngredients();

  showIngredients: Observable<Ingredient[]> = this.allIngredients.pipe(
    map((ingredients) => ingredients.slice(0, 5))
  );
}
