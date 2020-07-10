<?php
require_once '../config/database.php';

if($_SERVER["REQUEST_METHOD"] == "PUT")  {

   $listAmis = getListeAmis();
    
    
    // read-only stream that allows us to read raw data from the request body
    $postdata = file_get_contents ("php://input");

    if (isset($postdata) && !empty ($postdata)) {

        $body = json_decode ($postdata);
        $amiFromRequest = Ami::fromJson ($body);

        $id =  $amiFromRequest->get_id();
        if ($id < 1) {
            sendHttpMessage ("ami.id ".$id." non valide!", 400, true);
        }

        //
        for($i = 0; $i < count($listAmis); ++$i) {

            $amiBdd = $listAmis[$i];
            if ($id == $amiBdd->get_id()){

                // mise à jour etat de suivi uniquement
                $amiBdd->set_suivre($amiFromRequest->is_suivre()); 
                sendHttpMessage ("Update OK!", 200, false);
            }
        }
        
        sendHttpMessage ("ami.id ".$id." n'existe pas!", 400, true);

    }

}

?>