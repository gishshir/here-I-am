<?php
require_once '../config/config.php';

// retourne une liste de position pour un trajet donné
// si aucune retourne []
if($_SERVER["REQUEST_METHOD"] == "GET")  {

    verifyUserAuthentifie();

    if (isset($_GET["trajetid"])) {
        
        $trajetid = xssPreventFromGet("trajetid");
        $resultAndDatas = findListPositionForTrajet($trajetid);
        sendHttpDatasAndExit($resultAndDatas);
    
    } 
}

?>