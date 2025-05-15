import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormField, MatSelectModule } from '@angular/material/select';
import { IngredientService } from '../../services/ingredient-services';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PrimaryDataStore } from '../../data-store/primary-data-store';

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
  ],
  templateUrl: './add-edit-ingredient-form.html',
  styleUrls: ['./add-edit-ingredient-form.scss'],
})
export class AddEditIngredientForm {
  ingredientService = inject(IngredientService);
  dataStore = inject(PrimaryDataStore);

  supportedCategories: Observable<string[]> =
    this.ingredientService.getSupportedIngredientCategories();

  ingredientForm = new FormGroup<IngredientFormControl>({
    name: new FormControl<string>('', { nonNullable: true }),
    category: new FormControl<string>('', { nonNullable: true }),
    tags: new FormControl<string>('', { nonNullable: true }),
  });

  addIngredient() {
    const name = this.ingredientForm.get('name')?.value;
    const category = this.ingredientForm.get('category')?.value;
    const tags = this.ingredientForm.get('tags')?.value;
    
    console.log(name, category);
    if (name && category) {
      this.dataStore.addNewIngredient({
        name,
        category,
        tags: tags ? tags.split(',').map((tag) => tag.trim()) : [],
      });
      this.ingredientForm.reset();
    }
  }
}
