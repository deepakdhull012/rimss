import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/features/authentication/services/auth.service';
import { ICategory } from 'src/app/shared/interfaces/client/category.interface';
import { ProductsService } from 'src/app/api/products.service';
import { CategoryService } from 'src/app/api/category.service';

@Component({
  selector: 'rimss-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public isLoggedIn = false;
  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private authService: AuthService
  ) {}

  public sideNavVisible = false;

  public categories: Array<ICategory> = [];

  public ngOnInit(): void {
    this.categoryService.fetchAllCategories().subscribe((categories) => {
      this.categories = categories;
    });
    this.isLoggedIn = !!this.authService.getLoggedInEmail();
  }

  navigateTo(path: Array<string>, category?: Array<string>): void {
    this.router.navigate(path, {
      queryParams: {
        category,
      },
    });
  }

  searchProducts(searchText: string): void {
    this.router.navigate(['products', 'list'], {
      queryParams: {
        search: searchText,
        mode: 'search',
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }

  login(): void {
    this.router.navigate(['auth']);
  }

  openSideNav() {
    this.sideNavVisible = !this.sideNavVisible;
  }
}
