import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';
import { User } from 'src/app/model/user.model';
import { coverPhotoLoadSuccessful, getCurrentUser, removeCurrentUser, setCurrentUser, toggleLoading, updateCoverPhoto, updateCoverPhotoOffset, updateCropProfilePicture, updateProfilePicture, upgradeToPharma } from '../actions/users.action';

// import { retrievedBookList } from './books.actions';
// import { Book } from '../book-list/books.model';

export const initialState: User = {
  loading: true,
  role: '',
  email: '',
  uid: '',
  name: '',
  surname: '',
  showProfileFlag: true,
  profilePictureUrl: '',
  coverPhotoPictureUrl: '',
  license: '',
  coverPhotoFlag: true,
  AmountCompleted: 0,
  WorkExperience: 0,
  yearFlag: true,
  contacts: {
    facebook: '',
    line: '',
    phone: '',
    email: ''
  },
  cropProfilePictureUrl: '',
  introText: '',
  nickName: '',
  highestEducation: '',
  dateUpdated: ''
};

export const usersReducer = createReducer(
  initialState,
  on(setCurrentUser, (state, { user }) => {
    return {
      ...state,
      ...user,
      loading:false
    }
  }),
  on(upgradeToPharma, (state, {license})=>{
    return{
      ...state,
      studentFlag:false,
      license: license
    }
  }),
  on(toggleLoading, (state)=>{
    return{
      ...state,
      loading:true
    }
  }),
  on(updateCoverPhotoOffset, (state, { offset }: any) => {
    return {
      ...state,
      coverPhotoOffset:offset
    }
  }),
  on(updateCoverPhoto, (state, { coverPhotoPictureUrl, offset }: any) => {
    return {
      ...state,
      coverPhotoOffset:offset,
      coverPhotoPictureUrl: coverPhotoPictureUrl
    }
  }),
  on(updateCropProfilePicture, (state, { cropProfilePictureUrl }: any) => {
    return {
      ...state,
      cropProfilePictureUrl:cropProfilePictureUrl
    }
  }),
  on(updateProfilePicture, (state, { profilePictureUrl }: any) => {
    return {
      ...state,
      profilePictureUrl:profilePictureUrl
    }
  }),
  on(coverPhotoLoadSuccessful, (state)=>{
    return{
      ...state,
      coverPhotoFlag: false
    }
  }),
  on(getCurrentUser, (state) => {
    return {
      ...state
    }
  }),
  on(removeCurrentUser, (state) => {
    return {
      ...initialState
    }
  }),
);


/*
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://github.com/ngrx/platform
*/