<?php
require_once '../shared/config.php';
require_once DIR_DAO.'relationdao.php';

// recuperation d'une RelationInfo par son id
//{"id":7,"etat":"pending","action":"invitation","amiaction":"none"}
if($_SERVER["REQUEST_METHOD"] == "GET")  {
       
    $idrelation = xssPreventFromGet("id");
    if ($idrelation != null) {
        $resultAndEntity = getRelationInfo($idrelation);
        sendHttpEntityAndExit($resultAndEntity);
    }
}

?>