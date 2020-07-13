<?php
require_once '../dao/amidao.php';



if($_SERVER["REQUEST_METHOD"] == "GET")  {


    $resultAndDatas = displayListAmis();
    sendHttpDatasAndExit($resultAndDatas);

}



?>