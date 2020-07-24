<?php

/*
* resume de la relation (person_rel et relation)
*/
class RelationInfo implements IEntity {

    // id de la relation
    private int $id;

    // etat de la relation pending | open | closed
    private string $etat;

    // action prise par l'utilisateur (none | invitation | acceptee | refusee )
    private string $action;

    // action prise par l'ami (none | invitation | acceptee | refusee )
    private string $amiaction;

    function get_id () : int {
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
    function set_action (string $action) {
        $this->action = $action;
    }
    function get_action () : string {
        return $this->action;
    }
    function set_amiaction (string $amiaction) {
        $this->amiaction = $amiaction;
    }
    function get_amiaction () : string {
        return $this->amiaction;
    }
    function toArray(): array {

        $infos = array (
            "id"=>$this->id,
            "etat"=>$this->etat,
            "action"=>$this->action,
            "amiaction"=>$this->amiaction
        );
        return $infos;
    }


}

?>