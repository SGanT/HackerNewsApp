import { Component, Input, OnInit } from '@angular/core';
import { Item } from 'src/app/shared/item.model';

@Component({
  selector: 'app-story-item',
  templateUrl: './story-item.component.html',
  styleUrls: ['./story-item.component.scss']
})
export class StoryItemComponent implements OnInit {
  @Input()
  story: Item;

  @Input()
  users: Object = {};
  
  constructor() { }

  ngOnInit(): void {
  }

  onCardClick(event: PointerEvent, story) {
    if (!story.url) event.preventDefault();
  }

}
