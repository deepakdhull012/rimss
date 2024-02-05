import { Component } from '@angular/core';
import { IFooterColumn } from '../../interfaces/footer-column.interface';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'rimss-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent extends BaseComponent {

  public footerColumns: IFooterColumn[] = [
    {
      title: "Rimss",
      options: [
        {
          label: "RIMSS India"
        },
        {
          label: "contact@rimss.mail.com"
        },
        {
          label: "12345678910"
        }

      ]
    },
    {
      title: "Shopping & Categories",
      options: [
        {
          label: "Men’s Shopping"
        },
        {
          label: "Women’s Shopping"
        },
        {
          label: "Kid's Shopping"
        }
      ]
    },
    {
      title: "Useful Links",
      options: [
        {
          label: "Homepage"
        },
        {
          label: "About Us"
        },
        {
          label: "Help"
        },
        {
          label: "Contact us"
        }
      ]
    },
    {
      title: "Help & Information",
      options: [
        {
          label: "help"
        },
        {
          label: "FAQ"
        },
        {
          label: "Shipping"
        },
        {
          label: "Tracking"
        }
      ]
    }
  ]
}
