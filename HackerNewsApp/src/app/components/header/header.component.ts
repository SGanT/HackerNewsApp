import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    protected commonService: CommonService
  ) { }

  ngOnInit(): void {
  }

  refreshList() {
    this.commonService.refreshStoryList.emit();
  }

}
