import  { AmiState } from './ami.etat.enum';

export interface Ami {

    id: number;
    pseudo: string;
    etat: AmiState;
    suivre: boolean;
}
