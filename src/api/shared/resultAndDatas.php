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
    
    private array $datas;
    
    // array d'objets
    function get_datas() : array {
        return $this->datas;
    }
    function set_datas (array $datas) {
        $this->datas = $datas;
    }

    // array de json
    function get_datasAsJson () : array {

        $listjson = array();
        foreach ($this->datas as $data) { 
            array_push ($listjson, $data->toArray());
        }
        return $listjson;
    }
    
}



?>