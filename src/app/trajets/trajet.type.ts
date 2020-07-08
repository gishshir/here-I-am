import { TrajetState } from "./trajet-etat.enum";

export interface Trajet {

    id:number;
    startDate: number;
    endDate: number;
    etat: TrajetState;
}
