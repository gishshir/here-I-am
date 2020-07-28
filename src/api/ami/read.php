<?php
require_once '../shared/config.php';
require_once DIR_DAO.'amidao.php';


verifyUserAuthentifie();
if($_SERVER["REQUEST_METHOD"] == "GET")  {


    $resultAndDatas = displayListAmis();
    sendHttpDatasAndExit($resultAndDatas);

}



?>