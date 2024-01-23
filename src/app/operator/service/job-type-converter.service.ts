import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JobTypeConverterService {

  constructor() { }
  placeHolderObject: {categorySymbol: string, title: string}[] = [
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
      title: 'เภสัชกรที่สนใจงานวิจัย'
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
      case "งานร้านยาแบรนด์":
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
      case "งานวิจัย":
        title = 'CA'
        break;
      case "งานอื่นๆ":
        title = 'CB'
        break;
    }
    return title;
    
  }
  getNewTitleFromCategorySymbol(categorySymbol:string){
    let title = '';
    switch(categorySymbol){
      case "S":
        title = 'เภสัชกรที่สนใจงานเภสัชรายวัน (freelance)'
        break;
        case "N":
        title = 'เภสัชกรที่สนใจงานทั่วไปทั้งหมด'
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
        title = 'งานวิจัย'
        break;
      case "CB":
        title = 'งานอื่นๆ'
        break;
    }
    return title;
  }
}
