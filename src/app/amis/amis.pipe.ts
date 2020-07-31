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

    switch (filter) {

      case AmisFilter.valide: return allAmis.filter((ami: Ami) => ami.etatrelation == RelationState.open);
      case AmisFilter.aValider: return allAmis.filter((ami: Ami) => ami.etatrelation == RelationState.pending);
      case AmisFilter.refuse: return allAmis.filter((ami: Ami) => ami.etatrelation == RelationState.closed);
    }

    return [];

  }

}

export enum AmisFilter {

  valide = "valide",
  aValider = "aValider",
  refuse = "refuse",
  tous = "tous"

}
