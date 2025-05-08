import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Observable, of } from 'rxjs';
import { RecipeService } from '../../services/recipe-service';
import { CategoryAndLabel } from '../../shared/protos';
import { AsyncPipe } from '@angular/common';

interface NewRecipeFormControl {
  name: FormControl<string>;
  ingredientsRequiredIds: FormControl<string[]>;
  steps: FormControl<string[]>;
  servings: FormControl<number>;
  category: FormControl<string>;
  tags: FormControl<string[] | null>;
}

@Component({
  selector: 'add-new-recipe-form',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './add-new-recipe-form.html',
  styleUrl: './add-new-recipe-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewRecipeForm {
  private recipeService: RecipeService = inject(RecipeService);

  protected newRecipeForm: FormGroup<NewRecipeFormControl> =
    new FormGroup<NewRecipeFormControl>({
      name: new FormControl<string>('', { nonNullable: true }),
      ingredientsRequiredIds: new FormControl<string[]>([], {
        nonNullable: true,
      }),
      steps: new FormControl<string[]>([], { nonNullable: true }),
      servings: new FormControl<number>(0, { nonNullable: true }),
      category: new FormControl<string>('', { nonNullable: true }),
      tags: new FormControl<string[]>([]),
    });

  protected recipeCategoriesAndLabels: Observable<CategoryAndLabel[]> =
    this.recipeService.getRecipeCategoriesAndLabel();

  addNewRecipe() {
    this.recipeCategoriesAndLabels.subscribe((val) => {
      console.log(val);
    });
    console.log('HERE:', this.newRecipeForm.controls.name);
  }
}

/*
    const Schema = new mongoose.Schema({
    recipeId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    ingredientsRequiredIds: {
        type: [String],
        required: true,
    },
    steps: {
        type: [String],
        required: true,
    },
    servings: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        enum: supportedRecipeCategories,
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    }
});
*/
