import { filterConditions } from "../typescriptModel/jobPost.model";


export const headerArray: filterConditions [] = [
  { 
    header: 'งานจากร้านยา โรงพยาบาลและคลินิกชั้นนำ',
    filterFlag: false,
    CategorySymbol:"BA",
    idList:['INGAXkwcFbbtQirdgRKMJW14Q7q1', 'Iw1OVpV7jPN9EhABx3j7uJQQcv53', 'eQPnLbi8z3e3G7ypwngwrOmDBLO2', 'ZuYHU61LlnORTv5Xwz7jXMXg6nm1','nDct5ztDnnObt4KEW2XxGZQNRwp2','lTdZbAZenmPW88Ra15Qfbr5ArQ33',  'bmq4q1c5D7bMRTxuHDEXBml800o2',  'jqAb1bpJOONmsfORePtGjjpxWdE2', 'ot1gOqcz4MZs5VCBB3XaLZmH7423',  'N7obV20LAIgiXYQSFKgr3FKOVMz2', 'tIdvsSSTLLhPbwp1eR3EAwUYmth1', 'Yf0nSGlwj7Ty5b6IDQYo8y1Kb282', 'N1JqQLcCLSfEQntq4Sl4e8IFOSt2', 'TwJV9DwkPbWj7mTRIhaWRFlueSY2', '6pSjZM6TGwbIEsq7rBoLf4d3y692','DHibmLGqGOfkjJVd3PRQgbWHspR2'],
    loading: true,
    allContent: [],
    count: 0,
    bannerFlag: false
  }, 
  { 
    header: 'งานจากบริษัทยาและโรงงานยาชั้นนำ',
    filterFlag: false,
    CategorySymbol:"CB",
    idList:['1U5HAQJLIvNUwC9IsrcY3oCRGqE2', 'D5bBevPK32dRLLIZ5ekpFkwoY5g1', 'DXZJU47ZyWe0duVys2kIqb19Jfq1', 'fEOa3NY1uxWx8SDQDJWsXUPkVj32'],
    allContent: [],
    loading: true,
    count: 0,
    bannerFlag: false
  },
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
    bannerType: 'long',
    count: 0,
    loading: true
  },
];

export default headerArray;