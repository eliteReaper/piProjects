import { Component, inject, input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormField, MatSelectModule } from '@angular/material/select';
import { IngredientService } from '../../services/ingredient-services';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PrimaryDataStore } from '../../data-store/primary-data-store';
import { Ingredient, LoadingStateType } from '../../shared/protos';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { toSignal } from '@angular/core/rxjs-interop';

interface IngredientFormControl {
  name: FormControl<string>;
  category: FormControl<string>;
  tags: FormControl<string>;
}

@Component({
  selector: 'add-edit-ingredient-form',
  standalone: true,
  imports: [
    MatButtonModule,
    MatOptionModule,
    MatFormField,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    AsyncPipe,
    MatProgressSpinnerModule,
  ],
  templateUrl: './add-edit-ingredient-form.html',
  styleUrls: ['./add-edit-ingredient-form.scss'],
})
export class AddEditIngredientForm implements OnInit {
  ingredientService = inject(IngredientService);
  dataStore = inject(PrimaryDataStore);

  ingredient = input<Ingredient>();
  isAddForm = input<boolean>(true);

  loadingState: Observable<LoadingStateType> = this.dataStore.loadingState;

  isAddOrEditLoading: Observable<boolean> = this.loadingState.pipe(map((loadingState) => {
      return loadingState === LoadingStateType.LOADING_INGREDIENT_ADD_EDIT;
  }));

  supportedCategories: Observable<string[]> =
    this.ingredientService.getSupportedIngredientCategories();

  ingredientForm = new FormGroup<IngredientFormControl>({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    category: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    tags: new FormControl<string>('', { nonNullable: true }),
  });

  ngOnInit(): void {
    if (this.ingredient()) {
      this.ingredientForm.controls.name.setValue(this.ingredient()?.name ?? '');
      this.ingredientForm.controls.category.setValue(
        this.ingredient()?.category ?? ''
      );``
      this.ingredientForm.controls.tags.setValue(
        this.ingredient()?.tags?.join(',') ?? ''
      );
    }
  }

  addEditIngredient() {
    this.ingredientForm.markAllAsTouched();
    const name = this.ingredientForm.get('name')?.value;
    const category = this.ingredientForm.get('category')?.value;
    const tags = this.ingredientForm.get('tags')?.value;

    if (name && category) {
      let ingredient: Ingredient = {
        name,
        category,
        tags: tags ? tags.split(',').map((tag) => tag.trim()) : [],
      };
      if (this.ingredient()) {
        ingredient = {
          ...ingredient,
          ingredientId: this.ingredient()?.ingredientId,
        };
      }
      this.dataStore.addEditNewIngredient(ingredient);
      if(!this.ingredient()) {
        this.ingredientForm.reset();
      }
    }
  }
}
