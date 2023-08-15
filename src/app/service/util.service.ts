import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  populateLocationFieldsWithObject(userForm:User){
    userForm.preferredLocation = {
      address : userForm.preferredAddress !== undefined? userForm.preferredAddress: '' ,
      Province: userForm.preferredProvince !== undefined? userForm.preferredProvince: '' ,
      District: userForm.preferredDistrict !== undefined? userForm.preferredDistrict: '' ,
      Section: userForm.preferredSection !== undefined? userForm.preferredSection: '' ,
    }
    delete userForm.preferredAddress;
    delete userForm.preferredProvince;
    delete userForm.preferredDistrict;
    delete userForm.preferredSection;
    return userForm
  }
  populateObjectWithLocationFields(userForm:User){
    const newUser: any = userForm;
    newUser.preferredAddress =  userForm.preferredLocation?.address !== undefined? userForm.preferredLocation.address: ''
    newUser.preferredDistrict =  userForm.preferredLocation?.District  !== undefined? userForm.preferredLocation.District: '' 
    newUser.preferredProvince =  userForm.preferredLocation?.Province  !== undefined? userForm.preferredLocation.Province: '' 
    newUser.preferredSection =  userForm.preferredLocation?.Section  !== undefined? userForm.preferredLocation.Section: '' ;
    delete newUser.preferredLocation;
    return newUser;
  }
}
