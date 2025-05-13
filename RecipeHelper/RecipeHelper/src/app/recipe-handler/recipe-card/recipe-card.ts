import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Recipe } from '../../shared/protos';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { RecipeViewDialog } from '../recipe-view-dialog/recipe-view-dialog';
import { PrimaryDataStore } from '../../data-store/primary-data-store';

@Component({
  selector: 'recipe-card',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatListModule,
  ],
  templateUrl: './recipe-card.html',
  styleUrl: './recipe-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeCard implements OnInit {
  readonly recipe = input<Recipe>();

  private readonly dialog = inject(MatDialog);
  private readonly dataStore = inject(PrimaryDataStore);

  protected readonly stepsCharacterCutOff = 30;
  protected readonly ingredientsNumberCutOff = 7;
  protected readonly tagsNumberCutOff = 6;

  servingsControl = new FormControl<number>(0, {
    nonNullable: true,
  });

  servingsValue = toSignal(
    this.servingsControl.valueChanges.pipe(
      startWith(this.recipe()?.servings ?? 0)
    )
  );

  servingMultiplier = computed(() => {
    return (this.servingsValue() ?? 1) / (this.recipe()?.servings ?? 1);
  });

  private readonly desktopDialogConfig = {
    width: '600px',
  };

  ngOnInit(): void {
    this.servingsControl.setValue(this.recipe()?.servings ?? 0);
  }

  resetServingsValue() {
    this.servingsControl.setValue(this.recipe()?.servings ?? 0);
  }

  updateServingsValue(updatedValue: number) {
    this.servingsControl.setValue(updatedValue);
  }

  openRecipe() {
    this.dialog
      .open(RecipeViewDialog, {
        data: this.recipe()!,
        ...this.desktopDialogConfig,
      })
      .afterClosed()
      .subscribe(() => {
            this.updateServingsValue(this.recipe()?.servings ?? 0);
      });
  }

  removeRecipe() {
    this.dataStore.removeRecipe(this.recipe()?.recipeId ?? "");
  }
}
