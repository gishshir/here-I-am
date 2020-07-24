import { RelationState } from './relation.etat.enum';

export interface AmiRelation {

    id: number;
    suivre: boolean;
    notifier: boolean;
    etat: RelationState;

}
