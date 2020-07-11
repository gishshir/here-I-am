<?php

/*
* représentation d'une ligne de la table relation
(sans les id personne)
*/
class AmiRelation {

    private int $id;

    // indique si le suivi de l'ami est actif
    private bool $suivre = false;
    // indique si  la notification de ses trajet vers l'ami est activé
    private bool $notificationVers = false;
    // indique si l'ami autorise la notification de ses trajet vers l'utilisateur
    private bool $notifiePar = false;
    // indique si l'ami a demandé un suivi des trajets
    private bool $suiviPar = false;


    function get_id () : int {
        return $this->idrelation;
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

    function set_suiviPar (bool $suiviPar) {
        $this->suiviPar = $suiviPar;
    }
    function is_suiviPar () : bool {
        return $this->suiviPar;
    }

    function set_notificationVers (bool $notificationVers) {
        $this->notificationVers = $notificationVers;
    }
    function is_notificationVers () : bool {
        return $this->notificationVers;
    }

    function set_notifiePar (bool $notifiePar) {
        $this->notifiePar = $notifiePar;
    }
    function is_notifiePar () : bool {
        return $this->notifiePar;
    }
    function toArray(): array {

        $infos = array (
            "id"=>$this->id,
            "suivre"=>$this->suivre,
            "suiviPar"=>$this->suiviPar,
            "notificationVers"=>$this->notificationVers,
            "notifiePar"=>$this->notifiePar
        );
        return $infos;
    }

}

?>