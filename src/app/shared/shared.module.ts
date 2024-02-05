import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from './components/banner/banner.component';
import { LoaderComponent } from './components/loader/loader.component';



@NgModule({
  declarations: [
    BannerComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BannerComponent,
    LoaderComponent
  ]
})
export class SharedModule { }
