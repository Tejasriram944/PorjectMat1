import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post-model';

@Injectable({providedIn: 'root'})
export class PostService {
  private post: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}
  // getPost() is used for post-list.component.ts
  getPosts() {
    this.http
    .get<{Message: string, post: any}>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.post.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id
        };
      });
    }))
    .subscribe((transformedPosts) => {
      this.post = transformedPosts;
      this.postUpdated.next([...this.post]);
    });
  }

  // send getPostUpdateListener() to post-List.component.ts
  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
      'http://localhost:3000/api/posts/' + id
    );
  }

  // addPost() is used for post-create.component.ts
  // addPost(title: string, content: string) {
  //   const post: Post = { id: null, title, content };
  //   this.http.post<{message: string}>('http://localhost:3000/api/posts', post)
  //   .subscribe((responseData) => {
  //     console.log(responseData.message);
  //     this.post.push(post);
  //     this.postUpdated.next([...this.post]);
  //   });
  // }
  addPost(title: string, content: string) {
    const post: Post = { id: null, title, content };
    this.http
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe(responseData => {
        const id = responseData.postId;
        post.id = id;
        this.post.push(post);
        this.postUpdated.next([...this.post]);
        this.router.navigate(['/']);
      });
  }

  // update a post
  updatePost(id: string, title: string, content: string) {
    const post: Post = { id, title, content };
    this.http
      .put('http://localhost:3000/api/posts/' + id, post)
      .subscribe(response => {
        const updatedPosts = [...this.post];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.post = updatedPosts;
        this.postUpdated.next([...this.post]);
        this.router.navigate(['/']);
      });
  }

  // delete a post
  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.post.filter(post => post.id !== postId);
        this.post = updatedPosts;
        this.postUpdated.next([...this.post]);
      });
  }
}
