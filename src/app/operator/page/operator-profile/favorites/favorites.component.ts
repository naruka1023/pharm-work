import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { map, Observable } from 'rxjs';
import { Favorite, FavoriteList } from 'src/app/operator/model/user.model';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent {
  constructor(private store: Store){}

  favorites$!: Observable<Favorite[]>;
  emptyFlagNormal$!: Observable<boolean>
  emptyFlagUrgent$!: Observable<boolean>

  ngOnInit(){
    this.emptyFlagNormal$ = this.store.select((state: any)=>{
      let newFavorite = _.cloneDeep(state.users.Favorites)
      let finalFavorite: any = []
      for(const [key, value] of Object.entries(newFavorite)){
        let newValue: any = value
        if(newValue.content.preferredJobType!.indexOf('งานด่วนรายวัน') === -1 || newValue.content!.preferredJobType!.length > 1){
          finalFavorite.push(newValue)
        }
      }
      return finalFavorite.length == 0
    })
    this.emptyFlagUrgent$ = this.store.select((state: any)=>{
      let finalFavorite: any = []
      let newFavorite = _.cloneDeep(state.users.Favorites)
      for(const [key, value] of Object.entries(newFavorite)){
        let newValue: any = value
        if(newValue.content.preferredJobType!.indexOf('งานด่วนรายวัน') !== -1){
          finalFavorite.push(newValue)
        }
      }
      return finalFavorite.length == 0
    })
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
