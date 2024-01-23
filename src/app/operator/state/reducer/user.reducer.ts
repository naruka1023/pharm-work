import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';
import { AppState, Favorite, FavoriteList, UserPharma } from '../../model/user.model';
import { addFavorites, clearFavorites, funnelUsers, modifyUser, removeFavorite, setFavorites, SetUsersByJobType, toggleLoading, updateUsersByJobType } from '../actions/users-actions';
const emptyUsers = {
  S:  {
    short:{},
    long: {}
  },
  N: {
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
  on(modifyUser, (state, { categoryService, user }) => {
    let newState: any = _.cloneDeep(state);
    newState.users[categoryService].short[user.uid] = user
    return {
      ...newState,
      loading: false
    }
  }),
  on(funnelUsers, (state, { allUsers }) => {
    let newState: any = _.cloneDeep(state);
    Object.keys(allUsers).forEach((key)=>{
      newState.users[key].short = allUsers[key]
    })
    return {
      ...newState,
      loading: false
    }
  }),
  on(updateUsersByJobType, (state, {users, jobType}) => {
    let newState: any = _.cloneDeep(state);
    let newUsers: any = _.cloneDeep(users) as UserPharma[];
    let newJobType: any = _.cloneDeep(jobType);
    newUsers.forEach((newUser: UserPharma)=> {
      newState.users[newJobType].long[newUser.uid] = {
        ...newUser,
      }
    })
    return {
      ...newState
    }
  }),
  on(SetUsersByJobType, (state, {users, jobType}) => {
    let newState: any = _.cloneDeep(state);
    let newUsers: any = _.cloneDeep(users) as UserPharma[];
    let newJobType: any = _.cloneDeep(jobType);
    newState.users[newJobType].long = {};
    newUsers.forEach((newUser: UserPharma)=> {
      newState.users[newJobType].long[newUser.uid] = {
        ...newUser,
      }
    })
    return {
      ...newState
    }
  })
);