import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';
import { notifications } from '../../model/typescriptModel/users.model';
import { addNotifications, modifyNotifications, onSetJobNotifications, removeNotifications } from '../actions/notifications.actions.';


export const initialState: notifications = {
  job: {
  loading:true,
  content:{
    Amount: '',
    CategorySymbol: '',
    BTS: {
      Near: false,
      Station: ''
    },
    Establishment: '',
    Franchise: '',
    JobName: '',
    JobType: '',
    Location: {
      Section: '',
      District: '',
      Province: ''
    },
    MRT: {
      Near: false,
      Station: ''
    },
    SRT: {
      Near: false,
      Station: ''
    },
    ARL: {
      Near: false,
      Station: ''
    },
    OnlineInterview: false,
    WorkFromHome: false,
    Salary: {
      Amount: 0,
      Cap: 0,
      Suffix: ''
    },
    Contacts: {
      nameRepresentative: '',
      areaOfContact: '',
      phone: '',
      email: '',
      line: '',
      website: '',
      facebook: ''
    },
    JobDetails: '',
    TravelInstructions: '',
    qualityApplicants: '',
    jobBenefits: '',
    applyInstructions: '',
    OperatorUID: '',
    TimeFrame: '',
    Urgency: false,
    Duration: '',
    Active: false,
    DateOfJob: [],
    dateCreated: '',
    dateUpdated: '',
    dateUpdatedUnix: 0,
    custom_doc_id: ''
  }},
  notificationsArchive: {}
};

export const notificationsReducer = createReducer(
  initialState,
  on(onSetJobNotifications, (state, { jobPost }) => {
    return {
      ...state,
      job:{
        content: jobPost,
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
    newState.notificationsArchive[notification.notificationID] = notification
    return newState
  }),
);
