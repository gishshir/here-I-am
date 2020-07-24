import { RelationState } from './relation/relationinfo.type';

export interface AmiRelation {

    id: number;
    suivre: boolean;
    notifier: boolean;
    etat: RelationState;

}
