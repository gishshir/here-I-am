<?php

/*
* représentation d'une ligne de la table utilisateur
(sans les credentials)
*/
class Personne  {
    
    public static $STATE = array ("Arret", "EnChemin", "Pause", "NonConnu");

    private int $id;
    private string $pseudo;
    private string $etat;

    function get_id (): int {
        return $this->id;
    }
    function set_id (int $id) {
        $this->id = $id;
    }
    function set_etat (string $etat) {
        $this->etat = $etat;
    }
    function get_etat () : string {
        return $this->etat;
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
            "pseudo"=>$this->pseudo,
            "etat"=>$this->etat
        );
        return $info;
    }
}

?>