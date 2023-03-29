import { filterConditions } from "../typescriptModel/jobPost.model";


export const headerArray: filterConditions [] = [
  { 
    header: 'งานเภสัชด่วนรายวัน',
    filterFlag: true,
    dateFilter: true,
    JobType: false,
    timeFrame: false,
    location: true,
    CategorySymbol:"AA",
    allContent: [],
    content: []
  },  
  { 
    header: 'งานร้านยาทั่วไป (Stand alone)',
    filterFlag: true,
    dateFilter: false,
    JobType: false,
    timeFrame: true,
    location: true,
    brandToCategory:"แนะนำร้านยาใกล้คุณ",
    CategorySymbol:"AB",
    allContent: [],
    content: []
  }, 
  { 
    header: 'งานร้านยา Brand (Chain)',
    filterFlag: true,
    dateFilter: false,
    JobType: false,
    timeFrame: true,
    location: true,
    brandToCategory: "แนะนำร้านยาแบรน์ทั้งหมด",
    CategorySymbol:"AC",
    allContent: [],
    content: []
  },  
  { 
    header: 'งานจากแบรนด์ร้านยาชั้นนำของประเทศไทย',
    filterFlag: false,
    dateFilter: false,
    JobType: false,
    timeFrame: false,
    location: false,
    CategorySymbol:"BA",
    allContent: []
  }, 
  { 
    header: 'งานโรงพยาบาล/งานคลินิก',
    filterFlag: true,
    dateFilter: false,
    JobType: true,
    timeFrame: true,
    location: true,
    brandToCategory: 'แนะนำโรงพยาบาลและคลินิกใกล้คุณ',
    CategorySymbol:"BB",
    allContent: [],
    content: []
  }, 
  { 
      header: 'งานโรงงาน/งานบริษัท/งานวิจัย',
      filterFlag: true,
      dateFilter: true,
      JobType: false,
      JobTypeTwo: true,
      timeFrame: false,
      brandToCategory: ' แนะนำโรงงานและบริษัททั้งหมด',
      location: true,
      CategorySymbol:"BC",
      allContent: [],
      content: []
    },
    { 
      header: 'งานอื่นๆ',
      filterFlag: true,
      dateFilter: false,
      JobType: false,
      timeFrame: true,
      location: true,
      CategorySymbol:"CA",
      allContent: [],
      content: []
    }, 
    { 
      header: 'งานจากบริษัทยาและโรงงานยาชั้นนำของประเทศไทย',
      filterFlag: false,
      dateFilter: false,
      JobType: false,
      timeFrame: false,
      location: false,
      CategorySymbol:"CB"
    }
  ];

export default headerArray;