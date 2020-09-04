export interface Geoportail {

    id: number;
    trajetid: number;
    // token pour construire url de la map geoportail
    token: string;
    // date de fin de validité du token
    endtime: number;
    description: string;
    gpxfile: string;

}