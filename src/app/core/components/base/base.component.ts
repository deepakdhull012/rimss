import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive({
  selector: '[base]'
})
export abstract class BaseComponent implements OnDestroy {
  public componentDestroyed$ = new Subject<void>();
  constructor() { }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
  }

  
}


