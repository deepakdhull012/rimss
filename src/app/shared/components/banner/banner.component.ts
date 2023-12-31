import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { BannerType } from '../../interfaces/client/banner.interface';
import { BannerService } from '../../services/banner.service';

@Component({
  selector: 'rimss-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent extends BaseComponent implements OnInit {
  public bannerMessage: string = '';
  public type: BannerType = BannerType.INFO;
  public visible = false;

  public BannerType = BannerType;

  constructor(private bannerService: BannerService) {
    super();
  }

  public ngOnInit(): void {
    this.bannerService.displayBanner
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (bannerConfig) => {
          this.bannerMessage = bannerConfig.message;
          this.type = bannerConfig.type;
          this.visible = true;
          if (bannerConfig.closeTime) {
            setTimeout(() => {
              this.visible = false;
            }, bannerConfig.closeTime);
          }
        },
      });
  }
}
