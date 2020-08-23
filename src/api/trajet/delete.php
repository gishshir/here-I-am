<?php
require_once '../config/config.php';


if($_SERVER["REQUEST_METHOD"] == "DELETE")  {
    

    verifyUserAuthentifie();
    
    $postdata = file_get_contents ("php://input");

     if (isset($postdata) && !empty ($postdata)) {

        $bodyobj = json_decode ($postdata);

        $result; 
        $id = $bodyobj->id;
        if (isset($id)) {
            
            $result = deleteTrajet($id);
            if (!$result->is_error()) {
                deleteGpxfile($id);
            }

        } else {
            $result = buildResultatError ("paramètre de requete id absent!");
        }

        sendHttpResponseAndExit($result);      


    }

    

}


?>