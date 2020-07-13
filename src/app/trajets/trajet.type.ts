import { TrajetState } from "./trajet-etat.enum";
import { TrajetMeans } from "./trajet-means.enum";

export interface Trajet {

    id: number;
    // date de début de trajet - timestamp en secondes
    starttime: number;
    // date de fin de trajet - timestamp en secondes
    endtime: number;
    etat: TrajetState;
    mean: TrajetMeans;
}
