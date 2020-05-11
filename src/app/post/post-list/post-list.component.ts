import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post-model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {

  // post = [
  //   {title: 'first title', content: 'first content'},
  //   {title: 'second title', content: 'second content'},
  //   {title: 'third title', content: 'third content'},
  // ];

  posts: Post[] = [];
  private postsSub: Subscription;

  constructor(public postService: PostService) {}

  // ngOnInit() will create the initlization
  // .subscribe((posts: Post[]) here posts are the data from the post.service.ts
  ngOnInit() {
    this.postService.getPosts();
    this.postsSub = this.postService.getPostUpdateListener()
    .subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }

  // ngOnDestroy() will destroy if the post-List.component is not in use in future
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
