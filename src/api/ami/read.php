<?php
require_once '../config.php';

verifyUserAuthentifie();
if($_SERVER["REQUEST_METHOD"] == "GET")  {


    $resultAndDatas = displayListAmis();
    sendHttpDatasAndExit($resultAndDatas);

}



?>