
export interface AppPosition {

    trajetid: number;
    latitude: string;
    longitude: string;

    // timestamp en secondes
    timestamp: number

    // origine locale ou remote (bdd)
    locale: boolean;

}