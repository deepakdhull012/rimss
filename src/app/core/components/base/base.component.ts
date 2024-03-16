import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

// This base component provides common place to clean up resources and to can be used for various other things like
// provide component id to debug errors, logs capturing, common functionality across components
@Directive({
  selector: '[rimssBase]'
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class BaseComponent implements OnDestroy {

  protected componentDestroyed$ = new Subject<void>();

  constructor() { }

  /**
   * Life cycle hook to clean up resources
   */
  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
  }

  
}


