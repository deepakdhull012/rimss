import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive({
  selector: '[base]'
})
export abstract class BaseComponent implements OnDestroy {

  
  protected componentDestroyed$ = new Subject<void>();

  constructor() { }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
  }

  
}


