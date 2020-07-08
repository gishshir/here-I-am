import { TrajetState } from "./trajet-etat.enum";
import { TrajetMeans } from "./trajet-means.enum";

export interface Trajet {

    id:number;
    startDate: number;
    endDate: number;
    etat: TrajetState;
    means:TrajetMeans;
}
