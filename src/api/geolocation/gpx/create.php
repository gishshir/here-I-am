<?php
require_once '../../config/config.php';


// cree le fichier gpx 
// et retourne un objet GeoportailInfo contenant un token
if($_SERVER["REQUEST_METHOD"] == "POST")  {

    verifyUserAuthentifie();

    $postdata = file_get_contents ("php://input");

     if (isset($postdata) && !empty ($postdata)) {
 
        $bodyobj = json_decode ($postdata);
        
        $result;
        $trajetid = $bodyobj->trajetid;
        $resultAndEntity = createGpxFileFromTrajetId($trajetid);  

        sendHttpEntityAndExit($resultAndEntity);
    
    } 
}





?>