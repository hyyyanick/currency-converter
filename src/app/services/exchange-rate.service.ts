import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {

  private INTERVAL_SECONDS: number = 3000;
  private INITIAL_RATE: number = 1.1;

  private _subject: BehaviorSubject<number> = new BehaviorSubject<number>(this.INITIAL_RATE);
  public rate$ = this._subject.asObservable();

  constructor() { }

  realTimeExchangeRate() {
    return interval(this.INTERVAL_SECONDS).pipe(map(() => {
      const change = (Math.random() * 0.1) - 0.05;
      const newRate = this._subject.value + change;
      this._subject.next(parseFloat(newRate.toFixed(5)));
    }));
  }

  getCurrentRate(): number {
    return this._subject.value;
  }

  setRate(newRate: number) {
    this._subject.next(newRate);
  }
}
