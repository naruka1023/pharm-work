import { filterConditions } from "../typescriptModel/jobPost.model";


export const headerArray: filterConditions [] = [
  { 
    header: 'งานเภสัชด่วนรายวัน',
    filterFlag: true,
    CategorySymbol:"AA",
    loading: true,
    count: 0,
    allContent: [],
    content: [],
    bannerFlag: false
  },  
  { 
    header: 'งานจากร้านยา โรงพยาบาลและคลินิกชั้นนำ',
    filterFlag: false,
    CategorySymbol:"BA",
    loading: true,
    allContent: [],
    count: 0,
    bannerFlag: false
  }, 
  { 
    header: 'งานจากบริษัทยาและโรงงานยาชั้นนำของประเทศไทย',
    filterFlag: false,
    CategorySymbol:"CB",
    loading: true,
    count: 0,
    bannerFlag: false
  },
  { 
    header: 'งานร้านยาทั่วไป',
    filterFlag: true,
    brandToCategory:"แนะนำร้านยาใกล้คุณ",
    CategorySymbol:"AB",
    loading: true,
    count: 0,
    allContent: [],
    content: [],
    bannerFlag: false
  }, 
  { 
    header: 'งานร้านยาแบรนด์',
    filterFlag: true,
    brandToCategory: "แนะนำร้านยาแบรน์ทั้งหมด",
    CategorySymbol:"AC",
    loading: true,
    count: 0,
    allContent: [],
    content: [],
    bannerFlag: false
  },  
  {
    CategorySymbol: '',
    bannerFlag: true,
    filterFlag: false,
    header: '',
    bannerType: 'long',
    count: 0,
    loading: true
  },
  { 
    header: 'งานโรงพยาบาล/งานคลินิก',
    filterFlag: true,
    brandToCategory: 'แนะนำโรงพยาบาลและคลินิกใกล้คุณ',
    CategorySymbol:"BB",
    loading: true,
    count: 0,
    allContent: [],
    content: [],
    bannerFlag: false
  }, 
  { 
    header: 'งานโรงงาน/งานบริษัท/งานวิจัย',
    filterFlag: true,
    brandToCategory: ' แนะนำโรงงานและบริษัททั้งหมด',
    CategorySymbol:"BC",
    loading: true,
    count: 0,
    allContent: [],
    content: [],
    bannerFlag: false
  },
  {
    CategorySymbol: '',
    bannerFlag: true,
    filterFlag: false,
    header: '',
    bannerType: 'long',
    count: 0,
    loading: true
  },
  { 
    header: 'งานอื่นๆ',
    filterFlag: true,
    CategorySymbol:"CA",
    loading: true,
    count: 0,
    allContent: [],
    content: [],
    bannerFlag: false
  },
  {
    CategorySymbol: '',
    bannerFlag: true,
    filterFlag: false,
    header: '',
    bannerType: 'short',
    count: 0,
    loading: true
  },
  {
    CategorySymbol: '',
    bannerFlag: true,
    filterFlag: false,
    header: '',
    bannerType: 'long',
    count: 0,
    loading: true
  },
];

export default headerArray;