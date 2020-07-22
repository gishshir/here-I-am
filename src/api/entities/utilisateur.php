<?php

// representation d'une ligne de la table utilisateur
// sans les infos Personne
class Utilisateur implements IEntity {

    private $id;
    private $login;
    private $password;
    private $pseudo;


    function get_id (): int {
        return $this->id;
    }
    function set_id (int $id) {
        $this->id = $id;
    }
    function set_login (string $login) {
        $this->login = $login;
    }
    function get_login () : string {
        return $this->login;
    }

    function set_password (string $password) {
        $this->password = $password;
    }
    function get_password () : string {
        return $this->password;
    }
    function set_pseudo (string $pseudo) {
        $this->pseudo = $pseudo;
    }
    function get_pseudo () : string {
        return $this->pseudo;
    }


    function toArray() : array {
        $info = array(
            "id"=>$this->id,
            "login"=>$this->login,
            "password"=>$this->password,
            "pseudo"=>$this->pseudo,
        );
        return $info;
    }


}


?>