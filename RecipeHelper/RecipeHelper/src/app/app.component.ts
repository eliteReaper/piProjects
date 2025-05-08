import { Component } from '@angular/core';
import { IngredientViewer } from './ingredient-viewer/ingredient-viewer';
import { RecipeHandler } from "./recipe-handler/recipe-handler";

@Component({
  selector: 'app-root',
  imports: [IngredientViewer, RecipeHandler],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
