<?php

/*
* représentation d'une ligne de la table person_rel
*/
class AmiRelation {

    // id de la relation
    private int $id;

    // indique si le suivi de l'ami est actif
    private bool $suivre = false;
    // indique si  la notification de ses trajet vers l'ami est activé
    private bool $notifier = false;


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

    function toArray(): array {

        $infos = array (
            "id"=>$this->id,
            "suivre"=>$this->suivre,
            "notifier"=>$this->notifier
        );
        return $infos;
    }


}

?>