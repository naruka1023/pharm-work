import { filterConditions } from "../typescriptModel/jobPost.model";


export const headerArray: filterConditions [] = [
  { 
    header: 'งานเภสัชด่วนรายวัน',
    filterFlag: true,
    CategorySymbol:"AA",
    loading: true,
    count: 0,
    allContent: [],
    content: []
  },  
  { 
    header: 'งานร้านยาทั่วไป',
    filterFlag: true,
    brandToCategory:"แนะนำร้านยาใกล้คุณ",
    CategorySymbol:"AB",
    loading: true,
    count: 0,
    allContent: [],
    content: []
  }, 
  { 
    header: 'งานร้านยาแบรนด์',
    filterFlag: true,
    brandToCategory: "แนะนำร้านยาแบรน์ทั้งหมด",
    CategorySymbol:"AC",
    loading: true,
    count: 0,
    allContent: [],
    content: []
  },  
  { 
    header: 'งานจากร้านยาชั้นนำ',
    filterFlag: false,
    CategorySymbol:"BA",
    loading: true,
    allContent: [],
    count: 0
  }, 
  { 
    header: 'งานโรงพยาบาล/งานคลินิก',
    filterFlag: true,
    brandToCategory: 'แนะนำโรงพยาบาลและคลินิกใกล้คุณ',
    CategorySymbol:"BB",
    loading: true,
    count: 0,
    allContent: [],
    content: []
  }, 
  { 
    header: 'งานโรงงาน/งานบริษัท/งานวิจัย',
    filterFlag: true,
    brandToCategory: ' แนะนำโรงงานและบริษัททั้งหมด',
    CategorySymbol:"BC",
    loading: true,
    count: 0,
    allContent: [],
    content: []
  },
  { 
    header: 'งานอื่นๆ',
    filterFlag: true,
    CategorySymbol:"CA",
    loading: true,
    count: 0,
    allContent: [],
    content: []
  }, 
  { 
    header: 'งานจากบริษัทยาและโรงงานยาชั้นนำของประเทศไทย',
    filterFlag: false,
    CategorySymbol:"CB",
    loading: true,
    count: 0
  }
];

export default headerArray;