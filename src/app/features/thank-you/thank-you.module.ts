import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThankYouComponent } from './components/thank-you/thank-you.component';
import { ThankYouRoutingModule } from './thank-you.routes';



@NgModule({
  declarations: [
    ThankYouComponent
  ],
  imports: [
    CommonModule,
    ThankYouRoutingModule
  ]
})
export class ThankYouModule { }
