export class Alerte {

    id: number;
    userid: number;
    type: AlerteType;
    message: string;
    timestamp: number;
}

export class CountAlerteInfo {

    nbWarning: number;
    nbInfo: number;


}

export enum AlerteType {
    info,
    warn
}