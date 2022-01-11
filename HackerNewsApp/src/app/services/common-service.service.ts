import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public pageLoaderStateChanged = new EventEmitter<boolean>();
  public refreshStoryList = new EventEmitter();
  constructor() { }
}
