<?php
require_once '../shared/config.php';


/**
 * Retourne le compte par son login si existe
 * sinon null
 */
if($_SERVER["REQUEST_METHOD"] == "GET")  {

    

    $user = getCurrentUserFromSession();
    echo "utilisateur courant: " .var_dump($user);
    $resultAndEntity = buildResultAndEntity("Retourne utilisateur si existe", $user);
     
    sendHttpEntityAndExit($resultAndEntity);

}



?>