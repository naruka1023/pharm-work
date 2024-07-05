import { filterConditions } from "../typescriptModel/jobPost.model";


export const headerArray: filterConditions [] = [
  // { 
  //   header: 'งานเภสัชกรรมจากหลายบริษัทชั้นนำในประเทศไทย',
  //   filterFlag: false,
  //   packageType: "B1",
  //   CategorySymbol:"CB",
  //   idList:[
  //   'INGAXkwcFbbtQirdgRKMJW14Q7q1', 'DXZJU47ZyWe0duVys2kIqb19Jfq1', 'bmq4q1c5D7bMRTxuHDEXBml800o2' , 'eQPnLbi8z3e3G7ypwngwrOmDBLO2', 
  //   'nDct5ztDnnObt4KEW2XxGZQNRwp2', '2TXopcELHIb26tlh1gEoJjD9eZD2', 'ot1gOqcz4MZs5VCBB3XaLZmH7423' , '6DkajGDTCOeIfNRfDMJTp4L8P1G2',
  //   'Iw1OVpV7jPN9EhABx3j7uJQQcv53', 'jqAb1bpJOONmsfORePtGjjpxWdE2', 'N7obV20LAIgiXYQSFKgr3FKOVMz2' , 'tIdvsSSTLLhPbwp1eR3EAwUYmth1', 
  //   'Yf0nSGlwj7Ty5b6IDQYo8y1Kb282', 'N1JqQLcCLSfEQntq4Sl4e8IFOSt2', 'lTdZbAZenmPW88Ra15Qfbr5ArQ33' , 'DHibmLGqGOfkjJVd3PRQgbWHspR2',
  //   '1U5HAQJLIvNUwC9IsrcY3oCRGqE2', 'fEOa3NY1uxWx8SDQDJWsXUPkVj32', 'QbZTJMev0KaCjwkcMg19TkazUsI2' , '6pSjZM6TGwbIEsq7rBoLf4d3y692',
  //   'TwJV9DwkPbWj7mTRIhaWRFlueSY2'
  //   ],
  //   loading: true,
  //   allContent: [],
  //   count: 0,
  //   bannerFlag: false
  // }, 
  { 
    header: 'งานจากบริษัทยาและโรงงานยาชั้นนำ',
    filterFlag: false,
    CategorySymbol:"BA",
    idList:[],
    allContent: [],
    loading: true,
    count: 0,
    bannerFlag: false
  },
  { 
    header: 'งานด่วนรายวัน',
    filterFlag: true,
    CategorySymbol:"AA",
    loading: true,
    count: 0,
    allContent: [],
    content: [],
    bannerFlag: false
  },  
  {
    CategorySymbol: 'A2',
    bannerFlag: true,
    packageType: 'A2',
    filterFlag: false,
    header: '',
    bannerList: [],
    bannerType: 'long',
    count: 0,
    loading: true
  },
  { 
    header: 'ร้านยาทั่วไป',
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
    header: 'ร้านยาแบรนด์',
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
    CategorySymbol: 'A3',
    bannerFlag: true,
    packageType: 'A3',
    filterFlag: false,
    header: '',
    bannerList: [],
    bannerType: 'long',
    count: 0,
    loading: true
  },
  { 
    header: 'โรงพยาบาล/คลินิก',
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
    header: 'โรงงาน/บริษัท/วิจัย',
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
    CategorySymbol: 'A4',
    bannerFlag: true,
    packageType: 'A4',
    filterFlag: false,
    header: '',
    bannerList: [],
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
];

export default headerArray;