import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICategory } from 'src/app/shared/interfaces/client/category.interface';
import { BaseComponent } from '../base/base.component';
import { takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { IAppState } from '../../store/app.state';
import * as RootActions from './../../store/app.actions';
import { selectCategories } from '../../store/app.selectors';
import { AuthUtilService } from 'src/app/utils/auth-util.service';
import { selectLoginStatus } from 'src/app/features/authentication/store/auth.selectors';

@Component({
  selector: 'rimss-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends BaseComponent implements OnInit {
  public isLoggedIn = false;

  constructor(
    private router: Router,
    private authUtilService: AuthUtilService,
    private store: Store<IAppState>
  ) {
    super();
  }

  public sideNavVisible = false;

  public categories: Array<ICategory> = [];

  public ngOnInit(): void {
    this.store
      .select(selectLoginStatus)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((loginStatus) => {
        this.isLoggedIn = loginStatus;
      });
    this.isLoggedIn = !!this.authUtilService.getLoggedInEmail();
    this.fetchAllCategories();
  }

  public navigateTo(path: Array<string>, category?: Array<string>): void {
    this.router.navigate(path, {
      queryParams: {
        category,
      },
    });
  }

  /**
   * Search products based on free text
   * @param searchText : string
   */
  public searchProducts(searchText: string): void {
    this.router.navigate(['products', 'list'], {
      queryParams: {
        search: searchText,
        mode: 'search',
      },
    });
  }

  /**
   * Logout
   */
  public logout(): void {
    this.authUtilService.logout();
    this.isLoggedIn = false;
  }

  /**
   * Redirect to login page
   */
  public login(): void {
    this.router.navigate(['auth']);
  }

  /**
   * Open side nav menu for mobile screen
   */
  public openSideNav() {
    this.sideNavVisible = !this.sideNavVisible;
  }

  /**
   * Fetch all categories from ngrx store
   */
  private fetchAllCategories(): void {
    this.store.dispatch(RootActions.fetchCategories());
    this.store
      .select(selectCategories)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
        },
      });
  }
}
