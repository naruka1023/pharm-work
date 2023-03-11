import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';
import { AppState, Favorite, FavoriteList, UserPharma } from '../../model/user.model';
import { addFavorites, clearFavorites, funnelUsers, removeFavorite, setFavorites, SetUsersByJobType, toggleLoading } from '../actions/users-actions';
const emptyUsers = {
  S:  {
    short:{},
    long: {}
  },
  AA: {
    short:{},
    long: {}
  },
  AB: {
    short:{},
    long: {}
  },
  AC: {
    short:{},
    long: {}
  },
  BA: {
    short:{},
    long: {}
  },
  BB: {
    short:{},
    long: {}
  },
  BC: {
    short:{},
    long: {}
  },
  CA: {
    short:{},
    long: {}
  },
  CB: {
    short:{},
    long: {}
  }
};
export const initialState: AppState = {
  loading: true,
  users: emptyUsers,
  Favorites: {},
};

export const usersReducer = createReducer(
  initialState,
  on(toggleLoading, (state)=>{
    return {
      ...state,
      loading:true
    }
  }),
  on(setFavorites,(state, {favorites}) =>{
    let newState: AppState =  _.cloneDeep(state);
    let newFavorites: any = {};
    favorites.forEach((jr: Favorite)=>{
      let keys = jr.operatorUID + '-' + jr.userUID
      newFavorites[keys] = {
        ...jr
      }
    })
    return {
      ...newState,
      Favorites:newFavorites
      
    }
  }),
  on(removeFavorite, (state, {operatorUID, userUID}) =>{
    let newState: AppState =  _.cloneDeep(state);
    let keys = operatorUID + "-" + userUID
    delete newState.Favorites[keys];
    return {...newState}
  }),
  on(addFavorites, (state, { operatorUID, user, favoriteUID }) =>{
    let newState: AppState =  _.cloneDeep(state);
    let keys = operatorUID + "-" + user.uid
    newState.Favorites[keys] = {
      operatorUID: operatorUID,
      userUID: user.uid,
      favoriteUID: favoriteUID,
      content: user
    }
    return {
      ...newState
    }
  } ),
  on(clearFavorites, (state) =>{
    return {
      ...state, 
      Favorites: {}
    }
  }),
  on(funnelUsers, (state, { users }) => {
    let newState = _.cloneDeep(state);
    newState.users =  _.cloneDeep(emptyUsers)
    users.forEach((user: any)=>{
      user.preferredJobType?.forEach((jobType: string)=>{
        switch(jobType){
          case 'งานด่วนรายวัน': 
            newState.users.S.short[user.uid] = user;
            break;
          case 'งานร้านยาทั่วไป': 
            newState.users.AA.short[user.uid] = user;
            break;
          case 'งานร้านยา Brand': 
            newState.users.AB.short[user.uid] = user;
            break;
          case 'งานโรงพยาบาล': 
            newState.users.AC.short[user.uid] = user;
            break;
          case 'งานคลินิก': 
            newState.users.BA.short[user.uid] = user;
            break;
          case 'งานโรงงาน': 
            newState.users.BB.short[user.uid] = user;
            break;
          case 'งานบริษัท': 
            newState.users.BC.short[user.uid] = user;
            break;
          case 'งาวิจัย': 
            newState.users.CA.short[user.uid] = user;
            break;
          case 'งานอื่นๆ': 
            newState.users.CB.short[user.uid] = user;
            break;
        }
      })
    })
    return {
      ...newState,
      loading: false
    }
  }),
  on(SetUsersByJobType, (state, {users, jobType}) => {
    let newState: any = _.cloneDeep(state);
    let newUsers: any = _.cloneDeep(users) as UserPharma[];
    let newJobType: any = _.cloneDeep(jobType);
    newState.users[newJobType].long = {};
    newUsers.forEach((newUser: UserPharma)=> {
      newState.users[newJobType].long[newUser.uid] = newUser
    })
    return {
      ...newState
    }
  })
);