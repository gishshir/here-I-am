import { User } from './user.type';

export enum AccountState {

    Waiting = "Waiting",
    Open = "Open",
    Close = "Close"

}
export interface Account {

    id: number;
    userid: number;
    email: string;
    etat: AccountState;
}


export interface AccountInfo {

    utilisateur: User;
    account: Account;

}
