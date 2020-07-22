import { AccountState } from './account.state.enum';

export interface Account {

    id: number;
    userid: number;
    email: string;
    etat: AccountState;
}
