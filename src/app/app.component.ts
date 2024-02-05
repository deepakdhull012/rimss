import { Component, OnInit } from '@angular/core';
import { BaseComponent } from './core/components/base/base.component';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends BaseComponent implements OnInit {
  constructor(
    private logger: NGXLogger,
    
  ) {
    super();
  }

  public ngOnInit(): void {
    this.logger.info("application bootstraped");
  }

  title = 'Retail Inventory Software';
}
