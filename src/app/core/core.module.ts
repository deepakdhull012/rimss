import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BaseComponent } from './components/base/base.component';
import { RouterModule } from '@angular/router';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { coreFeatureKey, coreReducer } from './store/app.reducers';
import { CoreEffects } from './store/app.effects';

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
    StoreModule.forFeature(coreFeatureKey, coreReducer),
    EffectsModule.forFeature(CoreEffects)
  ],
  exports: [...components],
})
export class CoreModule {}
