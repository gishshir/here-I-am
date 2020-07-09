import { TrajetState } from "./trajet-etat.enum";
import { TrajetMeans } from "./trajet-means.enum";

export class Trajet {

    id:number;
    startDate: number;
    endDate: number;
    etat: TrajetState;
    mean:TrajetMeans;
}
