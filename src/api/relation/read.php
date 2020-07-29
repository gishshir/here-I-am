<?php
require_once '../config.php';


// recuperation d'une RelationInfo par son id
//{"id":7,"etat":"pending","action":"invitation","amiaction":"none"}
if($_SERVER["REQUEST_METHOD"] == "GET")  {

    verifyUserAuthentifie();
       
    $idrelation = xssPreventFromGet("id");
    if ($idrelation != null) {
        $resultAndEntity = getRelationInfo((int)$idrelation);
        sendHttpEntityAndExit($resultAndEntity);
    }
}

?>