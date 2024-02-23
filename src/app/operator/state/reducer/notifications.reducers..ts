import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';
import { addNotifications, modifyNotifications, onSetUserNotifications, removeNotifications } from '../actions/notifications.actions.';
import { notifications } from '../../model/user.model';


export const initialState: notifications = {
  user: {
  loading:true,
  content:{
    role: '',
    email: '',
    uid: '',
    license: '',
    showProfileFlag: false,
    urgentTimeFrame: '',
    urgentPreferredDay: [],
    preferredUrgentLocation: {
      Section: '',
      District: '',
      Province: ''
    },
    urgentDescription: '',
    name: '',
    surname: '',
    loading: false,
    AmountCompleted: 0,
    WorkExperience: 0,
    yearFlag: false,
    highestEducation: '',
    introText: '',
    dateUpdated: '',
    dateUpdatedUnix: 0,
    nickName: ''
  }
},
  notificationsArchive: {}
};

export const notificationsReducer = createReducer(
  initialState,
  on(onSetUserNotifications, (state, { user }) => {
    return {
      ...state,
      user:{
        content: user,
        loading:false
      }
    }
  }),
  on(addNotifications, (state, { notifications }) => {
    let newState = _.cloneDeep(state)
    Object.keys(notifications).forEach((key)=>{
      newState.notificationsArchive[key] = notifications[key]
    })
    return newState
  }),
  on(removeNotifications, (state, { notification }) => {
    let newState = _.cloneDeep(state)
    delete newState.notificationsArchive[notification.notificationID]
    return newState
  }),
  on(modifyNotifications, (state, { notification }) => {
    let newState = _.cloneDeep(state)
    newState.notificationsArchive[notification.notificationID] = {
      ...newState.notificationsArchive[notification.notificationID],
      ...notification
    }
    return newState
  }),
);
