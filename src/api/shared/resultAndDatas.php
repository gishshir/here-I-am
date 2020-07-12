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