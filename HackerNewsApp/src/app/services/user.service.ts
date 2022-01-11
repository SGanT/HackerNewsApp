import { Injectable } from '@angular/core';
import { BaseHttpService } from '../shared/base-http-service.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../shared/user.model';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, delay, retryWhen, take, tap } from 'rxjs/operators';
 

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseHttpService {
  protected cache = {};

  constructor(protected httpClient: HttpClient) {
    super();
  }

  protected get servicePathName(): string {
    return 'user';
  }

  public getUser(id: string, useCache = true){
    if (this.cache[id] && useCache) return this.cache[id];

    return this.httpClient.get<User>( this.endpoint(`${id}.json`) )
      .pipe(
        tap(result => this.cache[id] = result)
      );
  }

  public getUsers(ids: string[]) {
    let requests = [];

    for (let i of ids) {
      requests.push( 
        this.getUser(i).pipe(
          catchError(err => this.errorHandler(err)),
          retryWhen(errors => errors.pipe(delay(2000), take(10)))
        )
      );
  }

    return forkJoin(requests) as Observable<User[]>;
   }

  protected errorHandler(err) {
    console.warn('Error occured', err);
    return throwError(err);
  }
}
