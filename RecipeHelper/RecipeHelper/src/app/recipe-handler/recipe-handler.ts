import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddNewRecipeForm } from './add-new-recipe-form/add-new-recipe-form';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'recipe-handler',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    AddNewRecipeForm,
  ],
  templateUrl: './recipe-handler.html',
  styleUrl: './recipe-handler.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeHandler {
    readonly panelOpenState = signal(false);
}
