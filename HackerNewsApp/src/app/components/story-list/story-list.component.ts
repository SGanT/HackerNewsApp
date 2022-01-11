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
  storyIds: number[] = [];
  users = {};

  storyIdsLoaded = new EventEmitter();
  
  constructor(
    protected itemService: ItemService,
    protected userService: UserService,
    protected commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.loadStoryIds();

    this.commonService.refreshStoryList.subscribe(() => {
      this.commonService.pageLoaderStateChanged.emit(true);
      this.loadStoryIds();
    });

    this.storyIdsLoaded.subscribe(() => {
      this.loadStories(this.storyIds);
    });
  }

  public loadStories(ids: number[]) {
    this.itemService.getItems(ids).subscribe((result) => {
      let userNames = result.map(x => x.by);

      this.stories = result.sort((a, b) => {
        a.score === null ? a.score = 0 : false;
        b.score === null ? b.score = 0 : false;
        return a.score - b.score;
      });

      this.userService.getUsers(userNames).subscribe(result => {
        result.forEach(user => {
          this.users[user.id] = user;
        });
        this.commonService.pageLoaderStateChanged.emit(false);
      });
    });
  }

  public loadStoryIds() {
    this.itemService.getRandomTopStoriesIds(10).subscribe( 
      (result) => {
        this.storyIds = result;
        this.storyIdsLoaded.emit();
      },
      (error) => {
        console.warn('Error occured, see the details:\n', error);
      }
    );
  }

}
