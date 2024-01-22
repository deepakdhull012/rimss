import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BaseComponent } from './components/base/base.component';
import { RouterModule } from '@angular/router';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

const components: Array<any> = [HeaderComponent, FooterComponent];
const directives: Array<any> = [BaseComponent];

@NgModule({
  declarations: [...components, ...directives],
  imports: [
    CommonModule,
    RouterModule,
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.ERROR,
    }),
  ],
  exports: [...components],
})
export class CoreModule {}
