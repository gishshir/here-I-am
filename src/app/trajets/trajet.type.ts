import { AppPosition } from './position.type';

export interface Trajet {

    id: number;
    // date de début de trajet - timestamp en secondes
    starttime: number;
    // date de fin de trajet - timestamp en secondes
    endtime: number;
    etat: TrajetState;
    mean: TrajetMeans;
}

export interface TrajetEtPositions {

    trajet: Trajet;
    positions: Array<AppPosition>
}

export enum TrajetMeans {

    pied = "Pied",
    velo = "Velo",
    moto = "Moto",
    voiture = "Voiture",
    bus = "Bus",
    train = "Train",
    avion = "Avion",
    bateau = "Bateau"
}

export enum TrajetState {

    started = "Started",
    ended = "Ended",
    pausing = "Pausing"
}

export interface OldTrajetsInfo {

    nombre: number,
    beforeTs: number,
    alerteNbDays: number
}

