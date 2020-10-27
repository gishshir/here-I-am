export interface Geoportail {

    trajetid: number;
    // token pour construire url de la map geoportail
    token: string;
    gpxfile: string;
    // geoportail url
    url: string;

}

export interface Coord {

    lat: number,
    long: number
}