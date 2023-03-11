import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JobTypeConverterService {

  constructor() { }

  placeHolderObject: any = [
    {
      categorySymbol: "S",
      title: 'เภสัชกรที่สนใจงานด่วนรายวัน'
    },
    {
      categorySymbol: "AA",
      title: 'เภสัชกรที่สนใจงานร้านยาทั่วไป'
    },
    {
      categorySymbol: "AB",
      title: 'เภสัชกรที่สนใจงานร้านยา Brand'
    },
    {
      categorySymbol: "AC",
      title: 'เภสัชกรที่สนใจงานโรงพยาบาล'
    },
    {
      categorySymbol: "BA",
      title: 'เภสัชกรที่สนใจงานคลินิก'
    },
    {
      categorySymbol: "BB",
      title: 'เภสัชกรที่สนใจงานโรงงาน'
    },
    {
      categorySymbol: "BC",
      title: 'เภสัชกรที่สนใจงานบริษัท'
    },
    {
      categorySymbol: "CA",
      title: 'เภสัชกรที่สนใจงาวิจัย'
    },
    {
      categorySymbol: "CB",
      title: 'เภสัชกรที่สนใจงานอื่นๆ'
    },
  ]

  getPlaceHolderObject(){
    return this.placeHolderObject
  }

  getCategorySymbolFromTitle(title:string){
    let categorySymbol = '';
    switch(title){
      case "งานด่วนรายวัน":
        title = 'S'
        break;
      case "งานร้านยาทั่วไป":
        title = 'AA'
        break;
      case "งานร้านยา Brand":
        title = 'AB'
        break;
      case "งานโรงพยาบาล":
        title = 'AC'
        break;
      case "งานคลินิก":
        title = 'BA'
        break;
      case "งานโรงงาน":
        title = 'BB'
        break;
      case "งานบริษัท":
        title = 'BC'
        break;
      case "งาวิจัย":
        title = 'CA'
        break;
      case "งานอื่นๆ":
        title = 'CB'
        break;
    }
    return title;
    
  }
  getTitleFromCategorySymbol(categorySymbol:string){
    let title = '';
    switch(categorySymbol){
      case "S":
        title = 'งานด่วนรายวัน'
        break;
      case "AA":
        title = 'งานร้านยาทั่วไป'
        break;
      case "AB":
        title = 'งานร้านยา Brand'
        break;
      case "AC":
        title = 'งานโรงพยาบาล'
        break;
      case "BA":
        title = 'งานคลินิก'
        break;
      case "BB":
        title = 'งานโรงงาน'
        break;
      case "BC":
        title = 'งานบริษัท'
        break;
      case "CA":
        title = 'งาวิจัย'
        break;
      case "CB":
        title = 'งานอื่นๆ'
        break;
    }
    return title;
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
        case 'งาวิจัย': 
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
            jobLabel = 'งาวิจัย'
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
