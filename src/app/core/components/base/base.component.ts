import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive({
  selector: '[rimssBase]'
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class BaseComponent implements OnDestroy {

  protected componentDestroyed$ = new Subject<void>();

  constructor() { }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
  }

  
}


