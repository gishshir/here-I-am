import { AmiState } from './ami.etat.enum';

export interface Ami {

    relationid: number;
    pseudo: string;
    etat: AmiState;
    suivre: boolean;
}
