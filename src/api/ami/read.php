<?php
require_once '../dao/amidao.php';



if($_SERVER["REQUEST_METHOD"] == "GET")  {


    $resultAndDatas = displayListAmis();
    sendHttpDatasAndExit($resultAndDatas);

    /*$test = "[{'type': 'toto'},{'type': 'titi'}]";
    echo json_encode ($test);*/

}



?>