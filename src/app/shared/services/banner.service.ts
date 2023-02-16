import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IBannerConfig } from '../interfaces/client/banner.interface';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  displayBanner: Subject<IBannerConfig> = new Subject<IBannerConfig>();

  constructor() { }
}
