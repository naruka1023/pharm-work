import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'workExperience'
})
export class WorkExperiencePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    let yearFlag = args[0]
    return yearFlag? value + ' ปี': value + ' เดือน';
  }
}
