import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emptyField'
})
export class EmptyFieldPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
