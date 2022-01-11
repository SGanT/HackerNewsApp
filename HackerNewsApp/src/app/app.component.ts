import { Component, OnInit } from '@angular/core';
import { ItemService } from './services/item.service';
import { CommonService } from './services/common-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'HackerNewsApp';
  pageLoading = true;
  displayError = false;
  
  constructor(
    protected itemService: ItemService,
    protected commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.commonService.pageLoaderStateChanged.subscribe((state) => this.pageLoading = state);
  }

  
}
