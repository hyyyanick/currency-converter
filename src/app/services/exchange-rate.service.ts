import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExchangeRateService {
  private INTERVAL_SECONDS: number = 3000;
  private INITIAL_RATE: number = 1.1;
  private isFixedRateActive: boolean = false;
  private fixedRate: number | null = null;

  private _subject: BehaviorSubject<number> = new BehaviorSubject<number>(
    this.INITIAL_RATE
  );
  public rate$ = this._subject.asObservable();

  constructor() {}

  realTimeExchangeRate() {
    return interval(this.INTERVAL_SECONDS).pipe(
      map(() => {
        if (!this.isFixedRateActive) {
          const change: number = Math.random() * 0.1 - 0.05;
          const newRate: number = this._subject.value + change;
          this._subject.next(parseFloat(newRate.toFixed(5)));
        }
        this.isFixedRateActive = false;
      })
    );
  }

  getCurrentRate(): number {
    return this._subject.value;
  }

  setRate(newRate: number) {
    this.fixedRate = newRate;
    if (this.isFixedRateValid()) {
      this.isFixedRateActive = true;
      this._subject.next(newRate);
    } else {
      this.isFixedRateActive = false;
    }
  }

  isFixedRateValid(): boolean {
    const realTimeExchangeRate = this._subject.value;
    const variation = Math.abs(
      (realTimeExchangeRate - (this.fixedRate as number)) / realTimeExchangeRate
    );
    return variation < 0.02;
  }
}
