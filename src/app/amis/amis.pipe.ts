import { Pipe, PipeTransform } from '@angular/core';
import { Ami } from './ami.type';
import { RelationState } from './relation/relationinfo.type';

@Pipe({
  name: 'amiFilter'
})
export class AmisPipe implements PipeTransform {

  transform(allAmis: Ami[], filter: string): Ami[] {

    if (!filter || filter == AmisFilter.tous) {
      return allAmis;
    }

    return allAmis.filter((ami: Ami) => ami.etatrelation == RelationState.open);
  }

}

export enum AmisFilter {

  valides = "valides",
  tous = "tous"

}
