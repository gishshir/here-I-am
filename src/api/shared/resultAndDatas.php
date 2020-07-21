<?php



class Resultat {
    
    private string $msg;
    private bool $error = false;
  
    function get_msg():string {
        return $this->msg;
    }
    function set_msg (string $msg) {
        $this->msg = $msg;
    }
    function set_error(bool $error) {
        $this->error = $error;
    }
    function is_error() : bool{
        return $this->error;
    }
}

class ResultAndBoolean extends Resultat {

    private bool $value;
    function get_value() : bool {
        return $this->value;
    }
    function set_value(bool $value) {
        $this->value = $value;
    }
}

class ResultAndEntity extends Resultat {
    
    private ?IEntity $entity;
    
    
    // objet ayant une methode toArray()
    function get_entity() : ?IEntity {
        return $this->entity;
    }
    function set_entity (?IEntity $entity) {
        $this->entity = $entity;
    }
    
}
class ResultAndDatas extends Resultat {
    
    private ?array $datas;
    
    // array d'objets ayant une methode toArray()
    function get_datas() : ?array {
        return $this->datas;
    }
    function set_datas (?array $datas) {
        $this->datas = $datas;
    }

    // array d'array
    function get_datasAsArrays ()  {

        // tableau de tableau
        $tab = array();
        foreach ($this->datas as $data) { 
            array_push($tab, $data->toArray());
        }
        return $tab;
    }
    
}



?>