import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { combineLatest, debounceTime, map, Observable, startWith } from 'rxjs';
import { Recipe } from '../../shared/protos';
import { AsyncPipe } from '@angular/common';
import { RecipeCard } from '../recipe-card/recipe-card';
import { PrimaryDataStore } from '../../data-store/primary-data-store';
import { MatGridListModule } from '@angular/material/grid-list';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

enum ScreenSize {
  XSMALL = 1,
  SMALL = 2,
  MEDIUM = 3,
  LARGE = 4,
  XLARGE = 5,
}

@Component({
  selector: 'recipe-gallery',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    RecipeCard,
    MatRippleModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './recipe-gallery.html',
  styleUrl: './recipe-gallery.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeGallery implements OnInit {
  private dataStore = inject(PrimaryDataStore);

  private readonly breakpointObserver = inject(BreakpointObserver);

  private readonly defaultScreenSizeValue = ScreenSize.LARGE;

  private readonly screenSizeObs: Observable<ScreenSize> =
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(
        map((breakpointState: BreakpointState) => {
          if (breakpointState.matches) {
            if (breakpointState.breakpoints[Breakpoints.XSmall]) {
              return ScreenSize.XSMALL;
            } else if (breakpointState.breakpoints[Breakpoints.Small]) {
              return ScreenSize.SMALL;
            } else if (breakpointState.breakpoints[Breakpoints.Medium]) {
              return ScreenSize.MEDIUM;
            } else if (breakpointState.breakpoints[Breakpoints.Large]) {
              return ScreenSize.LARGE;
            } else if (breakpointState.breakpoints[Breakpoints.XLarge])
              return ScreenSize.XLARGE;
          }
          return this.defaultScreenSizeValue;
        })
      );

  readonly screenSizeSignal: Signal<ScreenSize> = toSignal(this.screenSizeObs, {
    initialValue: this.defaultScreenSizeValue,
  });

  readonly gridColsSignal: Signal<number> = computed(() => {
    const screenSize: ScreenSize = this.screenSizeSignal();
    switch (screenSize) {
      case ScreenSize.XSMALL:
        return 1;
      case ScreenSize.SMALL:
        return 1;
      case ScreenSize.MEDIUM:
        return 2;
      case ScreenSize.LARGE:
        return 2;
      default:
        return 3;
    }
  });

  readonly rowHeightSignal: Signal<string> = computed(() => {
    const screenSize: ScreenSize = this.screenSizeSignal();
    switch (screenSize) {
      case ScreenSize.LARGE:
      case ScreenSize.MEDIUM:
      case ScreenSize.SMALL:
        return '1.5:1';
      case ScreenSize.XLARGE:
      case ScreenSize.XSMALL:
        return '2:1';
      default:
        return '1:1';
    }
  });

  recipeSearchFormControl = new FormControl<string>('', { nonNullable: true });

  ngOnInit() {
    this.dataStore.loadAllRecipes({});
  }

  protected allRecipes: Observable<Recipe[]> = this.dataStore.recipesLoaded;

  protected filteredRecipes: Observable<Recipe[]> = combineLatest([
    this.allRecipes,
    this.recipeSearchFormControl.valueChanges.pipe(startWith(''), debounceTime(100)),
  ]).pipe(
    map(([allRecipes, recipeSearchText]) => {
      if (recipeSearchText) {
        return allRecipes.filter(
          (recipe) =>
            recipe.name
              .toLowerCase()
              .indexOf(recipeSearchText.toLowerCase()) !== -1
        );
      }
      return allRecipes;
    })
  );
}
