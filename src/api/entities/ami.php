<?php


class Ami  {

    public static $STATE = array ("Arret", "EnChemin", "Pause");

    private int $id;
    private string $pseudo;
    private string $etat;
    private bool $suivre = false;

    public function __construct (int $id, string $pseudo, string $etat, bool $suivre) {

        $this->id = $id;
        $this->pseudo = $pseudo;
        $this->etat = $etat;
        $this->suivre = $suivre;
    }

    function get_id () {
        return $this->id;
    }
    function set_etat (string $etat) {
        $this->etat = $etat;
    }
    function get_etat () : string {
        return $this->etat;
    }

    function set_suivre (bool $suivre) {
        $this->suivre = $suivre;
    }
    function is_suivre () : bool {
        return $this->suivre;
    }
    function toArray(): array {

        $infos = array (
            "id"=>$this->id,
            "pseudo"=>$this->pseudo,
            "etat"=>$this->etat,
            "suivre"=>$this->suivre
        );
        return $infos;
    }


    public static function fromJson  (object $jsonObj) : Ami {

        $id = (int) $jsonObj->id;
        $pseudo = $jsonObj->pseudo;
        $etat = $jsonObj->etat;
        $suivre = (bool) $jsonObj->suivre;

        return new Ami ($id, $pseudo, $etat, $suivre);
    }
}


?>