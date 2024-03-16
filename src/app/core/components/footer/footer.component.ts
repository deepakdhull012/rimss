import { Component, OnInit } from '@angular/core';
import { IFooterColumn } from '../../interfaces/footer-column.interface';
import { BaseComponent } from '../base/base.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'rimss-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent extends BaseComponent implements OnInit {
  public footerColumns: IFooterColumn[] = [];
  constructor(private translate: TranslateService) {
    super();
  }

  public ngOnInit(): void {
    this.initFooter();
    
  }

  /**
   * Init footer items
   */
  private initFooter(): void {
    this.footerColumns = [
      {
        title: 'RIMSS',
        options: [
          {
            label: 'RIMSS India',
          },
          {
            label: 'contact@rimss.mail.com',
          },
          {
            label: '12345678910',
          },
        ],
      },
      {
        title: 'Shopping & Categories',
        options: [
          {
            label: 'Men’s Shopping',
          },
          {
            label: 'Women’s Shopping',
          },
          {
            label: "Kid's Shopping",
          },
        ],
      },
      {
        title: 'Useful Links',
        options: [
          {
            label: 'Homepage',
          },
          {
            label: 'About Us',
          },
          {
            label: 'Help',
          },
          {
            label: 'Contact us',
          },
        ],
      },
      {
        title: 'Help & Information',
        options: [
          {
            label: 'help',
          },
          {
            label: 'FAQ',
          },
          {
            label: 'Shipping',
          },
          {
            label: 'Tracking',
          },
        ],
      },
    ];
  }
}
