<?php
require_once '../../config/config.php';


// cree le fichier gpx 
// et retourne un objet GeoportailInfo
if($_SERVER["REQUEST_METHOD"] == "POST")  {

    verifyUserAuthentifie();

    $postdata = file_get_contents ("php://input");

     if (isset($postdata) && !empty ($postdata)) {
 
        $bodyobj = json_decode ($postdata);
        
        $result;
        $trajetid = $bodyobj->trajetid;
        $result = createGpxFileFromTrajetId($trajetid);

        // creation d'une ligne dans la table geoportail 
        // avec un token d'utilisation de 15 jours
        if (!$result->is_error()) {

            $gpxfile = $result->get_msg();
            $resultAndEntity = createMapTokenFromTrajetId($trajetid,  $gpxfile);
            
        } else {
            $resultAndEntity = buildResultAndEntityError($result->get_msg());
        }

        sendHttpEntityAndExit($resultAndEntity);
    
    } 
}





?>