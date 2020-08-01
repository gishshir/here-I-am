<?php
require_once '../config/config.php';

// insertion d'une position pour un trajet donné
if($_SERVER["REQUEST_METHOD"] == "POST")  {

    verifyUserAuthentifie();
    
     // read-only stream that allows us to read raw data from the request body
     $postdata = file_get_contents ("php://input");

     if (isset($postdata) && !empty ($postdata)) {
 
         $bodyobj = json_decode ($postdata);
 
         $position = new Position();
         $position->set_trajetid($bodyobj->trajetid);
         
         $latitude = $bodyobj->latitude;
         $position->set_latitude($latitude);

         $longitude = $bodyobj->longitude;
         $position->set_longitude($longitude);
         $position->set_timestamp($bodyobj->timestamp);
 
         $result = insertTrajetPosition($position);
         sendHttpResponseAndExit($result);
     }


}



?>