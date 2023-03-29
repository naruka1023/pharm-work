import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JobTypeConverterService {

  constructor() { }

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
