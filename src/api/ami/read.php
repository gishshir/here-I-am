<?php
require_once '../config/config.php';

verifyUserAuthentifie();
if($_SERVER["REQUEST_METHOD"] == "GET")  {


    $resultAndDatas = displayListAmis();
    sendHttpDatasAndExit($resultAndDatas);

}



?>