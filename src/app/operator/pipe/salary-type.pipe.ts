import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'salaryType'
})
export class SalaryTypePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    let newValue = '';
    switch(value){
      case 'Negotiable' :
        newValue = 'ตามตกลง'
      break;
      case 'CorporateStructure' :
        newValue = 'ตามโครงสร้างองค์กร'
      break;
      default:
        newValue = value
    }
    return newValue;
  }

}
