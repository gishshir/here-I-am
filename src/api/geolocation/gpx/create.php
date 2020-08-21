<?php
require_once '../../config/config.php';


// cree le fichier gpx 
// et retourne le nom du fichier gpx (dans msg)
if($_SERVER["REQUEST_METHOD"] == "POST")  {

    verifyUserAuthentifie();

    $postdata = file_get_contents ("php://input");

     if (isset($postdata) && !empty ($postdata)) {
 
        $bodyobj = json_decode ($postdata);
        
        $result;
        $trajetid = $bodyobj->trajetid;
        $result = createGpxFileFromTrajetId($trajetid, DIR_GPX);

        sendHttpResponseAndExit($result);
    
    } 
}





?>