import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { IngredientFormDialog } from '../ingredient-form-dialog/ingredient-form-dialog';

@Component({
  selector: 'ingredient-card',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatCardModule,
    MatChipsModule,
    MatProgressBarModule,
  ],
  templateUrl: './ingredient-card.html',
  styleUrl: './ingredient-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngredientCard {
  ingredientId = input<string>('');
  name = input<string>('');
  category = input<string>('');
  tags = input<string[]>([]);
  countOfRecipesUsedIn = input<number>(0);
  editAllowed = input<boolean>(false);

  dialog = inject(MatDialog);

  editIngredient() {
    this.dialog.open(IngredientFormDialog, {
      data: {
        ingredientId: this.ingredientId() ?? '',
        name: this.name() ?? '',
        category: this.category() ?? '',
        tags: this.tags() ?? '',
      },
    });
  }
}
