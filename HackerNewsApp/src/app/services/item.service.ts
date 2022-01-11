import { Injectable } from '@angular/core';
import { BaseHttpService } from '../shared/base-http-service.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { Item } from '../shared/item.model';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, delay, map, retryWhen, take, tap } from 'rxjs/operators';
 

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

   public getItem(id: number){
    return this.httpClient.get<Item>( this.endpoint(`${id}.json`) );
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

   public getTopStoriesIds(useCache = true) {
     if (this.cache['topStories'] && useCache) return of(this.cache['topStories']);

     return this.httpClient.get<number[]>( this.url('topstories.json') )
      .pipe(
        catchError(err => this.errorHandler(err)),
        retryWhen(errors => errors.pipe(delay(2000), take(10))),
        tap((result) => this.cache['topStories'] = result)
      );
   }

   public getRandomTopStoriesIds(n: number): Observable<number[]> {
     return this.getTopStoriesIds()
      .pipe(
        catchError(err => throwError(err)),
        map(
          (ids: number[]) => {
            let result = [];

            for (let i = 0; i < n; i++) {
              let randIndex = Math.floor( (Math.random()*ids.length) );
              result.push(ids[randIndex]);
              ids.splice(randIndex, 1);
            }
            return result;
          }
        )
      );
   }

   protected errorHandler(err) {
    console.warn('Error occured', err);
    return throwError(err);
   }
}
