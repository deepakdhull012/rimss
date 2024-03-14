import { Component, OnInit } from '@angular/core';
import { BaseComponent } from './core/components/base/base.component';
import { NGXLogger } from 'ngx-logger';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'rimss-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends BaseComponent implements OnInit {
  constructor(private logger: NGXLogger, public translate: TranslateService) {
    super();
  }

  public ngOnInit(): void {
    this.logger.info('application bootstraped');
    this.initLocalization();
  }

  private initLocalization(): void {
    this.translate.addLangs(['en', 'de']);
    this.translate.setDefaultLang('de');

    const browserLang = this.translate.getBrowserLang();
    const language: string = browserLang?.match(/en|de/) ? browserLang : 'en';
    this.translate.use(language);
  }

  title = 'Retail Inventory Software';
}
