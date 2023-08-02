import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emptyFieldPipe'
})
export class EmptyFieldPipePipe implements PipeTransform {

  transform(value:any, ...args: unknown[]): unknown {
    if(value == '' || value == undefined || value == null){
      return 'ไม่ระบุ'
    }
    return value;
  }

}
