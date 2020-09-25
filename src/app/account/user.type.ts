export interface User {

    //id: number;
    login: string;
    //password: string;
    pseudo: string;
}

export interface CredentialsDto {

    login: string;
    password: string;
}

export interface AuthenticationDto {

    jwtoken: string;
    utilisateurDto: User;
}