<?php

// representation d'une ligne de la table account
class Account implements IEntity {

    public static $STATE = array ("open", "waiting", "close");

    private int $id;
    private int $userid;

    private string $email;
    private string $etat = "waiting";

    function get_id (): int {
        return $this->id;
    }
    function set_id (int $id) {
        $this->id = $id;
    }
    function get_userid (): int {
        return $this->userid;
    }
    function set_userid (int $userid) {
        $this->userid = $userid;
    }
    function set_email (string $email) {
        $this->email = $email;
    }
    function get_email () : string {
        return $this->email;
    }
    function set_etat (string $etat) {
        $this->etat = $etat;
    }
    function get_etat () : string {
        return $this->etat;
    }

    function toArray() : array {
        $info = array(
            "id"=>$this->id,
            "userid"=>$this->userid,
            "email"=>$this->email,
            "etat"=>$this->etat
        );
        return $info;
    }

}


?>