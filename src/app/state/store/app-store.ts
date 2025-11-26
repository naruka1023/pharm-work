import { jobPostReducer } from 'src/app/pharmacist/state/reducers/job-post-reducers';
import { operatorReducer } from 'src/app/pharmacist/state/reducers/operator-reducers';
import { addressReducer } from '../reducer/address-reducer';
import { usersReducer } from '../reducer/users-reducers';
import { InjectionToken } from '@angular/core';

export const rootReducers: { [key: string]: any } = {
  user: usersReducer,
  address: addressReducer,
  operator: operatorReducer,
  jobpost: jobPostReducer,
};

export const INITIAL_STATE = new InjectionToken<any>('INITIAL_STATE');
