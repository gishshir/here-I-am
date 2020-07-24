import { AmiState } from './ami.etat.enum';
import { RelationState } from './relation.etat.enum';

export interface Ami {

    idrelation: number;
    pseudo: string;
    etat: AmiState;
    suivre: boolean;
    notifier: boolean;
    etatrelation: RelationState;
}
