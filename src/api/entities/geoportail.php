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
    private Position $center;
    // url to geoportail
    private string $url;

    private array $tabGeoMarkers = array();

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

    function set_center (Position $center) {
        $this->center = $center;
    }
    function get_center () : Position {
        return $this->center;
    }

    function set_url (string $url) {
        $this->url = $url;
    }
    function get_url () : string {
        return $this->url;
    }
    
    function set_tabGeoMarkers (array $tabGeoMarkers) {
        $this->tabGeoMarkers = $tabGeoMarkers;
    }
    function get_tabGeoMarkers () : array {
        return $this->tabGeoMarkers;
    }

    function get_markersAsArrays ()  {

        // tableau de tableau
        $tab = array();
        foreach ($this->tabGeoMarkers as $geoMarker) { 
            array_push($tab, $geoMarker->toArray());
        }
        return $tab;
    }
    function toArray() : array {
        $info = array(
            "id"=>$this->id,
            "trajetid"=>$this->trajetid,
            "token"=>$this->token,
            "endtime"=>$this->endtime,
            "description"=>$this->description,
            "gpxfile"=>$this->gpxfile,
            "center"=> $this->center->toArray(),
            "url"=>$this->url,
            "markersOptions"=>$this->get_markersAsArrays()
        );
        return $info;
    }
 
}

// definit un point à afficher dans la carte geoportail
class GeoMarker {

    private string $x;
    private string $y;
    private string $content;

    function set_x (string $x) {
        $this->x = $x;
    }
  
    function set_y (string $y) {
        $this->y = $y;
    }

    function set_content (string $content) {
        $this->content = $content;
    }

    function toArray() : array {
        $info = array(
            "position"=>array(
                "x"=>(float)$this->x,
                "y"=>(float)$this->y,
                "projection"=>"CRS:84"
            ),
            "content"=>$this->content
        );
        return $info;
    }
}



?>