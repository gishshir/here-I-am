<?php
require_once '../config/config.php';

// retourne une liste de position pour un trajet donné
// sous forme d'un fichier gpx
// si aucune retourne une response/boolean : {"retour":false}
if($_SERVER["REQUEST_METHOD"] == "GET")  {

    verifyUserAuthentifie();

    if (isset($_GET["trajetid"])) {
        
        $resultAndDatas = findListPositionForTrajet(xssPreventFromGet("trajetid"));
        sendHttpDatasAndExit($resultAndDatas);
    
    } 
    
    


}



?>