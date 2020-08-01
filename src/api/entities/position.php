<?php

/*
* représentation d'une ligne de la table geolocation
*/
class Position implements IEntity  {


    private int $id;
    private int $trajetid;
    private string $latitude;
    private string $longitude;
    private int $timestamp;

    function get_id (): int {
        return $this->id;
    }
    function set_id (int $id) {
        $this->id = $id;
    }

    function get_trajetid (): int {
        return $this->trajetid;
    }
    function set_trajetid (int $trajetid) {
        $this->trajetid = $trajetid;
    }

    function set_latitude (string $latitude) {
        $this->latitude = $latitude;
    }
    function get_latitude () : string {
        return $this->latitude;
    }

    function set_longitude (string $longitude) {
        $this->longitude = $longitude;
    }
    function get_longitude () : string {
        return $this->longitude;
    }

    function get_timestamp (): int {
        return $this->timestamp;
    }
    function set_timestamp (int $timestamp) {
        $this->timestamp = $timestamp;
    }

    function toArray(): array {

        $infos = array (
            "id"=>$this->id,
            "trajetid"=>$this->trajetid,
            "latitude"=>$this->latitude,
            "longitude"=>$this->longitude,
            "timestamp"=>$this->timestamp
        );
        return $infos;
    }

}


?>