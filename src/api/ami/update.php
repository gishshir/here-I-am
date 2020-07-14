<?php
require_once '../dao/amidao.php';

if($_SERVER["REQUEST_METHOD"] == "PUT")  {
    
    
    // read-only stream that allows us to read raw data from the request body
    $postdata = file_get_contents ("php://input");

    if (isset($postdata) && !empty ($postdata)) {

        $bodyobj = json_decode ($postdata);

        // modification suivi d'une relation
        if (isset($bodyobj->suivre)) {

            $idrelation = (int)$bodyobj->idrelation;
            $suivre = (bool) $bodyobj->suivre;

            if ($idrelation == null || $idrelation < 1) {
                sendHttpErrorAndExit ("idrelation ".$idrelation." non valide!");
            }

            $resultat = updateSuiviRelation($idrelation, $suivre);
            sendHttpResponseAndExit($resultat);
        } 
        //modification notification d'une relation
        else if (isset($bodyobj->notifier)) {

            $idrelation = (int)$bodyobj->idrelation;
            $notifier = (bool) $bodyobj->notifier;

            if ($idrelation == null || $idrelation < 1) {
                sendHttpErrorAndExit ("idrelation ".$idrelation." non valide!");
            }
            $listIdRelationEtNotifier = array ($bodyobj);
            $resultat = updateNotifierAmis($listIdRelationEtNotifier);
            sendHttpResponseAndExit($resultat);
        }

        // modification des notifications d'une liste d'amis
        else {
            $listIdRelationEtNotifier = $bodyobj;
            $resultat = updateNotifierAmis($listIdRelationEtNotifier);
            sendHttpResponseAndExit($resultat);

        }

    }
        


}


?>