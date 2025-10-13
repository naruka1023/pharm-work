import { Component } from '@angular/core';
import { stripeTableKeys } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
  stripePricingTableId = stripeTableKeys.pricing_table_id;
  stripePublishableKey = stripeTableKeys.publishable_key;
}
