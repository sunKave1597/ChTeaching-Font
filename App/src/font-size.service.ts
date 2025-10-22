// font-size.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FontSizeService {
  private fontSizeSubject = new BehaviorSubject<number>(16);
  fontSize$ = this.fontSizeSubject.asObservable();

  setFontSize(size: number) {
    this.fontSizeSubject.next(size);
    document.documentElement.style.setProperty('--font-size', `${size}px`);
  }

  getFontSize(): number {
    return this.fontSizeSubject.value;
  }
}