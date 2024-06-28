import { createAction, props } from '@ngrx/store';
import { jobPostModel } from 'src/app/model/user.model';
import { notificationContent } from '../../model/typescriptModel/users.model';
import { userOperator } from '../../model/typescriptModel/jobPost.model';

export const onSetJobNotifications = createAction(
  '[Notifications] On Set Job Notifications',
  props<{ jobPost: jobPostModel }>()
  );

export const removeNotifications = createAction(
  '[Notifications] Remove Notifications',
  props<{ notification: notificationContent }>()
  );

  export const addNotifications = createAction(
  '[Notifications] Add Notifications',
  props<{ notifications: {
    [key:string]: notificationContent,
  }
  size: number
 }>()
  );

  export const modifyNotifications = createAction(
  '[Notifications] Modify Notifications',
  props<{ notification: notificationContent }>()
  );

