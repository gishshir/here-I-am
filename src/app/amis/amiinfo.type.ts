
import { RelationState } from './relation/relationinfo.type';

export interface AmiInfo {

    personne: AmiPersonne;
    relation: AmiRelation;

}

export interface AmiPersonne {

    id: number;
    pseudo: string;
    etat: string;

}



export interface AmiRelation {

    id: number;
    suivre: boolean;
    notifier: boolean;
    etat: RelationState;

}


