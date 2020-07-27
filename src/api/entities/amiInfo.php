<?php


/*
* Bean incluant les informations complète sur un ami
*/
class AmiInfo implements IEntity {


    // information sur la personne amie
    private Personne $personne;

    // information sur la relation avec cette personne
    private AmiRelation $relation;

    function get_id() : int {
        return ($this->personne)?$this->personne->get_id():-1;
    }


    function get_personne () : Personne {
        return $this->personne;
    }
    function set_personne (Personne $personne) {
        $this->personne = $personne;
    }
    

    function get_relation () : AmiRelation {
        return $this->personne;
    }
    function set_relation (AmiRelation $relation) {
        $this->relation = $relation;
    }

    function toArray() : array {
        $info = array(
            "personne"=>$this->personne->toArray(),
            "relation"=>$this->relation->toArray()
        );
        return $info;
    }
}


?>