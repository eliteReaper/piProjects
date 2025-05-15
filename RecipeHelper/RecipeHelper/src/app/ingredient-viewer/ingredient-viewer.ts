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
import { MatDivider } from '@angular/material/divider';
import { PrimaryDataStore } from '../data-store/primary-data-store';

@Component({
  selector: 'ingredient-viewer',
  standalone: true,
  imports: [
    AsyncPipe,
    MatDivider,
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
export class IngredientViewer implements OnInit {
  dataStore = inject(PrimaryDataStore);

  ngOnInit(): void {
    this.dataStore.loadAllIngredients({});
  }

  allIngredients: Observable<Ingredient[]> = this.dataStore.ingredientsLoaded;

  showIngredients: Observable<Ingredient[]> = this.allIngredients.pipe(
    map((ingredients) =>
      ingredients.sort((a, b) =>
        a.countOfRecipesUsedIn > b.countOfRecipesUsedIn ? -1 : 1
      )
    ),
    map((ingredients) => ingredients.slice(0, 5))
  );
}
