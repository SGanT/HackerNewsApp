import { EventEmitter, Injectable } from '@angular/core';
import { BaseHttpService } from '../shared/base-http-service.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { Item } from '../shared/item.model';
import { forkJoin, interval, Observable, of, throwError } from 'rxjs';
import { catchError, delay, filter, flatMap, retryWhen, take, takeWhile, tap } from 'rxjs/operators';
 

@Injectable({
  providedIn: 'root'
})
export class ItemService extends BaseHttpService {

  protected cache = {};

  constructor(
      protected httpClient: HttpClient,
      protected userService: UserService
    ) {
    super();
   }

   protected get servicePathName(): string {
      return 'item';
   }

   public getItem(id: number, useCache = true){
    if (this.cache[id] && useCache) return of(this.cache[id]) as Observable<Item>;

    return this.httpClient.get<Item>( this.endpoint(`${id}.json`) )
      .pipe(
        catchError(err => this.errorHandler(err)),
        retryWhen(errors => errors.pipe(delay(2000), take(10))),
        tap(item => this.cache[id] = item)
      );
   }

   public getItems(ids: number[]) {
    let requests = [];

    for (let i of ids) {
      requests.push( 
        this.getItem(i).pipe(
          catchError(err => this.errorHandler(err)),
          retryWhen(errors => errors.pipe(delay(2000), take(10)))
        )
      );
    }

    return forkJoin(requests) as Observable<Item[]>;
   }

   public getMaxItemId() {
     return this.httpClient.get<number>(this.url('maxitem.json'));
   }

  public getRandomItems(n: number, type = "story", maxId = 0) {
    let storyCount = 0;
    return interval(80).pipe(
      takeWhile(i => storyCount < n),
      flatMap(() => {
        let randomId = this.randomNumber(maxId);
        return this.getItem(randomId);
      }),
      filter(i => i.type == type && !i.deleted), 
      tap(i => {
        storyCount++;
      })
    );
  }

  public randomNumber(max: number) {
    return Math.floor( (Math.random() * max) );
  }

  protected errorHandler(err) {
    console.warn('Error occured', err);
    return throwError(err);
   }
}
