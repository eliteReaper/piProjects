import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { IngredientCard } from './ingredient-card/ingredient-card';
import { Ingredient } from '../shared/protos';
import { debounceTime, map, Observable, startWith, take, toArray } from 'rxjs';
import { IngredientService } from '../services/ingredient-services';
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { PrimaryDataStore } from '../data-store/primary-data-store';
import { MatFormField } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { IngredientFormDialog } from './ingredient-form-dialog/ingredient-form-dialog';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ingredient-viewer',
  standalone: true,
  imports: [
    MatDivider,
    IngredientCard,
    MatInputModule,
    ReactiveFormsModule,
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
  dialog = inject(MatDialog);

  showAllIngredients = signal<boolean>(false);

  ingredientSearch = new FormControl<string>('', { nonNullable: true });

  ngOnInit(): void {
    this.dataStore.loadAllIngredients({});
  }

  private readonly allIngredients: Observable<Ingredient[]> =
    this.dataStore.ingredientsLoaded.pipe(
      map((ingredients) =>
        ingredients.sort((a, b) =>
          a.countOfRecipesUsedIn! > b.countOfRecipesUsedIn! ? -1 : 1
        )
      )
    );

  allIngredientsSignal: Signal<Ingredient[] | undefined> = toSignal(
    this.allIngredients
  );

  private readonly ingredientSearchValueChanges = this.ingredientSearch.valueChanges.pipe(
    startWith(''),
    debounceTime(200)
  );

  ingredientSearchSignal = toSignal(this.ingredientSearchValueChanges);

  showIngredients = computed(() => {
    if(this.ingredientSearchSignal()) {
      const value: string = this.ingredientSearchSignal() ?? '';
      return (this.allIngredientsSignal() ?? []).filter((ingredient) => {
        return ingredient.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
      })
    }

    return this.showAllIngredients()
      ? this.allIngredientsSignal() ?? []
      : (this.allIngredientsSignal() ?? []).slice(0, 5);
  });

  addNewIngredient() {
    this.dialog.open(IngredientFormDialog);
  }

  toggleShowAllIngredients() {
    this.ingredientSearch.setValue('');
    this.showAllIngredients.set(!this.showAllIngredients());
  }
}
