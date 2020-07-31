<?php
require_once '../../config/config.php';


// recuperation d'une AmiRelation par idrelation
// du point de vue de l'ami
// permet de savoir si l'ami m'a accordé ou pas une autorisation de notification de ses déplacements
if($_SERVER["REQUEST_METHOD"] == "GET")  {

    verifyUserAuthentifie();
       
    $idrelation = xssPreventFromGet("idrelation");
    if ($idrelation != null) {

        $resultAndEntity = findAmiRelationDuPointVueAmi($_GET["idrelation"]);
        sendHttpEntityAndExit($resultAndEntity); 
    }
}

?>