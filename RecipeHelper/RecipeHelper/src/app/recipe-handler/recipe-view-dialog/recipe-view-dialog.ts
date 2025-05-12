import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Recipe } from '../../shared/protos';
import { AddNewRecipeForm } from '../add-new-recipe-form/add-new-recipe-form';
import { REACTIVE_NODE } from '@angular/core/primitives/signals';

@Component({
  selector: 'recipe-view-dialog',
  templateUrl: 'recipe-view-dialog.html',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    AddNewRecipeForm,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeViewDialog {
  data: Recipe = inject(MAT_DIALOG_DATA);
}
