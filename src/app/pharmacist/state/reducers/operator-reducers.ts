import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';
import headerArray from '../../model/data/uiKeys';
import { AppState, userOperator } from '../../model/typescriptModel/jobPost.model';
import { emptyOperatorData, setOperatorData, setOperatorJobs } from '../actions/operator.actions';

// import { retrievedBookList } from './books.actions';
// import { Book } from '../book-list/books.model';

const emptyOperator = {
  email: '',
  role: '',
  uid: '',
  Location: {
    Province: "",
    District: '',
    Section: ''
  },
  jobType: '',
  companyName: '',
  loadingOperator: true,
  companySize: '',
  productsAndServices: '',
  TravelInstructions: '',
  benefits: '',
  followers: 0
}
export const initialState: userOperator = {
  ...emptyOperator,
};
export const operatorReducer = createReducer(
  initialState,

  on(emptyOperatorData, (state)=>{
    return {
      ...initialState}
  }),
  on(setOperatorJobs, (state, {jobs}) =>{
    let formattedJobs: any = {}
    jobs.forEach((job)=>{
      formattedJobs[job.custom_doc_id] = job
    })
    return {
      ...state,
      operatorJobs: formattedJobs
    }
  }),
  on(setOperatorData, (state, {operator}) =>{
    let newOperator = _.cloneDeep(operator);
    return {
      ...state,
      ...newOperator,
      loadingOperator: false,
    }
  })
);


/*
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://github.com/ngrx/platform
*/