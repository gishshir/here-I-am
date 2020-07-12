import { AmiState } from './ami.etat.enum';

export interface Ami {

    idrelation: number;
    pseudo: string;
    etat: AmiState;
    suivre: boolean;
}
