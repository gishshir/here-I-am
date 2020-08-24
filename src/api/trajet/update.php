<?php
require_once '../config/config.php';

if($_SERVER["REQUEST_METHOD"] == "PUT")  {

    verifyUserAuthentifie();
    
    // read-only stream that allows us to read raw data from the request body
    $postdata = file_get_contents ("php://input");

    if (isset($postdata) && !empty ($postdata)) {

        $bodyobj = json_decode ($postdata);

        $id = (int)$bodyobj->id;
        if ($id == null || $id < 1) {
            sendHttpErrorAndExit ("id trajet ".$id." non valide!");
        }

        // mise à jour etat du trajet
        if (isset ($bodyobj->etat)) {
            $etat = (string) $bodyobj->etat;

            // calcul endtime
            $endtime = $etat === "Ended" ? time(): -1;        

            $trajet = new Trajet();
            $trajet->set_id($id);
            $trajet->set_etat($etat);
            $trajet->set_endtime($endtime);

            $resultAndEntity = updateStateTrajet($trajet);
            sendHttpEntityAndExit($resultAndEntity);
        }

        // mise à jour du moyen de transport
        if (isset($bodyobj->mean)) {

            $mean = $bodyobj->mean;

            $resultAndEntity = updateMeanTrajet($id, $mean);
            sendHttpEntityAndExit($resultAndEntity);
        }
        

    }

}


?>