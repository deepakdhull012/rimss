import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BaseComponent } from './components/base/base.component';

const components: Array<any> = [HeaderComponent, FooterComponent];
const directives: Array<any> = [BaseComponent];

@NgModule({
  declarations: [...components, ...directives],
  imports: [CommonModule],
  exports: [...components],
})
export class CoreModule {}
