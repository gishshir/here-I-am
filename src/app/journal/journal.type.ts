export class Journal {

    level: JournalLevel;
    timestampSec: number;
    message: string;
    caller: string;

}

export enum JournalLevel {

    ERROR, WARN, INFO, DEBUG
}
