<?php
require_once '../shared/config.php';
require_once DIR_DAO.'trajetdao.php';


// retourne un trajet de l'utilisateur courant
// si pas id retourne le dernier trajet si existe
// sinon retourne une chaine vide
if($_SERVER["REQUEST_METHOD"] == "GET")  {

    verifyUserAuthentifie();

    if (isset($_GET["id"])) {
        $resultAndEntity = findTrajetById((int)$_GET["id"]);
    } else {
        $resultAndEntity = findLastTrajet();
    }
    
    if (!$resultAndEntity->is_error()) {
        if ($resultAndEntity->get_entity()) {
            sendHttpEntityAndExit($resultAndEntity);
        } else {
            // pas de trajet trouvé
            $resultAndBoolean = buildResultAndBoolean("Pas de trajet trouvé!", false);
            sendHttpBooleanAndExit ($resultAndBoolean);
        }
    }
    

    //avec erreur
    sendHttpEntityAndExit($resultAndEntity);


}



?>