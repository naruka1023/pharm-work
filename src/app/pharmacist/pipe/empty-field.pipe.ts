import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emptyField'
})
export class EmptyFieldPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if(value == '' || value == undefined || value == null){
      return 'ไม่ระบุ'
    }
    return value;
  }

}
