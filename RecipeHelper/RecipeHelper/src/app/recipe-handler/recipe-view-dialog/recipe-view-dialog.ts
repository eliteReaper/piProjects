import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { Recipe } from '../../shared/protos';
import { RecipeForm } from '../add-new-recipe-form/recipe-form';
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
    RecipeForm,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeViewDialog {
  data: Recipe = inject(MAT_DIALOG_DATA);
  dialogRef: MatDialogRef<RecipeViewDialog> | null = inject(MatDialogRef<RecipeViewDialog>);

  onEditClose() {
    this.dialogRef?.close();
  }
}
