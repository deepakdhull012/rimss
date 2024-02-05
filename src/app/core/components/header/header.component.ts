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

  public searchProducts(searchText: string): void {
    this.router.navigate(['products', 'list'], {
      queryParams: {
        search: searchText,
        mode: 'search',
      },
    });
  }

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

  public logout(): void {
    this.authUtilService.logout();
  }

  public login(): void {
    this.router.navigate(['auth']);
  }

  public openSideNav() {
    this.sideNavVisible = !this.sideNavVisible;
  }
}
