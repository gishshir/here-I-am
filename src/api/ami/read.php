<?php
require_once '../config/database.php';



if($_SERVER["REQUEST_METHOD"] == "GET")  {

    global $listAmis;

    $listjson = array();
    foreach ($listAmis as $ami) {
        //echo var_dump($ami->toArray()); 
        array_push ($listjson, $ami->toArray());
    }
    
    sendHttpDatasAndExit($listjson);

}



?>