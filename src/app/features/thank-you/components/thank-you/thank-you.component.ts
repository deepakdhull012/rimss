import { Component } from '@angular/core';
import { BaseComponent } from 'src/app/core/components/base/base.component';

@Component({
  selector: 'rimss-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent extends BaseComponent {
  constructor() {
    super();
  }
}
