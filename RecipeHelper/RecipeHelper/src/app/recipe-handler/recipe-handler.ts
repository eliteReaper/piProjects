import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddNewRecipeForm } from './add-new-recipe-form/add-new-recipe-form';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { RecipeGallery } from './recipe-gallery/recipe-gallery';
import { MatDividerModule } from '@angular/material/divider';
import { PrimaryDataStore } from '../data-store/primary-data-store';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'recipe-handler',
  standalone: true,
  imports: [
    MatDividerModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    AddNewRecipeForm,
    RecipeGallery,
    MatListModule,
  ],
  templateUrl: './recipe-handler.html',
  styleUrl: './recipe-handler.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeHandler {
  private dataStore = inject(PrimaryDataStore);

  readonly panelOpenState = signal(false);

  refreshRecipes() {
    this.dataStore.loadAllRecipes({});
  }

  onAddCollapseForm() {
    this.panelOpenState.set(false);
  }
}
