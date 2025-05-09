import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';

@Component({
  selector: 'ingredient-card',
  standalone: true,
  imports: [MatCardModule, MatChipsModule, MatProgressBarModule],
  templateUrl: './ingredient-card.html',
  styleUrl: './ingredient-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IngredientCard {
  ingredientId = input<string>("");
  name = input<string>("");
  category = input<string>("");
  tags = input<string[]>([]);
}
