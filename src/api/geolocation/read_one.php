<?php
require_once '../config/config.php';

// retourne la dernière position d'un trajet si existe
// sinon retourne une response/boolean : {"retour":false}
if($_SERVER["REQUEST_METHOD"] == "GET")  {

    verifyUserAuthentifie();

    if (isset($_GET["trajetid"])) {
        
        $resultAndEntity = findLastTrajetPosition((int)$_GET["trajetid"]);
    } 
    
    if (!$resultAndEntity->is_error()) {
        if ($resultAndEntity->get_entity()) {
            sendHttpEntityAndExit($resultAndEntity);
        } else {
            // pas de position trouvée
            $resultAndBoolean = buildResultAndBoolean("Pas de position trouvée!", false);
            sendHttpBooleanAndExit ($resultAndBoolean);
        }
    }
    

    //avec erreur
    sendHttpEntityAndExit($resultAndEntity);


}



?>