import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/features/authentication/services/auth.service';
import { ICategory } from 'src/app/shared/interfaces/client/category.interface';
import { CategoryService } from 'src/app/api/category.service';
import { BaseComponent } from '../base/base.component';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'rimss-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends BaseComponent implements OnInit {
  public isLoggedIn = false;

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private authService: AuthService
  ) {
    super();
  }

  public sideNavVisible = false;

  public categories: Array<ICategory> = [];

  public ngOnInit(): void {
    this.categoryService.fetchAllCategories().subscribe((categories) => {
      this.categories = categories;
    });
    this.isLoggedIn = !!this.authService.getLoggedInEmail();
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
    this.categoryService
      .fetchAllCategories()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
        }
      });
  }

  public logout(): void {
    this.authService.logout();
  }

  public login(): void {
    this.router.navigate(['auth']);
  }

  public openSideNav() {
    this.sideNavVisible = !this.sideNavVisible;
  }
}
