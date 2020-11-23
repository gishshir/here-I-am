export class Journal {

    level: JournalLevel;
    timestampSec: number;
    message: string;

}

export enum JournalLevel {

    ERROR, WARN, INFO, DEBUG
}
