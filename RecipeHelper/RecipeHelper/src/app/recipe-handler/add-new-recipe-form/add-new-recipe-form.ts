import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  OnInit,
  signal,
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  combineLatest,
  debounceTime,
  map,
  Observable,
  of,
  startWith,
  tap,
} from 'rxjs';
import { RecipeService } from '../../services/recipe-service';
import { CategoryAndLabel, Ingredient, Recipe } from '../../shared/protos';
import { AsyncPipe } from '@angular/common';
import { IngredientService } from '../../services/ingredient-services';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { toObservable } from '@angular/core/rxjs-interop';

interface IngredientIdLabel {
  id: string;
  label: string;
  controlIdx?: number;
}

interface NewRecipeFormControl {
  name: FormControl<string>;
  ingredient: FormControl<string>;
  ingredientQuantity: FormArray<FormControl<string>>;
  steps: FormControl<string>;
  servings: FormControl<number>;
  category: FormControl<string>;
  tags: FormControl<string>;
}

@Component({
  selector: 'add-new-recipe-form',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
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
  private ingredientSerivce: IngredientService = inject(IngredientService);

  protected readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  protected newRecipeForm: FormGroup<NewRecipeFormControl> =
    new FormGroup<NewRecipeFormControl>({
      name: new FormControl<string>('', { nonNullable: true }),
      ingredient: new FormControl<string>('', {
        nonNullable: true,
      }),
      ingredientQuantity: new FormArray<FormControl<string>>([]),
      steps: new FormControl<string>('', { nonNullable: true }),
      servings: new FormControl<number>(0, { nonNullable: true }),
      category: new FormControl<string>('', { nonNullable: true }),
      tags: new FormControl<string>('', { nonNullable: true }),
    });

  protected recipeCategoriesAndLabels: Observable<CategoryAndLabel[]> =
    this.recipeService.getRecipeCategoriesAndLabel();

  private readonly allIngredientsIdsAndLabels: Observable<IngredientIdLabel[]> =
    this.ingredientSerivce.getAllIngredients().pipe(
      map((ingredients) =>
        ingredients.map((ingredient) => {
          return { id: ingredient.ingredientId, label: ingredient.name };
        })
      )
    );

  private ingredientInputValueChanges: Observable<string> =
    this.newRecipeForm.controls.ingredient.valueChanges.pipe(
      startWith(''),
      debounceTime(100)
    );

  protected ingredientsSelected = signal<IngredientIdLabel[]>([]);

  protected filteredIngredientsAndLabels = combineLatest([
    this.allIngredientsIdsAndLabels,
    this.ingredientInputValueChanges,
    toObservable(this.ingredientsSelected),
  ]).pipe(
    map(
      ([
        allIngredientsAndLabels,
        ingredientInputValueChanges,
        ingredientsSelected,
      ]) => {
        if (!ingredientInputValueChanges) {
          return allIngredientsAndLabels;
        }
        return allIngredientsAndLabels
          .filter(
            (ingredientAndLabel) =>
              ingredientAndLabel.label
                .toLowerCase()
                .indexOf(ingredientInputValueChanges.toLowerCase()) !== -1
          )
          .filter(
            (ingredientAndLabel) =>
              ingredientsSelected.findIndex(
                (ingredientSelected) =>
                  ingredientAndLabel.id === ingredientSelected.id
              ) === -1
          );
      }
    )
  );

  selectIngredient(event: MatAutocompleteSelectedEvent): void {
    this.newRecipeForm.controls.ingredient.setValue('');
    this.ingredientsSelected.update((ingredients) => [
      ...ingredients,
      {
        id: event.option.id,
        label: event.option.viewValue,
        controlIdx: this.newRecipeForm.controls.ingredientQuantity.length,
      },
    ]);
    this.newRecipeForm.controls.ingredientQuantity.push(
      new FormControl<string>('0', { nonNullable: true })
    );
    event.option.deselect();
  }

  removeIngredient(ingredient: IngredientIdLabel): void {
    this.ingredientsSelected.update((ingredients) => {
      const index = ingredients.indexOf(ingredient);
      if (index < 0) {
        return ingredients;
      }
      ingredients.splice(index, 1);
      return [...ingredients];
    });
    if (ingredient.controlIdx) {
      this.newRecipeForm.controls.ingredientQuantity.removeAt(
        ingredient.controlIdx
      );
    }
  }

  addNewRecipe() {
    const newRecipe: Recipe = {
      name: this.newRecipeForm.controls.name.value,
      ingredientsRequired: this.ingredientsSelected().map((ingredient) => {
        return {
          id: ingredient.id,
          quantity: this.extractQuantityFromIngredientInput(
            this.newRecipeForm.controls.ingredientQuantity.at(
              ingredient.controlIdx!
            )!.value
          ),
          unit: this.extractUnitFromIngredientInput(
            this.newRecipeForm.controls.ingredientQuantity.at(
              ingredient.controlIdx!
            )!.value
          ),
        };
      }),
      steps: [this.newRecipeForm.controls.steps.value],
      servings: this.newRecipeForm.controls.servings.value,
      category: this.newRecipeForm.controls.category.value,
      tags: this.newRecipeForm.controls.tags.value
        .trim()
        .split(',')
        .map((tag) => tag.trim()),
    };

    // TODO: Create an effect for this and snack bar.
    this.recipeService.addRecipe(newRecipe).subscribe();
    this.newRecipeForm.reset();
    this.ingredientsSelected.set([]);
  }

  private extractQuantityFromIngredientInput(inputValue: string): number {
    return parseFloat(inputValue.match(/[\d.]+/g)?.at(0) ?? '0');
  }

  private extractUnitFromIngredientInput(inputValue: string): string {
    const supportedUnits = ['g', 'tbsp', 'cup', 'tsp', 'ml'];
    const foundUnits = supportedUnits.filter(
      (unit) => inputValue.indexOf(unit) !== -1
    );
    return foundUnits.at(0) ?? '';
  }
}
