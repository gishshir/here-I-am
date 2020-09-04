<?php
require_once '../config/config.php';

// insertion de position(s) pour un trajet
if($_SERVER["REQUEST_METHOD"] == "POST")  {

    verifyUserAuthentifie();
    
    
     $postdata = file_get_contents ("php://input");

     if (isset($postdata) && !empty ($postdata)) {
 
         $bodyobj = json_decode ($postdata);
         $listPositions = array();

         // insertion d'une liste de positions d'un trajet
         // (on efface les autres)
         if (is_array($bodyobj)) {

     
            foreach ((array)$bodyobj as $item) {
                $position = buildPositionFromObj($item);
                array_push($listPositions, $position);
            }
            

          } else {
    
            // insertion d'une position pour un trajet donné
            // au fil de l'eau
            // on ne garde que la dernière
            $position = buildPositionFromObj($bodyobj);
            array_push($listPositions, $position);
            
          }

          //echo var_dump ($listPositions);
          if (sizeof ($listPositions) > 0) {
            $result = insertTrajetListePositions($listPositions, true);
            sendHttpResponseAndExit($result);
          }
      }


}



?>