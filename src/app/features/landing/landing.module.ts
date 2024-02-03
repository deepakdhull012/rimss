import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './components/landing/landing.component';
import { NgxCarouselModule } from 'ngx-light-carousel';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductModule } from '../product/product.module';
import { LandingRoutingModule } from './landing.routes';
import { CoreModule } from 'src/app/core/core.module';



@NgModule({
  declarations: [
    LandingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    LandingRoutingModule,
    ProductModule,
    NgxCarouselModule,
    CoreModule
  ],

})
export class LandingModule { }
