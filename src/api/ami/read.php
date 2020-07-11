<?php
require_once '../dao/amidao.php';



if($_SERVER["REQUEST_METHOD"] == "GET")  {


    $resultAndDatas = displayListAmis();
    
    if ($resultAndDatas->is_error()) {

        sendHttpResultAndExit ($resultAndDatas);

    } else {

        sendHttpDatasAndExit($resultAndDatas->get_datasAsJson());    

    }
    

}



?>