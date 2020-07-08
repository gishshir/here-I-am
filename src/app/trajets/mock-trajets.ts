import { TrajetState } from "./trajet-etat.enum";
import { TrajetMeans } from './trajet-means.enum';
import { Trajet } from './trajet.type';

export const TRAJETS : Trajet[] = [

{id: 1, startDate: 1588382988000, endDate: 1588391220000, etat: TrajetState.ended, means: TrajetMeans.velo},
{id: 2, startDate: 1591252320000, endDate: 1591283643000, etat: TrajetState.ended, means: TrajetMeans.pied},
{id: 3, startDate: 1591048838350, endDate: -1, etat: TrajetState.started, means: TrajetMeans.voiture}

];


