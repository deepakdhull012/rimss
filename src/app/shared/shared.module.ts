import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from './components/banner/banner.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NgxLoadingModule } from 'ngx-loading';



@NgModule({
  declarations: [
    BannerComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    NgxLoadingModule.forRoot({})
  ],
  exports: [
    BannerComponent,
    LoaderComponent
  ]
})
export class SharedModule { }
