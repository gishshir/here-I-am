<?php

/*
* représentation d'une ligne de la table trajet
*/
class Trajet  {
    
    public static $STATE = array ("Started", "Ended", "Pausing");

    public static $MEANS = array ("Pied", "Velo", "Moto", "Voiture", "Bus", "Train", "Avion", "Bateau");

    private int $id;
    private int $starttime;
    private int $endtime;
    private string $etat;
    private string $mean;

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
    function set_mean (string $mean) {
        $this->mean = $mean;
    }
    function get_mean () : string {
        return $this->mean;
    }
    function get_starttime (): int {
        return $this->starttime;
    }
    function set_starttime (int $starttime) {
        $this->starttime = $starttime;
    }
    function get_endtime (): int {
        return $this->endtime;
    }
    function set_endtime (int $endtime) {
        $this->endtime = $endtime;
    }

    function toArray() : array {
        $info = array(
            "id"=>$this->id,
            "starttime"=>$this->starttime,
            "endtime"=>$this->endtime,
            "etat"=>$this->etat,
            "mean"=>$this->mean
        );
        return $info;
    }
}

?>