import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listValue',
})
export class ListValuePipe implements PipeTransform {

  public transform<T>(values: T[], joinChar = ', '): string {
    return values.join(joinChar);
  }

}
