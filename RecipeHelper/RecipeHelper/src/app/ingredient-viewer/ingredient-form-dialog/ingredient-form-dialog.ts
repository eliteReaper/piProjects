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
import { Ingredient } from '../../shared/protos';
import { AddEditIngredientForm } from '../add-edit-ingredient-form/add-edit-ingredient-form';
import { AddNewRecipeForm } from "../../recipe-handler/add-new-recipe-form/add-new-recipe-form";

@Component({
  selector: 'ingredient-form-dialog',
  templateUrl: 'ingredient-form-dialog.html',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    AddEditIngredientForm,
    MatButtonModule
],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngredientFormDialog {
  data: Ingredient = inject(MAT_DIALOG_DATA);
  dialogRef: MatDialogRef<IngredientFormDialog> | null = inject(MatDialogRef<IngredientFormDialog>);

  onEditClose() {
    this.dialogRef?.close();
  }
}
