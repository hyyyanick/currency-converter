import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ExchangeRateService } from '../services/exchange-rate.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.scss',
})
export class ConverterComponent {
  amount: number = 0;
  convertedAmount: number = 0;
  currentRate$: Observable<number>;
  subscription: Subscription;

  constructor(private exchangeRateService: ExchangeRateService) {
    this.subscription = this.exchangeRateService
      .realTimeExchangeRate()
      .subscribe();
    this.currentRate$ = this.exchangeRateService.rate$;
  }

  updateConvertedAmount() {
    const currentRate: number = this.exchangeRateService.getCurrentRate();
    this.convertedAmount = this.amount * currentRate;
  }
}
