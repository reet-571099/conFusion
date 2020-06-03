import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { map, catchError } from 'rxjs/operators';
import { baseURL } from '../shared/baseurl';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ProcessHTTPMsgService } from './process-httpmsg.service'; 

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private http: HttpClient,
  private processHTTPMsgService: ProcessHTTPMsgService) { }

  getPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(baseURL + 'promotions')
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getPromotion(id: number): Observable<Promotion> {
    return this.http.get<Promotion>(baseURL + 'promotions/' + id)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return this.http.get<Promotion[]>(baseURL + 'promotions?featured=true')
      .pipe(map(promotions => promotions[0]))
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
  getPromotionIds(): Observable<string[] | any> {
    return of(PROMOTIONS.map(promo => promo.id ));
}
}