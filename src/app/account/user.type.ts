export interface User {

    login: string;
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