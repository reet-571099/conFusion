import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor() { }

  getPromotions(): Observable<Promotion[]> {
    return  of(PROMOTIONS).pipe(delay(2000));
    
  }
 
  getPromotion(id: string): Observable<Promotion> {
     
     return  of(PROMOTIONS.filter((promo) => (promo.id === id))[0]).pipe(delay(2000));
    
  }

  getFeaturedPromotion(): Observable<Promotion> {
     return  of(PROMOTIONS.filter((promo) => promo.featured)[0]).pipe(delay(2000));
     
  }
  getDishIds(): Observable<string[] | any> {
    return of(PROMOTIONS.map(promo => promo.id ));
}
}