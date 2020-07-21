<?php
require_once '../shared/config.php';
require_once DIR_DAO.'trajetdao.php';



// liste des trajets de l'utilisateur couran
if($_SERVER["REQUEST_METHOD"] == "GET")  {

    if (isset($_GET["id"])) {
        $resultAndEntity = findTrajetById((int)$_GET["id"]);
    } else {
        $resultAndEntity = findLastTrajet();
    }
    
    sendHttpEntityAndExit($resultAndEntity);


}



?>