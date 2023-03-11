import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, CollectionReference, Query, QuerySnapshot } from '@angular/fire/compat/firestore';
import * as _ from 'lodash';
import { concatMap, forkJoin, map, Observable } from 'rxjs';
import { Favorite, UserPharma, UserSearchForm } from '../model/user.model';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private utilService:UtilService, private db: AngularFirestore) { }

  getAllPharmaUsers(){
    return this.db.collection('users', ref => ref.where('role', '==', 'เภสัชกร').where('showProfileFlag', '==', true).limit(10)).get()
  }

  getPharmaUserByJobType(title: string): Observable<UserPharma []>{
    return this.db.collection('users', ref => ref.where("preferredJobType", "array-contains", title)).valueChanges({idField: 'uid'}) as Observable<UserPharma []>
  }

  getFavorites(userUID:string){
    return this.db.collection('favorite', ref => ref.where('operatorUID', '==', userUID)).valueChanges({idField: 'favoriteUID'})
  }
  removeFavorite(favoriteID: string) {
    let newID = _.cloneDeep(favoriteID)
    return this.db.collection('favorite').doc(favoriteID).delete().catch((err)=>{
      return err;
    })
  }
  addFavorite(operatorUID: string, userUID: string){
    let payload: Partial<Favorite> = {
      operatorUID: operatorUID,
      userUID: userUID,
    }
    return this.db.collection('favorite').add(payload)
  }
  getUserFromJobRequest(userUID: string){
    return this.db.collection('users').doc(userUID).get().pipe(
      map((value:any)=>{
        return {
          ...value.data(),
          uid: value.id
        }
      })
    )
  }
  getListOfUsersFromJobRequests(array:string[]): Observable<UserPharma[]>{
    const reads = array.map((id: string)=> this.db.collection('users').doc(id).get());
    let join$ = forkJoin(reads);
    return join$.pipe(
      map((values)=>{
        return values.map((value:any)=>{
          return {
            ...value.data(),
            uid: value.id
          } as UserPharma
        });
      }))
  }
  getListOfUsersFromFavorites(array:Favorite[]){
    let newSrc = array.map((value: Favorite)=>{ return value.userUID});
    const reads = newSrc.map((id:string) => this.db.collection('users').doc(id).get());
    let join$ = forkJoin(reads);
    return join$.pipe(
      map((value)=>{
        return value.map((value)=>{
          let rawData: any = value.data() as UserPharma
          rawData['uid'] = value.id;
          let resultFavorite = array.find((originalBookmark)=>{
            return originalBookmark.userUID == rawData.uid
          })
          return {
            ...resultFavorite!,
            content: rawData
          }
        });
      }))
  }
  searchPharmaUsers(form:UserSearchForm){
    let newForm: any = _.cloneDeep(form);
    newForm = this.utilService.populateObjectWithLocationFields(newForm);
    return this.db.collection('users',ref =>{
      let query : CollectionReference | Query = ref;
      if (newForm.TimeFrame !== '' && newForm.TimeFrame !== undefined) { query = query.where('preferredTimeFrame', '==', newForm.TimeFrame) };
      if (newForm.WorkExperience !== '' && newForm.WorkExperience !== undefined) { query = query.where('WorkExperience','==', newForm.WorkExperience) };
      if (newForm.preferredDistrict !== '' && newForm.preferredDistrict !== undefined) { query = query.where('preferredDistrict', "==", newForm.preferredDistrict) };
      if (newForm.preferredProvince !== '' && newForm.preferredProvince !== undefined) { query = query.where('preferredProvince', "==", newForm.preferredProvince) };
      if (newForm.preferredSection !== '' && newForm.preferredSection !== undefined) { query = query.where('preferredSection', "==", newForm.preferredSection) };
      if (newForm.preferredJobType !== '' && newForm.preferredJobType !== undefined) { query = query.where('preferredJobType', "array-contains", newForm.preferredJobType) };
      if (newForm.preferredStartTime !== '' && newForm.preferredStartTime !== undefined) { query = query.where('preferredStartTime', "==", newForm.preferredStartTime) };
      if (newForm.AmountCompleted !== '' && newForm.AmountCompleted !== undefined) { query = query.where('AmountCompleted', "==", newForm.AmountCompleted) };
      query = query.where('role', '==', 'เภสัชกร')
      query = query.where('showProfileFlag', '==', true)
      return query;
    }).get();
  }
}
