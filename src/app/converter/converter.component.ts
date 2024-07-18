import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ExchangeRateService } from '../services/exchange-rate.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConversionHistory } from '../interfaces/conversion-history.interface';
import { MatTableModule } from '@angular/material/table';

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
    ReactiveFormsModule,
    MatTableModule,
  ],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.scss',
})
export class ConverterComponent implements OnDestroy {
  amount: number = 0;
  convertedAmount: number = 0;
  isEuroToUSD: boolean = true;
  conversionHistory: ConversionHistory[] = [];

  fixedRate: number | null = null;

  currentRate$: Observable<number>;
  subscription: Subscription;

  constructor(private exchangeRateService: ExchangeRateService) {
    this.subscription = this.exchangeRateService
      .realTimeExchangeRate()
      .subscribe(() => this.updateConvertedAmount());
    this.currentRate$ = this.exchangeRateService.rate$;
  }

  displayedColumns: string[] = [
    'realTimeRate',
    'fixedRate',
    'initialAmount',
    'convertedAmount',
  ];

  onConvertAmount(): void {
    this.updateConvertedAmount();
    this.addHistory();
    console.log(this.conversionHistory);
  }

  updateConvertedAmount() {
    const currentRate: number = this.exchangeRateService.getCurrentRate();
    if (this.isEuroToUSD) {
      this.convertedAmount = this.amount * currentRate;
    } else {
      this.convertedAmount = this.amount / currentRate;
    }
  }

  toggleCurrency() {
    this.isEuroToUSD = !this.isEuroToUSD;
    const temp: number = this.amount;
    this.amount = this.convertedAmount;
    this.convertedAmount = temp;
    this.updateConvertedAmount();
  }

  setFixedRate() {
    if (this.fixedRate) {
      this.exchangeRateService.setRate(this.fixedRate);
    }
  }

  addHistory() {
    const currentRate = this.exchangeRateService.getCurrentRate();
    const history: ConversionHistory = {
      realTimeRate: currentRate,
      fixedRate: this.fixedRate,
      initialAmount: this.amount,
      initialCurrency: this.isEuroToUSD ? 'EUR' : 'USD',
      convertedAmount: this.convertedAmount,
      convertedCurrency: this.isEuroToUSD ? 'USD' : 'EUR',
    };
    this.conversionHistory.unshift(history);
    if (this.conversionHistory.length > 5) {
      this.conversionHistory.pop();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
