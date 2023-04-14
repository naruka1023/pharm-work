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
    count: 0,
    allContent: [],
    content: []
  },  
  { 
    header: 'งานร้านยาทั่วไป',
    filterFlag: true,
    dateFilter: false,
    JobType: false,
    timeFrame: true,
    location: true,
    brandToCategory:"แนะนำร้านยาใกล้คุณ",
    CategorySymbol:"AB",
    count: 0,
    allContent: [],
    content: []
  }, 
  { 
    header: 'งานร้านยาแบรนด์',
    filterFlag: true,
    dateFilter: false,
    JobType: false,
    timeFrame: true,
    location: true,
    brandToCategory: "แนะนำร้านยาแบรน์ทั้งหมด",
    CategorySymbol:"AC",
    count: 0,
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
    allContent: [],
    count: 0
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
    count: 0,
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
      count: 0,
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
      count: 0,
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
      CategorySymbol:"CB",
      count: 0
    }
  ];

export default headerArray;