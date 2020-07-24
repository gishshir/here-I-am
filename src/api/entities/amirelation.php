<?php

/*
* représentation d'une ligne de la table person_rel / relation
*/
class AmiRelation {

    // id de la relation
    private int $id;

    // indique si le suivi de l'ami est actif
    private bool $suivre = false;
    // indique si  la notification de ses trajet vers l'ami est activé
    private bool $notifier = false;

    // etat de la relation pending | open | closed
    private string $etat;


    function get_id () : int {
        return $this->id;
    }
    function set_id (int $id) {
        $this->id = $id;
    }
    function set_suivre (bool $suivre) {
        $this->suivre = $suivre;
    }
    function is_suivre () : bool {
        return $this->suivre;
    }
    function set_notifier (bool $notifier) {
        $this->notifier = $notifier;
    }
    function is_notifier () : bool {
        return $this->notifier;
    }
    function set_etat (string $etat) {
        $this->etat = $etat;
    }
    function get_etat () : string {
        return $this->etat;
    }

    function toArray(): array {

        $infos = array (
            "id"=>$this->id,
            "suivre"=>$this->suivre,
            "notifier"=>$this->notifier,
            "etat"=>$this->etat
        );
        return $infos;
    }


}

?>