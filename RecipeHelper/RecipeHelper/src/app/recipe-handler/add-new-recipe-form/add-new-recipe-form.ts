import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  FormArray,
  Validators,
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
import {
  CategoryAndLabel,
  Ingredient,
  LoadingStateType,
  Recipe,
} from '../../shared/protos';
import { AsyncPipe } from '@angular/common';
import { IngredientService } from '../../services/ingredient-services';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { toObservable } from '@angular/core/rxjs-interop';
import { PrimaryDataStore } from '../../data-store/primary-data-store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatProgressSpinnerModule,
  ],
  templateUrl: './add-new-recipe-form.html',
  styleUrl: './add-new-recipe-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
}) // TODO: Change name of AddNewRecipeForm to something that encapsulate both add and edit recipe form.
export class AddNewRecipeForm implements OnInit {
  recipe = input<Recipe>();
  isEditMode = model<boolean>(false);
  onEditClose = output<void>();
  onAddCollapseForm = output<void>();

  ngOnInit(): void {
    if (this.recipe()) {
      this.isEditMode.set(true);
      this.newRecipeForm.controls.name.setValue(this.recipe()!.name);
      this.newRecipeForm.controls.steps.setValue(this.recipe()!.steps[0]);
      this.newRecipeForm.controls.servings.setValue(this.recipe()!.servings);
      this.newRecipeForm.controls.category.setValue(this.recipe()!.category);
      this.newRecipeForm.controls.tags.setValue(
        this.recipe()?.tags?.join(', ') ?? ''
      );
      this.recipe()!.ingredientsRequired.forEach((ingredient) => {
        this.selectIngredientFromInput(
          ingredient.id,
          ingredient.label,
          ingredient.quantity,
          ingredient.unit
        );
      });
    }
  }

  private dataStore = inject(PrimaryDataStore);
  private recipeService = inject(RecipeService);
  private ingredientSerivce: IngredientService = inject(IngredientService);

  loadingState = this.dataStore.loadingState;
  isAddOrEditLoading = this.loadingState.pipe(
    map((loadingState) => {
      return (
        loadingState === LoadingStateType.LOADING_RECIPE_ADD ||
        loadingState === LoadingStateType.LOADING_RECIPE_EDIT
      );
    })
  );

  protected readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  protected newRecipeForm: FormGroup<NewRecipeFormControl> =
    new FormGroup<NewRecipeFormControl>({
      name: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      ingredient: new FormControl<string>('', { nonNullable: true }),
      ingredientQuantity: new FormArray<FormControl<string>>([]),
      steps: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      servings: new FormControl<number>(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      category: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      tags: new FormControl<string>('', { nonNullable: true }),
    });

  protected recipeCategoriesAndLabels: Observable<CategoryAndLabel[]> =
    this.recipeService.getRecipeCategoriesAndLabel();

  private readonly allIngredientsIdsAndLabels: Observable<IngredientIdLabel[]> =
    this.ingredientSerivce.getAllIngredients().pipe(
      map((ingredients) =>
        ingredients.map((ingredient) => {
          return { id: ingredient.ingredientId!, label: ingredient.name };
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
        const allIngredientsWithSelectedFiltered =
          allIngredientsAndLabels.filter(
            (ingredientAndLabel) =>
              ingredientsSelected.findIndex(
                (ingredientSelected) =>
                  ingredientAndLabel.id === ingredientSelected.id
              ) === -1
          );
        if (!ingredientInputValueChanges) {
          return allIngredientsWithSelectedFiltered;
        }
        return allIngredientsWithSelectedFiltered.filter(
          (ingredientAndLabel) =>
            ingredientAndLabel.label
              .toLowerCase()
              .indexOf(ingredientInputValueChanges.toLowerCase()) !== -1
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
      new FormControl<string>('0 tbsp', {
        nonNullable: true,
        validators: [Validators.required],
      })
    );
    event.option.deselect();
  }

  selectIngredientFromInput(
    id: string,
    label: string,
    quantity: number,
    unit: string
  ): void {
    this.newRecipeForm.controls.ingredient.setValue('');
    this.ingredientsSelected.update((ingredients) => [
      ...ingredients,
      {
        id,
        label,
        controlIdx: this.newRecipeForm.controls.ingredientQuantity.length,
      },
    ]);
    this.newRecipeForm.controls.ingredientQuantity.push(
      new FormControl<string>(quantity.toString() + unit, { nonNullable: true })
    );
  }

  removeIngredient(ingredient: IngredientIdLabel): void {
    if ((ingredient?.controlIdx ?? -1) >= 0) {
      this.newRecipeForm.controls.ingredientQuantity.removeAt(
        ingredient.controlIdx!
      );
    }
    this.ingredientsSelected.update((ingredients) => {
      return ingredients
        .filter((ingredientSelected) => ingredientSelected.id !== ingredient.id)
        .map((ingredientSelected, idx) => {
          return {
            ...ingredientSelected,
            controlIdx: idx,
          };
        });
    });
  }

  addNewRecipe() {
    if (
      !this.newRecipeForm.controls.name.value ||
      !this.newRecipeForm.controls.category.value ||
      !this.newRecipeForm.controls.steps.value ||
      this.newRecipeForm.controls.ingredientQuantity.length === 0 ||
      !this.newRecipeForm.controls.servings.value
    ) {
      this.newRecipeForm.markAllAsTouched();
      return;
    }
    const newRecipe: Recipe = {
      name: this.newRecipeForm.controls.name.value,
      ingredientsRequired: this.ingredientsSelected().map((ingredient) => {
        return {
          id: ingredient.id,
          label: ingredient.label,
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

    if (this.isEditMode()) {
      this.dataStore.editRecipe({
        recipeId: this.recipe()!.recipeId,
        ...newRecipe,
      });
      this.onEditClose.emit();
    } else {
      this.dataStore.addNewRecipe(newRecipe);
      this.newRecipeForm.reset();
      this.ingredientsSelected.set([]);
      this.onAddCollapseForm.emit();
    }
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
