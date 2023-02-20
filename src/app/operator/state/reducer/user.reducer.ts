import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';
import { AppState } from '../../model/user.model';
import { funnelUsers } from '../actions/users-actions';
const emptyUsers = {
  S:  {
    short:[],
    long: []
  },
  AA: {
    short:[],
    long: []
  },
  AB: {
    short:[],
    long: []
  },
  AC: {
    short:[],
    long: []
  },
  BA: {
    short:[],
    long: []
  },
  BB: {
    short:[],
    long: []
  },
  BC: {
    short:[],
    long: []
  },
  CA: {
    short:[],
    long: []
  },
  CB: {
    short:[],
    long: []
  }
};
export const initialState: AppState = {
  loading: true,
  users: emptyUsers
};

export const usersReducer = createReducer(
  initialState,
  on(funnelUsers, (state, { users }) => {
    let newState = _.cloneDeep(state);
    newState.users =  _.cloneDeep(emptyUsers)
    users.forEach((user)=>{
      user.preferredJobType.forEach((jobType)=>{
        switch(jobType){
          case 'งานด่วนรายวัน': 
            newState.users.S.short.push(user);
            break;
          case 'งานร้านยาทั่วไป': 
            newState.users.AA.short.push(user);
            break;
          case 'งานร้านยา Brand': 
            newState.users.AB.short.push(user);
            break;
          case 'งานโรงพยาบาล': 
            newState.users.AC.short.push(user);
            break;
          case 'งานคลินิก': 
            newState.users.BA.short.push(user);
            break;
          case 'งานโรงงาน': 
            newState.users.BB.short.push(user);
            break;
          case 'งานบริษัท': 
            newState.users.BC.short.push(user);
            break;
          case 'งาวิจัย': 
            newState.users.CA.short.push(user);
            break;
          case 'งานอื่นๆ': 
            newState.users.CB.short.push(user);
            break;
        }
      })
    })
    return {
      ...newState,
      loading: false
    }
  }),
);