import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'provinceFilter'
})
export class ProvinceFilterPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if(value == 'กรุงเทพมหานคร'){
      return 'กรุงเทพ'
    }
    return value;
  }

}
