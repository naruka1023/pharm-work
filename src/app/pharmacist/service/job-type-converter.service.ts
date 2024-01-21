import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JobTypeConverterService {

  constructor() { }

  arrayToObjectUrgent(array:any){
    let placeHolderObject = {
      M: false,
      T: false,
      W: false,
      TH: false,
      F: false,
      SA: false,
      SU: false,
      NA: false,
    }
    array.forEach((jobType: any)=>{
      switch(jobType){
        case 'จันทร์': 
          placeHolderObject.M = true;
          break;
        case 'อังคาร': 
          placeHolderObject.T = true;
          break;
        case 'พุธ': 
          placeHolderObject.W = true;
          break;
        case 'พฤหัส': 
          placeHolderObject.TH = true;
          break;
        case 'ศุกร์': 
          placeHolderObject.F = true;
          break;
        case 'เสาร์': 
          placeHolderObject.SA = true;
          break;
        case 'อาทิตย์': 
          placeHolderObject.SU = true;
          break;
        case 'เวลาว่างไม่แน่นอน': 
          placeHolderObject.NA = true;
          break;
      }
    })
    return placeHolderObject;
  }

  objectToArrayUrgent(obj:any){
    let array = [];
    for(const [key, value] of Object.entries(obj)){
      if(obj[key] == true){
        let jobLabel = ''
        switch(key){
          case "M":
            jobLabel = 'จันทร์'
            break;
          case "T":
            jobLabel = 'อังคาร'
            break;
          case "W":
            jobLabel = 'พุธ'
            break;
          case "TH":
            jobLabel = 'พฤหัส'
            break;
          case "F":
            jobLabel = 'ศุกร์'
            break;
          case "SA":
            jobLabel = 'เสาร์'
            break;
          case "SU":
            jobLabel = 'อาทิตย์'
            break;
          case "NA":
            jobLabel = 'เวลาว่างไม่แน่นอน'
            break;
        }
        array.push(jobLabel);
      }
    }
    return array
  }
  arrayToObject(array:any){
    let placeHolderObject = {
      S: false,
      AA: false,
      AB: false,
      AC: false,
      BA: false,
      BB: false,
      BC: false,
      CA: false,
      CB: false
    }
    array.forEach((jobType: any)=>{
      switch(jobType){
        case 'งานด่วนรายวัน': 
          placeHolderObject.S = true;
          break;
        case 'งานร้านยาทั่วไป': 
          placeHolderObject.AA = true;
          break;
        case 'งานร้านยา Brand': 
          placeHolderObject.AB = true;
          break;
        case 'งานโรงพยาบาล': 
          placeHolderObject.AC = true;
          break;
        case 'งานคลินิก': 
          placeHolderObject.BA = true;
          break;
        case 'งานโรงงาน': 
          placeHolderObject.BB = true;
          break;
        case 'งานบริษัท': 
          placeHolderObject.BC = true;
          break;
        case 'งานวิจัย': 
          placeHolderObject.CA = true;
          break;
        case 'งานอื่นๆ': 
          placeHolderObject.CB = true;
          break;
      }
    })
    return placeHolderObject;
  }

  objectToArray(obj:any){
    let array = [];
    for(const [key, value] of Object.entries(obj)){
      if(obj[key] == true){
        let jobLabel = ''
        switch(key){
          case "S":
            jobLabel = 'งานด่วนรายวัน'
            break;
          case "AA":
            jobLabel = 'งานร้านยาทั่วไป'
            break;
          case "AB":
            jobLabel = 'งานร้านยา Brand'
            break;
          case "AC":
            jobLabel = 'งานโรงพยาบาล'
            break;
          case "BA":
            jobLabel = 'งานคลินิก'
            break;
          case "BB":
            jobLabel = 'งานโรงงาน'
            break;
          case "BC":
            jobLabel = 'งานบริษัท'
            break;
          case "CA":
            jobLabel = 'งานวิจัย'
            break;
          case "CB":
            jobLabel = 'งานอื่นๆ'
            break;
        }
        array.push(jobLabel);
      }
    }
    return array
  }
}
