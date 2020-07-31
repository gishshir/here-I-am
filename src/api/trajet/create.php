<?php
require_once '../config/config.php';

// liste des trajets de l'utilisateur couran
if($_SERVER["REQUEST_METHOD"] == "POST")  {

    verifyUserAuthentifie();
    
     // read-only stream that allows us to read raw data from the request body
     $postdata = file_get_contents ("php://input");

     if (isset($postdata) && !empty ($postdata)) {
 
         $bodyobj = json_decode ($postdata);
         
         $mean = (string) $bodyobj->mean;
 
         $trajet = new Trajet();
         $trajet->set_etat("Started");
         $trajet->set_starttime (time());
         $trajet->set_endtime(-1);
         $trajet->set_mean($mean);
 
         $resultAndEntity = createTrajet($trajet);
         sendHttpEntityAndExit($resultAndEntity);
     }


}



?>