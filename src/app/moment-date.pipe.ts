import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'momentDate',
  pure: true
})
export class MomentDatePipe implements PipeTransform {

  transform(value: moment.Moment, format: string ): string {
    return value.format(`${format}`);
  }
}
