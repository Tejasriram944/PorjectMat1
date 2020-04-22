import { Component, Input } from '@angular/core';

import { Post } from '../post-model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent {

  // post = [
  //   {title: 'first title', content: 'first content'},
  //   {title: 'second title', content: 'second content'},
  //   {title: 'third title', content: 'third content'},
  // ];

  @Input() post: Post[] = [];

}
