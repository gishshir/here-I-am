<?php
require_once '../../config/config.php';

// appelé depuis exterieur de l'application
// pour affichage Map geoportail
// le token tient lieu d'identification

// retourne l'info geoportail pour le token
// verifie que le token est toujours valide
if($_SERVER["REQUEST_METHOD"] == "GET")  {

    if (isset($_GET["token"])) {
        
        $token = xssPreventFromGet("token");
        $result = verifyToken($token);
        
        if (!$result->is_error()) {

           $resultAndEntity = findGeoportailInfo($token);
        }  else {

            $resultAndEntity = buildResultAndEntityError($result->get_msg());
        }
        sendHttpEntityAndExit($resultAndEntity);
    
    } 
}

?>