<?php
require_once '../../config/config.php';

// retourne l'info geoportail pour le token
// verifie que le token est toujours valide
if($_SERVER["REQUEST_METHOD"] == "GET")  {

    if (isset($_GET["token"])) {
        
        $token = xssPreventFromGet("token");
        $resultAndEntity = findGeoportailInfo($token);

        //  verifier validité du token
        if (!$resultAndEntity->is_error()) {

            $endtime = $resultAndEntity->get_entity()->get_endtime();

            $date = new DateTime();
            $now = $date->getTimestamp();

            if ($endtime < $now) {

                $resultAndEntity = buildResultAndEntityError("le token n'est plus valide!");
            }
        }
        sendHttpEntityAndExit($resultAndEntity);
    
    } 
}

?>