import { createAction, props } from '@ngrx/store';
import { UserPharma, notificationContent } from '../../model/user.model';

export const onSetUserNotifications = createAction(
  '[Notifications] On Set User Notifications',
  props<{ user: UserPharma }>()
  );

  
  
export const removeNotifications = createAction(
  '[Notifications] Remove Notifications',
  props<{ notification: notificationContent }>()
  );

  export const addNotifications = createAction(
  '[Notifications] Add Notifications',
  props<{ notifications: {
    [key:string]: notificationContent
  } }>()
  );

  export const modifyNotifications = createAction(
  '[Notifications] Modify Notifications',
  props<{ notification: notificationContent }>()
  );

