<?php
require_once '../shared/config.php';
require_once DIR_DAO.'relationdao.php';

if($_SERVER["REQUEST_METHOD"] == "PUT")  {
    
    
    // read-only stream that allows us to read raw data from the request body
    $postdata = file_get_contents ("php://input");

    if (isset($postdata) && !empty ($postdata)) {

        $bodyobj = json_decode ($postdata);

        // modification action sur une relation
        if (isset($bodyobj->action)) {

            $idrelation = (int)$bodyobj->idrelation;
            $action = (string) $bodyobj->action;

            if ($idrelation == null || $idrelation < 1) {
                sendHttpErrorAndExit ("idrelation ".$idrelation." non valide!");
            }

            $resultat = updateActionRelation($idrelation, $action);
            sendHttpResponseAndExit($resultat);
        } 


    }
        


}


?>