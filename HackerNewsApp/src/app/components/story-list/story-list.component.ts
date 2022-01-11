import { Component, EventEmitter, OnInit } from '@angular/core';
import { ItemService } from 'src/app/services/item.service';
import { CommonService } from 'src/app/services/common-service.service';
import { Item } from 'src/app/shared/item.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss']
})
export class StoryListComponent implements OnInit {
  stories: Item[] = [];
  storiesToLoad = 10;
  storyIds: number[] = [];
  users = {};

  storyIdsLoaded = new EventEmitter();
  
  constructor(
    protected itemService: ItemService,
    protected userService: UserService,
    protected commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.loadItems();  
     
    this.commonService.refreshStoryList.subscribe(() => {
      this.commonService.pageLoaderStateChanged.emit(true);
      this.stories = [];
      this.loadItems();
    });
  }

  public loadItems() {
    this.itemService.getMaxItemId().subscribe(id => {
      this.itemService.getRandomItems(this.storiesToLoad, 'story', id).subscribe(
        result => this.stories.push(result),
        err => console.warn(err),
        () => {
          this.stories = this.stories.sort( (a, b) => {
            !a.score ? a.score = 0 : false;
            !b.score ? b.score = 0 : false;
            return a.score - b.score;
          });
          this.loadUsers();
          console.log(this.stories); 
        });
    }); 
  }

  public loadUsers() {
    let userNames = this.stories.map(x => x.by);
    this.userService.getUsers(userNames).subscribe(result => {
      result.forEach(user => {
        this.users[user.id] = user;
      });
      if (this.stories.length > this.storiesToLoad) this.stories = this.stories.slice(0, this.storiesToLoad);
      this.commonService.pageLoaderStateChanged.emit(false);
    });
  }

}
