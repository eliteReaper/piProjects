import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { map, Observable } from 'rxjs';
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
import { MatDialog } from '@angular/material/dialog';
import { RecipeViewDialog } from '../recipe-view-dialog/recipe-view-dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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
  ],
  templateUrl: './recipe-gallery.html',
  styleUrl: './recipe-gallery.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeGallery implements OnInit {
  private dataStore = inject(PrimaryDataStore);
  private dialog = inject(MatDialog);

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

  ngOnInit() {
    this.dataStore.loadAllRecipes({});
  }

  protected allRecipes: Observable<Recipe[]> = this.dataStore.recipesLoaded;
}
