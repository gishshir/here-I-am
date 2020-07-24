import { RelationState } from './relation/relationinfo.type';

export interface Ami {

    idrelation: number;
    pseudo: string;
    etat: AmiState;
    suivre: boolean;
    notifier: boolean;
    etatrelation: RelationState;
}

export enum AmiState {

    Arret = "Arret",
    EnChemin = "EnChemin",
    Pause = "Pause",
    NonConnu = "NonConnu"

}
