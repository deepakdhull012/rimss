import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThankYouComponent } from './components/thank-you/thank-you.component';
import { ThankYouRoutingModule } from './thank-you.routes';
import { CoreModule } from 'src/app/core/core.module';



@NgModule({
  declarations: [
    ThankYouComponent
  ],
  imports: [
    CommonModule,
    ThankYouRoutingModule,
    CoreModule
  ]
})
export class ThankYouModule { }
