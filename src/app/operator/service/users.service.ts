import { Injectable, inject } from '@angular/core';
import * as _ from 'lodash';
import { Favorite, User, UserPharma, UserSearchForm, UserUrgentSearchForm, requestView, requestViewList, requestViewState } from '../model/user.model';
import { DocumentData, Firestore, QuerySnapshot, Unsubscribe, addDoc, collection, deleteDoc, doc, getCountFromServer, getDoc, getDocs, limit, onSnapshot, query, where } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { modifyRequestView, removeRequestView, setRequestView } from '../state/actions/request-view.actions';
import { jobRequest } from '../model/jobPost.model';
import { JobTypeConverterService } from './job-type-converter.service';
import algoliasearch, { SearchIndex }from 'algoliasearch';
import { algoliaEnvironment } from 'src/environments/environment';
import { UtilService } from './util.service';
import { FormGroup } from '@angular/forms';

const client = algoliasearch(algoliaEnvironment.app_id, algoliaEnvironment.user_api_key);
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  hitsPerPage: number = 8
  private db: Firestore = inject(Firestore) 
  constructor(private converter:JobTypeConverterService, private store: Store, private utilService:UtilService) { }

  async searchPharmaUsersByPreferredJobType(form:UserSearchForm, categorySymbol: string){
    let newForm = this.utilService.populateObjectWithLocationFields(form)
    let query = ''
    let indexName = 'pharm-work_user_index'
    Object.keys(newForm).forEach((key, index)=>{
      if(key == 'WorkExperience' && newForm[key] !== ''){
        indexName = 'pharm-work_user_index_workExperience_desc'
      }
      if(newForm[key] !== ''){
        if(query == ''){
          if(key == 'WorkExperience'){
            query = key + " <= " + newForm[key] + ""
          }else{
            query = key + ":'" + newForm[key] + "'"
          }
        }else{
          if(key == 'WorkExperience'){
            query = query + ' AND ' + key + " <= " + newForm[key] + ""
          }else{
            query = query + ' AND ' + key + ":'" + newForm[key] + "'"
          }
        }
      }
    })
    query = (query == '')?"":" AND " + query
    let index:SearchIndex = client.initIndex(indexName)
    let filter = "role:'เภสัชกร'" + query + " AND preferredJobType:'" + this.converter.getTitleFromCategorySymbol(categorySymbol) + "'"
    let user = await index.search('',{
              hitsPerPage: this.hitsPerPage,
              page:0,
              filters: filter
            })
    let allUsers:UserPharma[] = []
    user.hits.forEach((hit:any)=>{
        let newHit = _.cloneDeep(hit);
        newHit.uid = newHit.objectID
        delete newHit.objectID
        allUsers.push(newHit)
      })
    return {
      results: allUsers,
      query: filter,
      indexName: indexName,
      totalPage: user.nbPages
    }
  }
  async searchPharmaUsersUrgentByPreferredJobType(form:UserUrgentSearchForm){
    let newForm = this.utilService.populateObjectWithLocationFields(form)
    let query = ''
    let indexName = 'pharm-work_user_index'
    if(newForm.amountCompletedSort !== ''){
      indexName = 'pharm-work_user_index_AmountCompleted_' + newForm['amountCompletedSort']
    }
    let index:SearchIndex = client.initIndex(indexName)
    let requestOptions: any = 
    {
      hitsPerPage:this.hitsPerPage,
      page:0,
    }
    if(!newForm.nearbyFlag){
      if(newForm.preferredSection !== ''){
        query = ' AND preferredSection:' + newForm.preferredSection
      }
      if(newForm.preferredDistrict !== ''){
        query = ' AND preferredDistrict:' + newForm.preferredDistrict
      }
      if(newForm.preferredProvince !== ''){
        query = ' AND preferredProvince:' + newForm.preferredProvince
      }
    }else{
      requestOptions.aroundLatLng = form._geoloc?.lat + ', ' + form._geoloc?.lng 
      if(form.radius !== ''){
        requestOptions.aroundRadius = form.radius
      }
    }
    let filter = "role:'เภสัชกร'" + query + " AND preferredJobType:'" + this.converter.getTitleFromCategorySymbol('S') + "'"
    requestOptions.filters = filter
    let users = await index.search('',requestOptions)
    let allUsers:UserPharma[] = []
    users.hits.forEach((hit:any)=>{
        let newHit = _.cloneDeep(hit);
        newHit.uid = newHit.objectID
        delete newHit.objectID
        allUsers.push(newHit)
      })
    return {
      results: allUsers,
      query: filter,
      indexName: indexName,
      totalPage: users.nbPages
    }
  }
  async searchPharmaUsersUrgent(form:UserUrgentSearchForm){
    let newForm = this.utilService.populateObjectWithLocationFields(form)
    let query = ''
    let indexName = 'pharm-work_user_index'
    if(newForm.amountCompletedSort !== ''){
      indexName = 'pharm-work_user_index_AmountCompleted_' + newForm['amountCompletedSort']
    }
    let index:SearchIndex = client.initIndex(indexName)
    let requestOptions: any = 
    {
      hitsPerPage:5,
      page:0,
    }
    if(!newForm.nearbyFlag){
      if(newForm.preferredSection !== ''){
        query = ' AND preferredSection:' + newForm.preferredSection
      }
      if(newForm.preferredDistrict !== ''){
        query = ' AND preferredDistrict:' + newForm.preferredDistrict
      }
      if(newForm.preferredProvince !== ''){
        query = ' AND preferredProvince:' + newForm.preferredProvince
      }
    }else{
      requestOptions.aroundLatLng = form._geoloc?.lat + ', ' + form._geoloc?.lng 
      requestOptions.aroundRadius = form.radius
    }
    let filter = "role:'เภสัชกร'" + query + " AND preferredJobType:'" + this.converter.getTitleFromCategorySymbol('S') + "'"
    requestOptions.filters = filter
    let users = await index.search('',requestOptions)
    let finalUsers = users.hits.map((hit:any)=>{
      let newHit = _.cloneDeep(hit);
      newHit.uid = newHit.objectID
      delete newHit.objectID
      return newHit
    }) as unknown as UserPharma[]
    let payload : {
      S: {
        [key:string]: UserPharma
      }
    } = {
      S: {}
    }
    finalUsers.forEach((user)=>{
      payload.S[user.uid] = user
    })
    return payload
  }
  async searchPharmaUsers(form:UserSearchForm){
    let newForm = this.utilService.populateObjectWithLocationFields(form)
    let query = ''
    let indexName = 'pharm-work_user_index'
    Object.keys(newForm).forEach((key, index)=>{
      if(key == 'WorkExperience' && newForm[key] !== ''){
        indexName = 'pharm-work_user_index_workExperience_desc'
      }
      if(newForm[key] !== ''){
        if(query == ''){
          if(key == 'WorkExperience'){
            query = key + " <= " + newForm[key] + ""
          }else{
            query = key + ":'" + newForm[key] + "'"
          }
        }else{
          if(key == 'WorkExperience'){
            query = query + ' AND ' + key + " <= " + newForm[key] + ""
          }else{
            query = query + ' AND ' + key + ":'" + newForm[key] + "'"
          }
        }
      }
    })
    query = (query == '')?"":" AND " + query
    let promises: any = []
    let index:SearchIndex = client.initIndex(indexName)
    this.converter.getPlaceHolderObject().forEach((placeHolder)=>{
      if(placeHolder.categorySymbol !== 'S'){
        let filter = "role:'เภสัชกร'" + query + " AND preferredJobType:'" + this.converter.getTitleFromCategorySymbol(placeHolder.categorySymbol) + "'"
        promises.push(
           index.search('',{
            hitsPerPage:5,
            page:0,
            filters: filter
          })
        )
      }
    })
    let users = await Promise.all(promises)
    let allUsers: {
      [key: string]: {
        [key:string]: UserPharma
      }
    } = {}
    users.forEach((usersByJobType, index)=>{
      let placeholder = this.converter.getPlaceHolderObject()[index]
      usersByJobType.hits.forEach((hit:any)=>{
        let newHit = _.cloneDeep(hit);
        newHit.uid = newHit.objectID
        delete newHit.objectID
        if(placeholder.categorySymbol !== 'S'){
          if(allUsers[placeholder.categorySymbol] == undefined){
            allUsers[placeholder.categorySymbol] = {}
          }
          allUsers[placeholder.categorySymbol][newHit.uid] = 
            {
              ...newHit as UserPharma, 
              uid: newHit.uid
            }
        }
      })
    })
    return allUsers
  }

    async getAllPharmaUsers(){
      let promises: any = []
      this.converter.getPlaceHolderObject().forEach((placeHolder)=>{
        promises.push(
          getDocs(query(collection(this.db, 'users'), where('role', '==', 'เภสัชกร'),limit(5), where('preferredJobType', 'array-contains', this.converter.getTitleFromCategorySymbol(placeHolder.categorySymbol))))
        )
      })
      let users: QuerySnapshot<DocumentData>[] = await Promise.all(promises)
      let allUsers: {
        [key: string]: {
          [key:string]: UserPharma
        }
      } = {}
      users.forEach((usersByJobType, index)=>{
        let placeholder = this.converter.getPlaceHolderObject()[index]
        usersByJobType.docs.forEach((hit)=>{
          let newHit = _.cloneDeep(hit);
          if(allUsers[placeholder.categorySymbol] == undefined){
            allUsers[placeholder.categorySymbol] = {}
          }
          allUsers[placeholder.categorySymbol][newHit.id] = 
            {
              ...newHit.data() as UserPharma, 
              uid: newHit.id
            }
        })
      })
      return allUsers
    } 

  async getNumberOfFollowers(operatorUID: string){
    let count = await getCountFromServer(query(collection(this.db, 'followers'), where('operatorUID', '==', operatorUID)))
    return count.data().count
  }

  async paginateJobTypeResult(form:FormGroup<any>, type: string, paginationIndex: number, query: string, indexName2: string){
    let indexName = indexName2
    let index:SearchIndex = client.initIndex(indexName)
    let searchOptions: any = {
      hitsPerPage:this.hitsPerPage,
      page:paginationIndex,
      filters: 
        query
    } 
    if(type == 'S' && form.value.nearbyFlag){
      searchOptions.aroundLatLng = form.value._geoloc?.lat + ', ' + form.value._geoloc?.lng 
      searchOptions.aroundRadius = form.value.radius
    }
    let doc = await index.search('',searchOptions)
    return doc.hits.map((hit: any)=>{
      let newHit: UserPharma = _.cloneDeep(hit);
      newHit.uid = newHit.objectID!
      delete newHit.objectID
      return newHit
    })
  }

  async getPharmaUserByJobType(title: string, paginationIndex: number){
    let indexName = 'pharm-work_user_index'
    let index:SearchIndex = client.initIndex(indexName)
    let filter = "role:'เภสัชกร' AND preferredJobType:'" + title + "'"
    let doc = await index.search('', {
      hitsPerPage:this.hitsPerPage,
      page:paginationIndex,
      filters: 
        filter
    })
    return {
      result: doc.hits.map((hit: any) => {
        let newHit: UserPharma = _.cloneDeep(hit);
        newHit.uid = newHit.objectID!;
        delete newHit.objectID;
        return newHit
      }),
      totalPage: doc.nbPages,
      query:filter
    }
  }

  async getFavorites(userUID:string){
    let docs = await getDocs(query(collection(this.db, 'favorite'), where('operatorUID', '==', userUID)))
    return docs.docs.map((favorite)=>{
      return {
        ...favorite.data(),
        favoriteUID: favorite.id
      } as Favorite  
    })
  }

  removeFavorite(favoriteID: string) {
    let newID = _.cloneDeep(favoriteID)
    return deleteDoc(doc(this.db, 'favorite', 'favoriteID'))
  }

  addFavorite(operatorUID: string, userUID: string){
    let payload: Partial<Favorite> = {
      operatorUID: operatorUID,
      userUID: userUID,
    }
    return addDoc(collection(this.db, 'favorite'), payload)
  }

  async getUserFromJobRequest(payload: jobRequest): Promise<UserPharma>{
    let userDoc = await getDoc(doc(this.db, 'users', payload.userUID))
    return {
      ...userDoc.data(),
      uid: userDoc.id
    } as UserPharma
  }

  async getListOfUsersFromJobRequests(array:string[]): Promise<UserPharma[]>{
    let promises: Promise<any>[] = []
    array.forEach((id: string) => {
      promises.push(getDoc(doc(this.db, 'users', id.split('-')[1])))
    })
    let result = await Promise.all(promises)
    return result.map((value,index)=>{
      return {
        ...value.data(),
        uid: value.id,
        requestUID: array[index].split('-')[0]
      } as UserPharma
    })    
  }

  createRequestView(request:requestView){
    return addDoc(collection(this.db, 'request-view'), request)
  }

  cancelRequest(jobRequestUID: string){
    return deleteDoc(doc(this.db, 'job-request', jobRequestUID))
  }

  removeRequestView(requestViewUID: string){
    return deleteDoc(doc(this.db, 'request-view', requestViewUID))
  }   

  getRequestView(operatorUID: string): Unsubscribe{
    return onSnapshot(query(collection(this.db, 'request-view'), where('operatorUID', '==', operatorUID)), (values)=>{
      values.docChanges().forEach((value)=>{
        let requestView: requestViewState = {
          payload: {
            ...value.doc.data(),
            requestViewUID: value.doc.id
          } as requestView,
          type: value.type
        }
          switch(requestView.type){
            case 'added':
              this.getUserFromRequestView(requestView.payload).then((requestView: requestView)=>{
                let requestViewList: requestViewList = {}
                let key: string = requestView.userUID + '-' + requestView.operatorUID
                requestViewList[key] = requestView
                this.store.dispatch(setRequestView({requestViewList: requestViewList}))
              })
              break;
            case 'removed':
              this.store.dispatch(removeRequestView({requestView: requestView.payload}))
              break;
            case 'modified':
              this.store.dispatch(modifyRequestView({requestView:requestView.payload}))
            break;
          }
      })
    })
  }

  async getUserFromRequestView(requestView:requestView): Promise<requestView>{
    let value = await getDoc(doc(this.db, 'users', requestView.userUID))
    let rawData: UserPharma = value.data() as UserPharma
    return {  
      ...requestView!,
      content: {
        ...rawData,
        uid:requestView.userUID
      } as UserPharma
    }
  }

  async getListOfUsersFromFavorites(array:Favorite[]){
    let promises: Promise<any>[] = []
    array.forEach((value: Favorite)=>{
      promises.push(getDoc(doc(this.db, 'users', value.userUID)))
    })
    let result =  await Promise.all(promises)
    return result.map((value)=>{
      let rawData: UserPharma = value.data() as UserPharma
      rawData.uid = value.id;
      let resultFavorite = array.find((originalBookmark)=>{
        return originalBookmark.userUID == rawData.uid
      })
      return {
        ...resultFavorite!,
        content: rawData
      } as Favorite
    });
  }
}
