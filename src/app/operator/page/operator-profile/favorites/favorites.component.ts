import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { Favorite, FavoriteList } from 'src/app/operator/model/user.model';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent {
  constructor(private store: Store, private db: AngularFirestore){}

  favorites$!: Observable<Favorite[]>;

  ngOnInit(){
    this.favorites$ = this.store.select((state:any)=>{
      let favorites: FavoriteList = state.users.Favorites;
      let favoriteArray = []
      for (const [key, value] of Object.entries(favorites)) {
        favoriteArray.push(value);
      }
      return favoriteArray
    }).pipe(
      map((array)=>{
        return array
      })
    )
  }
}
