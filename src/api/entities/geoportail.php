<?php


/*
* Bean incluant les informations complète sur un ami
*/
class GeoPortailInfo implements IEntity {

    
    private int $id;
    private int $trajetid;
    private string $token;
    private int $endtime;
    private string $description;
    private string $gpxfile;

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
    function set_token (string $token) {
        $this->token = $token;
    }
    function get_token () : string {
        return $this->token;
    }
    function get_endtime (): int {
        return $this->endtime;
    }
    function set_endtime (int $endtime) {
        $this->endtime = $endtime;
    }
    function set_description (string $description) {
        $this->description = $description;
    }
    function get_description () : string {
        return $this->description;
    }
    function set_gpxfile (string $gpxfile) {
        $this->gpxfile = $gpxfile;
    }
    function get_gpxfile () : string {
        return $this->gpxfile;
    }

    function toArray() : array {
        $info = array(
            "id"=>$this->id,
            "trajetid"=>$this->trajetid,
            "token"=>$this->token,
            "endtime"=>$this->endtime,
            "description"=>$this->description,
            "gpxfile"=>$this->gpxfile
        );
        return $info;
    }
 
}

?>