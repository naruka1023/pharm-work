import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import {  map, Observable, take } from 'rxjs';
import { Bookmark, BookmarkList } from 'src/app/pharmacist/model/typescriptModel/jobPost.model';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.css']
})
export class BookmarkComponent {

  constructor(private store: Store, private db: AngularFirestore){}

  bookmarks$!: Observable<Bookmark[]>;
  emptyFlag$!: Observable<boolean>;

  ngOnInit(){
    this.bookmarks$ = this.store.select((state:any)=>{
      let bookmarks: BookmarkList = state.jobpost.Bookmarks;
      let bookmarkArray = []
      for (const [key, value] of Object.entries(bookmarks)) {
        bookmarkArray.push(value);
      }
      return bookmarkArray
    }).pipe(
      map((array)=>{
        return array
      })
    )
    this.emptyFlag$ = this.store.select((state: any)=>{
      return Object.keys(state.jobpost.Bookmarks).length === 0
    })
  }


}
