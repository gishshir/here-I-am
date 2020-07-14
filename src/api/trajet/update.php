<?php
require_once '../dao/trajetdao.php';

if($_SERVER["REQUEST_METHOD"] == "PUT")  {
    
    
    // read-only stream that allows us to read raw data from the request body
    $postdata = file_get_contents ("php://input");

    if (isset($postdata) && !empty ($postdata)) {

        $bodyobj = json_decode ($postdata);

        $id = (int)$bodyobj->id;
        $etat = (string) $bodyobj->etat;

        if ($id == null || $id < 1) {
            sendHttpErrorAndExit ("id trajet ".$id." non valide!");
        }

        // calcul endtime
        $endtime = $etat === "Ended" ? time(): -1;
        

        $trajet = new Trajet();
        $trajet->set_id($id);
        $trajet->set_etat($etat);
        $trajet->set_endtime($endtime);

        $resultAndEntity = updateTrajet($trajet);
        sendHttpEntityAndExit($resultAndEntity);
        

    }

}


?>